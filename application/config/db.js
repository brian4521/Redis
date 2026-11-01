import mongoose from "mongoose"

const connectDb = async ()=>{
  try{
    await mongoose.connect(process.env.MONGODB_URI)
    console.log("connected to db")

  } catch(error){
    console.log("error while connecting to db",error)

  }
}

export default connectDb

