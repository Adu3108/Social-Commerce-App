const  client  =  require("../../config");

exports.category = async (req, res) => {
    const CategoryName = req.params.category_name;
    const {bID} = req.body;
    try {
        const sales = await client.query("SELECT sale.id AS item_id, sale.name AS item_name, sale.price AS price, sale.quantity AS quantity, sale.seller_id AS seller_id, seller.username AS seller_name FROM sale JOIN seller ON sale.seller_id=seller.id WHERE sale.status='ACTIVE' AND sale.quantity>0 AND sale.seller_id!=$1 AND sale.type=$2 order by sale.name;", [bID, CategoryName]);
        const sales_result = sales.rows;
        if (sales_result.length  ===  0) {
            return  res.status(400).json({
                error: "Category not present. Please try again",
            });
        }
        else {
            return res.status(200).json({"Products" : sales_result});
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