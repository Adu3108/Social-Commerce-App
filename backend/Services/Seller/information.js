const  client  =  require("../../config");

exports.user_info = async (req, res) => {
    const {sID, email, address} = req.body;
    var ID = sID.substring(1, sID.length - 1);
    try {
        // Checking if user already exists
        const address_result  =  await client.query(`UPDATE seller SET address=$1 WHERE id = $2;`, [address, ID]);
        const email_result  =  await client.query(`UPDATE seller SET email=$1 WHERE id = $2;`, [email, ID]);
        return res.status(200).json({"Status" : "OK"});
    }
    // Database connection error
    catch (err) {
        console.log(err);
        res.status(500).json({
            error: "Database error while registring user!", 
        });
    };
}
