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
        IDs.push(jsons[i]["transaction_id"]);
    }
    return IDs;
}

exports.transactions = async (req, res) => {
    const {buyer_id, seller_id, sale_id, quantity} = req.body;
    const updated_quantity = parseInt(quantity);
    try {
        const quantity_update = await client.query(`UPDATE sale SET quantity=quantity-$1 WHERE id = $2 and seller_id=$3;`, [updated_quantity, sale_id, seller_id]);
        const IDs  =  await client.query(`SELECT transaction_id FROM transaction;`);
        const present = PresentIDList(IDs.rows);
        const total = TotalIDList();
        const available = total.filter(x => !present.includes(x));
        const finalID = available[Math.floor(Math.random()*available.length)];
        const transaction_update  =  await client.query(`INSERT INTO transaction (transaction_id, buyer_id, seller_id, sale_id, transaction_status, quantity) VALUES ($1, $2, $3, $4, $5, $6);`, [finalID, buyer_id, seller_id, sale_id, "PENDING", updated_quantity]);
        return res.status(200).json({"status" : "OK"});
    }
    // Database connection error
    catch (err) {
        console.log(err);
        res.status(500).json({
            error: "Database error during transaction!", 
        });
    };
}