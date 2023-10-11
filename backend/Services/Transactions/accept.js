const  client  =  require("../../config");

exports.accept = async (req, res) => {
    const {tID, date} = req.body;
    try {
        const cancel_transactions = await client.query(`UPDATE transaction SET transaction_status='OK', delivery_date=$1 WHERE transaction_id=$2;`, [date, tID]);
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