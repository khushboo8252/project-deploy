const express = require("express");
const {connection}=require("./db");
const { userRouter } = require("./routes/userRoutes");
const {noteRouter} = require("./routes/noteRoutes")
const dotenv=require("dotenv").config();
const cors=require("cors");
const jwt = require("jsonwebtoken")

const app = express();
const port = process.env.port;
app.use(cors());

app.use(express.json());
app.use("/user",userRouter);
app.use("/note",noteRouter);


app.get("/",(req,res)=>{
    res.send("home page")
});

app.get("/newtoken",(req,res)=>{
    const rToken = req.headers.authorization?.split(" ")[1];
    const decoded = jwt.verify(rToken,"school")
    if(decoded){
        const accesstoken = jwt.sign({course:"backend"},"masai",{
            expiresIn:60
        })
        res.send({"newAccessToken":accesstoken})
    }else{
        res.send({"msg":"Invalid refresh token"})
    }
})


app.listen(port,async()=>{
   try {
    await connection
    console.log(`server is running on port ${port} and db is connected`)
   } catch (error) {
    console.log(error)
   }
})