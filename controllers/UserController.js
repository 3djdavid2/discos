import db from "../models/index.js";
const User = db.User;

export const getUsers = async (req, res) => {
    console.log("get aqui")
    const user = req.body;

    try {
        const response = await User.findAll(user);

        if (!response) {
            res.status(500).json({ message: "INTERNAL SERVER ERROR" })
        }
        res.status(201).json({ message: response })
    } catch (error) {
        res.status(400).json(error)
    }
}

export const createUser = async (req, res) => {
    const user = req.body;

    try {
        const response = await User.create(user);

        if (!response) {
            res.status(500).json({ message: "INTERNAL SERVER ERROR" })
        }
        res.status(201).json({ message: "User Created" })
    } catch (error) {
        res.status(400).json(error)
    }
}


export default {getUsers,createUser};