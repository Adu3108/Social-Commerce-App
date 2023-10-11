const  client  =  require("../../config");

function TotalIDList(){
    var IDs = []
    for (let i = 0; i < 1024; i++) { 
        IDs.push(i.toString(2).padStart(10, '0'));
    }
    return IDs;
}

function PresentIDList(jsons){
    var IDs = []
    for (let i = 0; i < jsons.length; i++) { 
        IDs.push(jsons[i]["id"]);
    }
    return IDs;
}

exports.new_review = async (req, res) => {
    const {sID, bID, iID, tID, desc, stars} = req.body;
    const value = parseInt(stars);
    console.log(value);
    try {
        const IDs  =  await client.query(`SELECT ID FROM review;`);
        const present = PresentIDList(IDs.rows);
        const total = TotalIDList();
        const available = total.filter(x => !present.includes(x));
        const item = available[Math.floor(Math.random()*available.length)];
        const entry = await client.query(`INSERT INTO review (ID, sale_id, seller_id, buyer_id, comment, transaction_id, stars) VALUES ($1, $2, $3, $4, $5, $6, $7);`, [item, iID, sID, bID, desc, tID, value]); 
        res.status(200).json({
            status : 'The Item has been successfully added',
        });
    }
    catch (err) {
        res.status(500).json({
            error: "Database error occurred while adding the new item! Please check your input fields.", 
        });
    };
}