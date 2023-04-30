const express = require("express")
var bodyParser = require('body-parser')
const formData = require("express-form-data")
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const UserDetails = require("./models/user")
const router = express();
const secret = "RESTAPI"

// router.use(cors());
router.use(bodyParser.urlencoded({ extended: true }))

// parse application/json
router.use(bodyParser.json())
router.use(formData.parse());

router.post("/login",
    body('email').isEmail(), async (req, res) => {
        // console.log(req.body)
        // console.log(req.headers)
        try {
            // const errors = validationResult(req);
            // if (!errors.isEmpty()) {
            //     return res.status(400).json({ errors: errors.array() });
            // }
            const { name, email, password } = req.body

            const user = await UserDetails.find({ email })

            // console.log(password , user[0].password)

            if (!user) {
                return res.status(409).json({
                    status: "failed",
                    message: "User not found "
                })
            }
            // Load hash from your password DB.
            bcrypt.compare(password, user[0].password, async function (err, result) {
                // result == true
                if(result){
                    const token = jwt.sign({
                        // exp: Math.floor(Date.now() / 1000) + (60 * 60),
                        data: user._id
                      }, secret);
                    //   const bd = await TokenDetails.create({token})
                    //   console.log(email)
                    // const userToken = await UserDetails.updateOne({email:email}, {$setOnInsert: {token:token}})
                    // console.log(userToken)
                    console.log(user[0].name)
                    return res.status(200).json({
                        status: "success",
                        message: "login succesfull",
                        user_name:user[0].name,
                        token,
                    })
                } else{
                    return res.status(409).json({
                        status: "failed",
                        message: "invalid password"
                    })
                }

            });

        } catch (e) {
            return res.status(409).json({
                status: "failed",
                message: e.message
            })
        }
    })
router.get("/login", async (req,res)=>{
    // console.log(req.body)
    // const lToken = await TokenDetails.find()
    // console.log(lToken)
    res.status(200).json(lToken)
})


module.exports = router;