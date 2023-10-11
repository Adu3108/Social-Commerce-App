const client = require("../../config");

//Login Function
exports.increment = async (req, res) => {
    const {iID, quantity, sID} = req.body;
    const updated_quantity = parseInt(quantity) + 1;
    try {
        /* UPDATE sale SET quantity = $2-1 WHERE id = $1; */
            const entry = await client.query(`UPDATE sale SET quantity=$1 WHERE id = $2 and seller_id=$3;`, [updated_quantity, iID, sID]);
            res.status(200).json({
                message: "You have succesfully registered for this course",
            });
        }
    catch (err) {
        res.status(500).json({
            error: "Database error occurred while registering!", 
        });
    };
};