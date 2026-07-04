// Import the SAME unified model
let User = require("../models/usermodel"); 
let bcrypt = require("bcrypt");
let jwt = require("jsonwebtoken");

let lgcont = async (req, res) => {
    try {
        let { username, pwd } = req.body;
        if (!username || !pwd) {
            return res.status(400).json({ "err": "Username and password required" });
        }

        // NOW it searches the exact same 'users' collection where data was saved!
        let data = await User.findOne({ username: username.trim() });
        if (!data) {
            return res.status(401).json({ "msg": "Invalid credentials" });  
        }

        let isMatch = await bcrypt.compare(pwd, data.pwd);
        if (isMatch) {
            let token = jwt.sign({ "_id": data._id }, "YOUR_JWT_SECRET", { expiresIn: "1h" });
            return res.status(200).json({ "token": token, "username": data.username });
        } else {
            return res.status(401).json({ "msg": "Invalid credentials" });
        }
    } catch (error) {
        return res.status(500).json({ "err": "Error in login" });
    }
};

module.exports = { lgcont };