const db = require("../config/db");

const login = (username, password, callback) => {

    const sql =
        "SELECT * FROM users WHERE username = ? AND password = ?";

    db.query(sql, [username, password], callback);

};

module.exports = {
    login
};