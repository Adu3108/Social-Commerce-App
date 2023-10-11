const bcrypt = require("bcrypt");

const client = require("../../config");

//Login Function
exports.login = async (req, res) => {
    const { ID, password } = req.body;
    try {
        const data = await client.query(`SELECT * FROM user_password WHERE ID= $1;`, [ID]) //Verifying if the user exists in the database
        const user = data.rows;
        if (user.length === 0) {
            res.status(400).json({
                error: "User is not registered, Sign Up first",
            });
        }
        else {
            bcrypt.compare(password, user[0].hashed_password, (err, result) => { //Comparing the hashed password
                if (err) {
                    res.status(500).json({
                        error: "Server error",
                    });
                }       
                else {
                    // Declaring the errors
                    if (result != true)
                        res.status(400).json({
                            error: "Enter correct password!",
                        });
                    else{
                        req.session.message = ID;
                        res.status(200).json({
                            status : 'OK',
                        });
                    }
                }
            })
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: "Database error occurred while signing in!", 
        });
    };
};