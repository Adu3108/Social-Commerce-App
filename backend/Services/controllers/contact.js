const  client  =  require("../../config");

exports.contact_info = async (req, res) => {
    const {uID} = req.body;
    try {
        // Checking if user already exists
        const buyer  =  await client.query(`SELECT * FROM buyer WHERE id = $1;`, [uID]);
        const seller  =  await client.query(`SELECT * FROM seller WHERE id = $1;`, [uID]);
        const buyer_result = buyer.rows;
        const seller_result = seller.rows;
        if (buyer_result.length  ===  0 && seller_result.length === 0) {
            return  res.status(400).json({
                error: "ID not present. Please try again",
            });
        }
        else {
            return res.status(200).json({
                "ID" : uID,
                "Name" : buyer_result[0]['username'],
                "Buyer Email" : buyer_result[0]['email'],
                "Seller Email" : seller_result[0]['email']
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