const  client  =  require("../../config");

exports.decrement = async (req, res) => {
    const {iID, quantity, sID} = req.body;
    const updated_quantity = parseInt(quantity) - 1;
    try {
        /* UPDATE sale SET quantity = $2-1 WHERE id = $1; */
            if(updated_quantity<=0){
                const delete_entry = await client.query(`DELETE FROM sale WHERE id=$1 and seller_id=$2;;`, [iID, sID]);
                res.status(201).json({
                    message: "You have succesfully deleted this item",
                });
            }
            else{
                const entry = await client.query(`UPDATE sale SET quantity=$1 WHERE id = $2 and seller_id=$3;`, [updated_quantity, iID, sID]);
                res.status(200).json({
                    message: "You have succesfully reduced the quantity of this item",
                });
            }   
        }
    catch (err) {
        res.status(500).json({
            error: "Database error occurred while registering!", 
        });
    };
}