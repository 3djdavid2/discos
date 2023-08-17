import db from "../models/index.js";
const Disco = db.Disco;

export const getDiscos = async(req, res) => {
    
    try {
        const response = await Disco.findAll({
            where:{}
        });

        if(!response) {
            res.status(500).json({message: "INTERNAL SERVER ERROR"})
        }
        res.status(201).json({message: response})
    } catch (error) {
        res.status(400).json(error)
    }
}
export const createDisco = async(req, res) => {
    const disco = req.body;

    try {
        const response = await Disco.create(disco);

        if(!response) {
            res.status(500).json({message: "INTERNAL SERVER ERROR"})
        }
        res.status(201).json({message: "Disc Created"})
    } catch (error) {
        res.status(400).json(error)
    }
}


export default {
    getDiscos,
    createDisco
}