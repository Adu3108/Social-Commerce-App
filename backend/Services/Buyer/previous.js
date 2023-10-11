const  client  =  require("../../config");

exports.previous = async (req, res) => {
    var bID = req.params.buyer_id;
    bID = bID.substring(1, bID.length - 1);
    try {
        const data  =  await client.query(`SELECT * FROM buyer WHERE ID=$1;`, [bID]);
        var prev_delivery = await client.query("SELECT transaction.transaction_id AS transactionID, transaction.sale_id AS ItemID, transaction.seller_id AS SellerID, sale.name AS ItemName, sale.price AS price, seller.username AS SellerName, transaction.quantity AS quantity, transaction.transaction_status AS Status FROM transaction JOIN sale ON transaction.sale_id=sale.ID JOIN seller ON seller.ID=sale.seller_id WHERE transaction.buyer_id=$1 AND transaction.transaction_status!='PENDING' AND transaction.delivery_date<=NOW() order by sale.name;", [bID]);
        var later_delivery = await client.query("SELECT transaction.delivery_date AS date, transaction.transaction_id AS transactionID, transaction.sale_id AS ItemID, transaction.seller_id AS SellerID, sale.name AS ItemName, sale.price AS price, seller.username AS SellerName, transaction.quantity AS quantity, transaction.transaction_status AS Status FROM transaction JOIN sale ON transaction.sale_id=sale.ID JOIN seller ON seller.ID=sale.seller_id WHERE transaction.buyer_id=$1 AND transaction.transaction_status!='PENDING' AND transaction.delivery_date>NOW() order by sale.name;", [bID]);
        var deliverydates = await client.query(`SELECT delivery_date FROM transaction WHERE buyer_id=$1 AND delivery_date>NOW();`, [bID]);
        const arr = data.rows;
        deliverydates = deliverydates.rows;
        later_delivery = later_delivery.rows;
        prev_delivery = prev_delivery.rows;
        if (arr.length  ===  0) {
            return  res.status(400).json({
                error: "ID not present. Please try again",
            });
        }
        else {
            return res.status(200).json({"buyerInfo" : arr, "PrevDelivery": prev_delivery, "LaterDelivery" : later_delivery, "deliverydates" : deliverydates,});
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