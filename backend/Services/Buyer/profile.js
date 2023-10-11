const  client  =  require("../../config");

exports.buyer_profile = async (req, res) => {
    const {sID} = req.body;
    const ID = sID.substring(1, sID.length - 1);
    console.log(ID);
    try {
        // Checking if user already exists
        const result  =  await client.query(`SELECT * FROM buyer WHERE id = $1;`, [ID]);
        const arr = result.rows;
        if (arr.length  ===  0) {
            return  res.status(400).json({
                error: "ID not present. Please try again",
            });
        }
        else {
            return res.status(200).json({
                "ID" : ID,
                "Name" : arr[0]['username'],
                "Address" : arr[0]['address'],
                "Email" : arr[0]['email']
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