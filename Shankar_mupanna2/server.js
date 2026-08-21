const express = require("express");
const db = require("./config/db");
const userRouter = require("./router/userRouter");
const hospitalRouter = require("./router/hospitalsRouter")


const app = express();
app.use(express.json());

app.use("/User", userRouter);
app.use("/hospitals", hospitalRouter)

app.listen(4000, () => {
  console.log("Server is running on port 4000");
});