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

exports.new_item = async (req, res) => {
    const {sID, name, quantity, price, dimensions, description, type} = req.body;
    const parseQuantity = parseInt(quantity);
    const parsePrice = parseInt(price);
    try {
        const IDs  =  await client.query(`SELECT ID FROM sale;`);
        const present = PresentIDList(IDs.rows);
        const total = TotalIDList();
        const available = total.filter(x => !present.includes(x));
        const item = available[Math.floor(Math.random()*available.length)];
        const entry = await client.query(`INSERT INTO sale (ID, name, price, dimensions, type, quantity, status, seller_id, description) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);`, [item, name, parsePrice, dimensions, type, parseQuantity, 'ACTIVE', sID, description]); 
        res.status(200).json({
            status : 'The Item has been successfully added',
            ID: item
        });
    }
    catch (err) {
        res.status(500).json({
            error: "Database error occurred while adding the new item! Please check your input fields.", 
        });
    };
}