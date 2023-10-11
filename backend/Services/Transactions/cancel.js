const  client  =  require("../../config");

exports.cancel = async (req, res) => {
    const {tID, iID} = req.body;
    try {
        var quantity = await client.query(`SELECT quantity FROM transaction WHERE transaction_id=$1;`, [tID]);
        quantity = quantity.rows;
        quantity = parseInt(quantity[0]['quantity']);
        console.log(quantity);
        const quantity_update = await client.query(`UPDATE sale SET quantity=quantity+$1 WHERE ID=$2;`, [quantity, iID]);
        const cancel_transactions = await client.query(`UPDATE transaction SET transaction_status='FAIL' WHERE transaction_id=$1;`, [tID]);
        return res.status(200).json({"Status" : "OK"});
    }
    // Database connection error
    catch (err) {
        console.log(err);
        res.status(500).json({
            error: "Database error during transaction!", 
        });
    };
}