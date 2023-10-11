const  client  =  require("../../config");

exports.review_info = async (req, res) => {
    const {tID} = req.body;
    try {
        // Checking if user already exists
        const result  =  await client.query(`SELECT buyer_id AS buyer, seller_id AS seller, sale_id AS itemid FROM transaction WHERE transaction_id = $1;`, [tID]);
        const arr = result.rows;
        if (arr.length  ===  0) {
            return  res.status(400).json({
                error: "ID not present. Please try again",
            });
        }
        else {
            return res.status(200).json({
                "buyer" : arr[0]['buyer'],
                "seller" : arr[0]['seller'],
                "itemid" : arr[0]['itemid']
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