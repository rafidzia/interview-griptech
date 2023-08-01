import mongoose from "mongoose"

const Books = mongoose.model("Books", new mongoose.Schema({
    title: {
        type: String,
        required: [true, "title is required"],
    },
    author: {
        type: String,
        required: [true, "authors is required"],
    },
    description: String,
}, {
    timestamps: true
}))

export {Books}