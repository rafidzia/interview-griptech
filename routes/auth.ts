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
        password = createHmac("sha256", process.env.SECRET as string).update(password).digest("hex")
    
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
        password = createHmac("sha256", process.env.SECRET as string).update(password).digest("hex")
    
    
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

    app.post("/change_password", async (req, res)=>{
        let old_password = req.body.old_password
        let new_password = req.body.new_password

        if(!new_password || !old_password){
            res.json({message: "error", error: "password is empty"})
            return
        }

        old_password = createHmac("sha256", process.env.SECRET as string).update(old_password).digest("hex")
        new_password = createHmac("sha256", process.env.SECRET as string).update(new_password).digest("hex")

        if(old_password != req.user.password){
            res.json({message: "error", error: "old password is wrong"})
            return
        }

        let out = await Users.update({
            password: new_password
        }, {
            where: {
                id: req.user.id
            }
        })

        if(!out){
            res.json({message: "error", error: "update failed"})
            return
        }

        res.json({message: "ok"})
        
    })
    
}