
const sendEmail= async(req,res)=>{

  await new Promise((resolve)=>{
    setTimeout(resolve,5000)
  })
 console.log("email send")
}
export default sendEmail