const  client  =  require("../../config");

exports.delete_item = async (req, res) => {
    const {iID, sID} = req.body;
    try {
        const delete_item = await client.query(`DELETE FROM sale WHERE id=$1 and seller_id=$2;`, [iID, sID]);
        res.status(200).json({
            message: "You have succesfully deleted this item entry",
        });
    }
    // Database connection error
    catch (err) {
        res.status(500).json({
            error: "Database error while deleting the item", 
        });
    };
}