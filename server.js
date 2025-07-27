
require("dotenv").config();

const express = require("express");
const connecttoDb = require("./database/db")
const authRouter = require("./routes/auth-routes")
const homeRouter = require("./routes/home-routes");
const adminRouter = require("./routes/admin-routes");
const imageRouter = require("./routes/image-routes");

const app = express();
const port = process.env.PORT || 3000;

// connecting mongodb
connecttoDb();
// middleware
app.use(express.json()) 

app.use("/api/routes",authRouter);
app.use("/api/home",homeRouter);
app.use("/api/admin",adminRouter);
app.use("/api/file",imageRouter);




app.listen(port,()=>{
    console.log("Server is now running at port",port);
})