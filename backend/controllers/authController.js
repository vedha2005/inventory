const db = require("../config/db");

const login = (req, res) => {

    const { username, password } = req.body;

    const sql = "SELECT * FROM users WHERE username = ? AND password = ?";

    db.query(sql, [username, password], (err, result) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }

        if (result.length > 0) {

            res.json({
                success: true,
                message: "Login Successful"
            });

        } else {

            res.json({
                success: false,
                message: "Invalid Username or Password"
            });

        }

    });

};

module.exports = { login };