const express = require("express")
var bodyParser = require('body-parser')
const formData = require("express-form-data")
const mongoose = require("mongoose")
const cors = require("cors")
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const UserDetails = require("./models/user")
const app = express();
const port = 8080 || process.env.PORT
const loginRoute = require("./login")
const bookRoute = require('./bookRoute')
const secret = "RESTAPI"

const uri = "mongodb+srv://diwakargud202:bobby@cluster0.0u33siq.mongodb.net/?retryWrites=true&w=majority"

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(cors());
app.use(formData.parse());
app.use(loginRoute)
app.use(bookRoute)


mongoose.connect(uri)

// routing starts

app.use("/login" , (req,res,next)=>{
  console.log(req)
  jwt.verify(token, secret, async function(err, decoded) {
    console.log(decoded) // bar
  });
  next();
})

app.post("/reg",

  body('email').isEmail(),
  // password must be at least 5 chars long
  body('password').isLength({ min: 5 }), async (req, res) => {
  // console.log(req)
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { name, email, password } = req.body

      const len = await UserDetails.count()
      if (len != 0) {
        const user = await UserDetails.findOne({ email })

        if (user) {
          return res.status(409).json({
            status: "failed",
            message: "User already exists"
          });
        }
      }

      bcrypt.hash(password, 10, async function (err, hash) {
        // Store hash in your password DB.
        if (err) {
          res.status(400).json({
            status: " hasing failed",
            message: err.messeage

          })
        }
        const userData = await UserDetails.create({
          name,
          email,
          password: hash
        })
        // await UserDetails.deleteOne({name:"bobby"})
        // console.log(req.body) 
        return res.status(200).json({
          status: "success",
          message: "registration done",
          userData
        })
        // res.status(200).json(req.body)
      });
    } catch (e) {
      return res.status(409).json({
        status: "failed",
        message: "registration unsuccesfull"
      })
    }
  })


// app.get("/login", (req, res) => {
//   const data = UserDetails.find({})
//   res.json(data)
// })

app.listen(port, () => { console.log(`its listening ${port}`) })





