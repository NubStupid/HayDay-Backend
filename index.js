const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const port = 3000;

require("dotenv").config();

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(require("body-parser").json());


const adminRouter = require("./src/routes/adminRoutes")
const farmRouter = require("./src/routes/farmRoutes");
const barnRouter = require("./src/routes/barnRoutes");
const chefRouter = require("./src/routes/chefRoutes");
const sellerRouter = require("./src/routes/sellerRoutes");
const userRouter = require("./src/routes/userRoutes");
const { AuditLog } = require("./src/utils/functions/AuditLog");

app.use("/api/v1/admin",[AuditLog],adminRouter)
app.use("/api/v1/farm",[AuditLog], farmRouter);
app.use("/api/v1/barn",[AuditLog], barnRouter);
app.use("/api/v1/chef",[AuditLog], chefRouter);
app.use("/api/v1/seller",[AuditLog], sellerRouter);
app.use("/api/v1/user",[AuditLog], userRouter);


app.get("/", (req, res) => res.send("Hello World!"));
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
