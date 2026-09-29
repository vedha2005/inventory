const authModel = require("../models/authModel");

const login = (req, res) => {
    const { username, password } = req.body;

    authModel.login(username, password, (err, result) => {

        if (err) {
            console.log("Login Error:", err);

            return res.status(500).json({
                success: false,
                message: "Database Error"
            });
        }

        if (result.length === 0) {
            return res.status(401).json({
                success: false,
                message: "Invalid username or password"
            });
        }

        const user = result[0];

        res.status(200).json({
            success: true,
            message: "Login successful",
            user: {
                username: user.username,
                role: user.role,
                branch_id: user.branch_id
            }
        });
    });
};

module.exports = {
    login
};