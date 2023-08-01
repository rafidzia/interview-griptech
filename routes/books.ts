

import { Express } from 'express';

import {Books} from "../models/books"

export default (app: Express)=>{
    app.post("/books", async (req, res) => {
        let title = req.body.title
        let author = req.body.author
        let description = req.body.description

        if(!title || !author){
            res.json({message: "error", error: "title or author is empty"})
            return
        }

        let out = await Books.create({
            title: title,
            author: author,
            description: description || ""
        })

        if(!out){
            res.json({message: "error", error: "error"})
            return
        }

        res.json({message: "ok"})
    })

    app.get("/books", async (req, res) => {
        let out = await Books.find()

        if(!out){
            res.json({message: "error", error: "error"})
            return
        }

        res.json({message: "ok", data: out})
    })

    app.get("/books/:id", async (req, res) => {
        let id = req.params.id

        let out = await Books.findById(id)

        if(!out){
            res.json({message: "error", error: "error"})
            return
        }

        res.json({message: "ok", data: out})
    })

    app.put("/books/:id", async (req, res) => {
        let id = req.params.id

        let title = req.body.title
        let author = req.body.author
        let description = req.body.description

        if(!title || !author){
            res.json({message: "error", error: "title or author is empty"})
            return
        }

        let out = await Books.findByIdAndUpdate(id, {
            title: title,
            author: author,
            description: description || ""
        })

        if(!out){
            res.json({message: "error", error: "error"})
            return
        }

        res.json({message: "ok"})
    })

    app.delete("/books/:id", async (req, res) => {
        let id = req.params.id

        let out = await Books.findByIdAndDelete(id)

        if(!out){
            res.json({message: "error", error: "error"})
            return
        }

        res.json({message: "ok"})
    })
}