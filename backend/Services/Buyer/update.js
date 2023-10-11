const  client  =  require("../../config");

exports.update_info = async (req, res) => {
    const {sID} = req.body;
    var ID = sID.substring(1, sID.length - 1);
    try {
        // Checking if user already exists
        const data  =  await client.query(`SELECT email FROM buyer WHERE id=$1;`, [ID]);
        const arr = data.rows;
        if (arr.length  ===  0) {
            return res.status(200).json({"message" : "No"});
        }
        else {
            if(arr[0]['email']===null){
                return res.status(200).json({"message" : "No"});
            }
            else{
                return res.status(200).json({"message" : "Yes"});
            }
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
