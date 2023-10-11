const  client  =  require("../../config");

exports.seller_info = async (req, res) => {
    var sID = req.params.seller_id;
    sID = sID.substring(1, sID.length - 1);
    try {
        // Checking if user already exists
        const data  =  await client.query(`SELECT * FROM seller WHERE ID=$1;`, [sID]);
        const current_sales = await client.query("SELECT * from sale where seller_id=$1 order by name;", [sID]);
        const pending = await client.query("SELECT transaction.transaction_id AS transactionID, transaction.sale_id AS ItemID, transaction.buyer_id AS BuyerID, sale.name AS ItemName, sale.price AS price, buyer.username AS BuyerName, transaction.quantity AS quantity FROM transaction JOIN sale ON transaction.sale_id=sale.ID JOIN buyer ON transaction.buyer_id=buyer.ID WHERE transaction.seller_id=$1 AND transaction.transaction_status='PENDING' order by sale.name;", [sID]);
        const previous_sales = await client.query("SELECT transaction.sale_id AS ItemID, transaction.buyer_id AS BuyerID, sale.name AS ItemName, sale.price AS price, buyer.username AS BuyerName, transaction.quantity AS quantity, transaction.transaction_status AS Status FROM transaction JOIN sale ON transaction.sale_id=sale.ID JOIN buyer ON buyer.ID=transaction.buyer_id WHERE transaction.seller_id=$1 AND transaction.transaction_status!='PENDING' order by sale.name;", [sID]);
        const arr = data.rows;
        const current_sale_list = current_sales.rows;
        const pending_list = pending.rows;
        const previous_sale_list = previous_sales.rows;
        if (arr.length  ===  0) {
            return  res.status(400).json({
                error: "ID not present. Please try again",
            });
        }
        else {
            return res.status(200).json({"sellerInfo" : arr, "CurrentSales" : current_sale_list, "PendingSales": pending_list, "PreviousSales" : previous_sale_list});
        }
    }
    // Database connection error
    catch (err) {
        console.log(err);
        res.status(500).json({
            error: "Database error while registring user!", 
        });
    };
}
