const  client  =  require("../../config");

exports.product_info = async (req, res) => {
    var iID = req.params.product_id;
    try {
        // Checking if user already exists
        const result  =  await client.query(`SELECT sale.image AS image, sale.name AS name, sale.price AS price, sale.type AS category, sale.dimensions AS dimensions, sale.quantity AS quantity, seller.username AS sellername, sale.description AS desc, seller.ID AS sellerid FROM sale JOIN seller ON sale.seller_id=seller.ID WHERE sale.ID = $1;`, [iID]);
        const review  =  await client.query(`SELECT buyer.ID as buyerid, buyer.username AS buyername, review.comment AS comment, review.stars AS stars FROM review JOIN buyer ON review.buyer_id=buyer.ID WHERE review.sale_id = $1;`, [iID]);
        const arr = result.rows;
        if (arr.length  ===  0) {
            return  res.status(400).json({
                error: "ID not present. Please try again",
            });
        }
        else {
            return res.status(200).json({
                "name" : arr[0]['name'],
                "price" : arr[0]['price'],
                "category" : arr[0]['category'],
                "dimensions" : arr[0]['dimensions'],
                "quantity" : arr[0]['quantity'],
                "sellername" : arr[0]['sellername'],
                "desc" : arr[0]['desc'],
                "sellerid" : arr[0]['sellerid'],
                "review" : review.rows,
                "image" : arr[0]['image']
            });
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