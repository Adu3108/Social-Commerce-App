const  client  =  require("../../config");

exports.image = async (req, res) => {
    const filename = req.file.originalname;
    const iID = req.params.item_id;
    try {
        const entry = await client.query(`UPDATE sale SET image=$1 WHERE ID = $2;`, [filename, iID]); 
        res.status(200).json({
            status : 'The Image has been successfully added',
        });
    }
    catch (err) {
        res.status(500).json({
            error: "Database error occurred while adding the new item! Please check your input fields.", 
        });
    };
}