const  bcrypt  =  require("bcrypt");

const  client  =  require("../../config");

exports.register  =  async (req, res) => {
    const { ID, name, password } =  req.body;
    try {
        // Checking if user already exists
        const  data  =  await client.query(`SELECT * FROM user_password WHERE ID=$1;`, [ID]); 
        const  arr  =  data.rows;
        if (arr.length  !=  0) {
            return  res.status(400).json({
                error: "ID already there, No need to register again.",
            });
        }
        else {
            const base =  await client.query(`INSERT INTO user_base (ID, name) VALUES ($1, $2);`, [ID, name]);
            const seller =  await client.query(`INSERT INTO seller (ID, username, address, email) VALUES ($1, $2, $3, $4);`, [ID, name, null, null]);
            const buyer =  await client.query(`INSERT INTO buyer (ID, username, address, email) VALUES ($1, $2, $3, $4);`, [ID, name, null, null]);
            bcrypt.hash(password, 10, (err, hash) => {
                if (err){
                    res.status(err).json({
                        error: "Server error",
                    });
                }
                const  user  = {
                    ID,
                    password: hash,
                };

                // Inserting data into the database
                client.query(`INSERT INTO user_password (ID, hashed_password) VALUES ($1, $2);`, [user.ID, user.password], (err) => {
                    if (err) {
                        res.status(500).json({
                            error: "Database error"
                        })
                    }
                    else {
                        res.status(200).json({
                            status : 'OK',
                        });
                    }
                })
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