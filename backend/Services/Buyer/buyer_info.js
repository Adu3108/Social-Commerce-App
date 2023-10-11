const  client  =  require("../../config");
// const w2v = require('word2vec');

// function recommend(current_sale_list, previous_buy_list){
//     var t = 0;
//     var ind = 0;
//     for (let i = 0; i < current_sale_list.length; i++) {
//         var m = 0;
//         for (let j = 0; i < previous_buy_list.length; j++) {
//             m += w2v(current_sale_list[i], previous_buy_list[j]);
//         }
//         if (m > t){
//             t = m;
//             ind = i;
//         }
//     }
//     return current_sale_list[ind];
// }

exports.buyer_info = async (req, res) => {
    var bID = req.params.buyer_id;
    bID = bID.substring(1, bID.length - 1);
    try {
        const data  =  await client.query(`SELECT * FROM buyer WHERE ID=$1;`, [bID]);
        const sales = await client.query("SELECT sale.id AS item_id, sale.name AS item_name, sale.price AS price, sale.quantity AS quantity, sale.seller_id AS seller_id, seller.username AS seller_name FROM sale JOIN seller ON sale.seller_id=seller.id WHERE sale.status='ACTIVE' AND sale.quantity>0 AND sale.seller_id!=$1 order by sale.name;", [bID]);
        const search_result = await client.query("SELECT sale.name AS name, sale.type AS id, sale.ID AS itemid FROM sale JOIN seller ON sale.seller_id=seller.id WHERE sale.status='ACTIVE' AND sale.quantity>0 AND sale.seller_id!=$1 order by sale.name;", [bID]);
        const pending = await client.query("SELECT transaction.transaction_id AS transactionID, transaction.sale_id AS ItemID, transaction.seller_id AS SellerID, sale.name AS ItemName, sale.price AS price, seller.username AS SellerName, transaction.quantity AS quantity FROM transaction JOIN sale ON transaction.sale_id=sale.ID JOIN seller ON transaction.seller_id=seller.ID WHERE transaction.buyer_id=$1 AND transaction.transaction_status='PENDING' order by sale.name;", [bID]);
        const purchases = await client.query("SELECT transaction.transaction_id AS transactionID, transaction.sale_id AS ItemID, transaction.seller_id AS SellerID, sale.name AS ItemName, sale.price AS price, seller.username AS SellerName, transaction.quantity AS quantity, transaction.transaction_status AS Status FROM transaction JOIN sale ON transaction.sale_id=sale.ID JOIN seller ON seller.ID=sale.seller_id WHERE transaction.buyer_id=$1 AND transaction.transaction_status!='PENDING' order by sale.name;", [bID]);
        const category = await client.query("SELECT DISTINCT type, COUNT(*) AS c FROM sale WHERE sale.status='ACTIVE' AND sale.quantity>0 AND sale.seller_id!=$1 GROUP BY type order by c DESC;", [bID]);
        const arr = data.rows;
        const Sale_items = sales.rows;
        const Purchase_items = purchases.rows;
        const Pending_items = pending.rows;
        const search_items = search_result.rows;
        const categories = category.rows;
        if (arr.length  ===  0) {
            return  res.status(400).json({
                error: "ID not present. Please try again",
            });
        }
        else {
            // const recommendation = recommend(Sale_items, Purchase_items);
            // console.log(recommendation);
            return res.status(200).json({"buyerInfo" : arr, "SaleItems" : Sale_items, "PendingItems" : Pending_items, "PurchaseItems": Purchase_items, "Search" : search_items, "Categories": categories});
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