import { createHmac } from "crypto"

import { Express } from 'express';
import jwt from "jsonwebtoken"

import { Users } from "../models/users"

export default (app: Express)=>{
    app.post("/register", async (req, res) => {

        if(!req.body.username || !req.body.password){
            res.json({message: "error", error: "username or password is empty"})
            return
        }
    
        let username = req.body.username
        let password = req.body.password
        password = createHmac("sha256", "test").update(password).digest("hex")
    
        let out = await Users.create({
            username: username,
            password: password
        })
    
        if(!out){
            res.json({message: "error", error: "username already exists"})
            return
        }
    
        res.json({message: "ok"})
    })
    
    app.post("/login", async (req, res) => {
        if(!req.body.username || !req.body.password){
            res.json({message: "error", error: "username or password is empty"})
            return
        }
    
        let username = req.body.username
        let password = req.body.password
        password = createHmac("sha256", "test").update(password).digest("hex")
    
    
        let out = await Users.findOne({
            where: {
                username: username,
                password: password
            }
        })
        
        if(!out){
            res.json({message: "error", error: "username or password is wrong"})
            return
        }
    
        let token = jwt.sign({username, password}, process.env.SECRET as string, { expiresIn: '1h'})
    
        res.cookie("token", token, {httpOnly: true})
    
        res.json({message: "ok", token})
    })
    
    
    app.get("/logout", async (req, res)=>{
        res.clearCookie("token")
        res.json({message: "ok"})
    })
    
}