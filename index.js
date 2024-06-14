const express = require('express')
const cookieParser = require('cookie-parser');
const app = express()
const port = 3000;
const mongoose = require("mongoose");
const cors = require("cors");

require("dotenv").config();

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(require("body-parser").json());
app.use(cors({
    origin: "http://localhost:5173",
    optionsSuccessStatus: 200
}));

const adminRouter = require("./src/routes/adminRoutes")
const farmRouter = require("./src/routes/farmRoutes");
const barnRouter = require("./src/routes/barnRoutes");
const chefRouter = require("./src/routes/chefRoutes");
const sellerRouter = require("./src/routes/sellerRoutes");
const userRouter = require("./src/routes/userRoutes");
const distributorRouter = require("./src/routes/distributorRoutes");
const { AuditLog } = require("./src/utils/functions/AuditLog");

app.use("/api/v1/admin",[AuditLog],adminRouter)
app.use("/api/v1/farm",[AuditLog], farmRouter);
app.use("/api/v1/barn",[AuditLog], barnRouter);
app.use("/api/v1/chef",[AuditLog], chefRouter);
app.use("/api/v1/seller",[AuditLog], sellerRouter);
app.use("/api/v1/user",[AuditLog], userRouter);
app.use("/api/v1/distributor",[AuditLog], distributorRouter);

app.get("/", (req, res) => res.send("Hello World!"));
mongoose.connect("mongodb://127.0.0.1/hayday_backend").then(function () {
    app.listen(port, () => console.log(`Example app listening on port ${port}!`));
});
