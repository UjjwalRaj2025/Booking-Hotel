import express from "express"
import "dotenv/config";
import cors from "cors";
import { connect } from "mongoose";
import connectDB from "./configs/db.js";
import { clerkMiddleware } from '@clerk/express'
import clerkWebhooks from "./controllers/clerkWebhooks.js";


connectDB()


const app = express()
app.use(cors()) 

//middleware
app.use(express.json())
app.use(clerkMiddleware())

//API to listen to clerk webhooks
app.use("/api/clerk", clerkWebhooks);



app.get('/',(req, res)=> res.send("API is Working "))

const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=> console.log(`Serever running on Port ${PORT}`));