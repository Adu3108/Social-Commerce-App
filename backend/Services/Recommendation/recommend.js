const  client  =  require("../../config");

exports.recommend = async (req, res) => {
    const {iID} = req.body;
    console.log(iID);
    try {
        // Checking if user already exists
        const result = await client.query(`SELECT sale.name AS name, seller.username AS sellername, seller.ID AS sellerid FROM sale JOIN seller ON sale.seller_id=seller.ID WHERE sale.ID = $1;`, [iID]);
        const arr = result.rows;
        if (arr.length  ===  0) {
            return  res.status(500).json({
                error: "ID not present. Please try again",
            });
        }
        else {
            return res.status(200).json({
                "name" : arr[0]['name'],
                "sellername" : arr[0]['sellername'],
                "sellerid" : arr[0]['sellerid']
            });
        }
    }
    // Database connection error
    catch (err) {
        console.log(err);
        return res.status(500).json({
            error: "Database error while registring user!", 
        });
    };
}