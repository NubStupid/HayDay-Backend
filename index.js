const express = require('express')
const cookieParser = require('cookie-parser');
const app = express()
const port = 3000

require("dotenv").config()

app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
app.use(require("body-parser").json())

const farmRouter = require("./src/routes/farmRoutes")
const barnRouter = require("./src/routes/barnRoutes")


app.use('/api/v1/farm',farmRouter)
app.use("/api/v1/barn",barnRouter)


app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))