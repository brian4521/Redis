import express from "express"
import dotenv from "dotenv"
import connectDb from "./config/db.js"
import userModel from "./model/user.model.js"
import Redis from "ioredis"
import rateLimiter from "./middleware/ratelimit.js"
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
    await redis.del("user:all")
    const user = await userModel.create({
        name, email, password
    })
    return res.json(user)
})

app.get("/fetch",rateLimiter,async(req,res)=>{
    const user = await userModel.find()
    return res.json(user)
})

app.get("/fetch-with-redis",async(req,res)=>{
    const redisdata = await redis.get("user:all")
    

    if(redisdata){
        const cachedData = JSON.parse(redisdata)
        return res.json(cachedData)
    }

    const user = await userModel.find()
    await redis.set("user:all",JSON.stringify(user))
    return res.json(user)
})

app.post("/send-otp",async(req,res)=>{
    const {email} = req.body

    const otp = Math.floor(100000 + Math.random()*900000).toString()
    await redis.set(`otp:${email}`,otp,"EX","30")
    return res.json({otp})

})

app.post("/verity-otp",async(req,res)=>{
    const {email,otp} = req.body
    const cachedotp = await redis.get(`otp:${email}`)
    if(!cachedotp){
        return res.json({
            message:"otp not found"
        })
    }

    if(cachedotp !== otp){
        return res.json({
            message:"otp not matched"
        })
    }

    res.json({
        message:"otp verified"
    })
})

app.listen(port,()=>{
    connectDb()
    console.log(`server started ${port}`)
})