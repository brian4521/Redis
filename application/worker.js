import { Queue, Worker } from "bullmq";
import Redis from "ioredis";
import sendEmail from "./config/sendEmail.js";


const redis = new Redis("redis://localhost:6379",{
  maxRetriesPerRequest:null
})

const worker = new Worker("emailQueue",async(job)=>{
  const email = job.data.email
  await sendEmail(email)
  console.log("done!")

},{connection:redis})

