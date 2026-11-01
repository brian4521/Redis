import express from "express"
import dotenv from "dotenv"
import connectDb from "./config/db.js"
import userModel from "./model/user.model.js"
import Redis from "ioredis"
dotenv.config()

const port=process.env.PORT || 5000

const app=express()
const redis = new Redis()
app.use(express.json())

app.get("/",(req,res)=>{
    return res.status(200).json({message:"hello from docker 27"})
})

app.post("/create",async(req,res)=>{
    const {name, email, password} = req.body
    const user = await userModel.create({
        name, email, password
    })
    return res.json(user)
})

app.get("/fetch",async(req,res)=>{
    const user = await userModel.find()
    return res.json(user)
})

app.get("/fetch-with-redis",async(req,res)=>{
    const redisdata = await redis.get("user:all")
    const cachedData = JSON.parse(redisdata)

    if(redisdata){
        return res.json(cachedData)
    }

    const user = await userModel.find()
    await redis.set("user:all",JSON.stringify(user))
    return res.json(user)
})


app.listen(port,()=>{
    connectDb()
    console.log(`server started ${port}`)
})