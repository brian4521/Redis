import { Queue } from "bullmq";
import Redis from "ioredis";


const redis = new Redis("redis://localhost:6379",{
  maxRetriesPerRequest:null
})

const emailQueue = new Queue("emailQueue",{connection:redis})

export default emailQueue