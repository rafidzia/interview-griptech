

import express from "express"
import bodyParser from "body-parser"
import jwt from "jsonwebtoken"
import cookieParser from "cookie-parser"

import psql from "./connections/psql"
import mongo from "./connections/mongo"

import { Users } from "./models/users"

import authRoutes from "./routes/auth"
import booksRoutes from "./routes/books"


require('dotenv').config()

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser())


// FOR AUTHENTICATION HOOK
app.use(async (req, res, next)=>{
    if(req.url == "/login" || req.url == "/register") return next()

    if(req.cookies.token){
        let token = req.cookies.token
        let decoded = jwt.verify(token, process.env.SECRET as string) as {username: string, password: string}
        if(!decoded){
            res.json({message: "error", error: "token is invalid"})
            return
        }

        if(!decoded.username || !decoded.password){
            res.json({message: "error", error: "token is invalid"})
            return
        }

        let out = await Users.findOne({
            where: {
                username: decoded.username,
                password: decoded.password
            }
        })

        if(!out){
            res.json({authRoutesmessage: "error", error: "user not exist"})
            return
        }

        // @ts-ignore
        req.user = out
        next()
    }else{
        res.json({message: "error", error: "token not found"})
        return
    }
})

authRoutes(app)
booksRoutes(app)

app.listen(process.env.PORT || 3000, async () => {
    console.log("server running on port " + process.env.PORT || 3000)
    await psql.sync()
    await mongo()
    console.log("database running")
})