const userScheme = require('../../Usersmodel/UserSchema.js')

const VerifyLoginUser = async (req, res, next) => {
    console.log("Login attempt:", req.body);
};
const addUsers = async (req, res) => {
    try {
        console.log(req.body)
        const res = await userScheme.create(req.body)
        res.json({ message: res })
        // res.status(500).json({ message: "account is creating ", success: true });
    } catch (error) {
        res.json(error)

    }
}
const getUsers = async (req, res) => {
    try {
        const users = await userScheme.find({});
        console.log(users);
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching users" });
    }
}
module.exports = { addUsers, getUsers, VerifyLoginUser }