const express = require("express")
var bodyParser = require('body-parser')
const formData = require("express-form-data")
const { CountryStateDistrict } = require('country_state_district');
const BookingDetails = require('./models/bookingDetails')
const UserDetails = require('./models/user')
var Mailgen = require('mailgen');

const nodemailer = require("nodemailer");

const get_S_D = new CountryStateDistrict

const obj = {
    states_: get_S_D.getAllStates(),
    dist_: get_S_D.getAllDistricts()
}
// console.log((obj.states_))


const app = express();


app.use(bodyParser.urlencoded({ extended: true }))

// parse application/json
app.use(bodyParser.json())
app.use(formData.parse())

app.get('/states_', (req, res) => {

    res.json(obj.states_)
})

app.get("/dist_", (req, res) => {
    res.json(obj.dist_)
})

app.post("/details", async (req, res) => {
    try {
        // console.log(req.body)
        // const namimg = await UserDetails.find({})
        // console.log(namimg)
        const { selected_state, selected_district, selected_car_name, selectes_price_value, selected_slot,selected_name,selecte_email } = req.body

        const data = await BookingDetails.create({
            selected_state,
            selected_district,
            selected_car_name,
            selectes_price_value,
            selected_slot,
            selected_name
        })
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'diwakargud202@gmail.com', // generated ethereal user
                pass: "sykznecgjyesvqlt", // generated ethereal password
            },
        });

        // Configure mailgen by setting a theme and your product info
        let mailGenerator = new Mailgen({
            theme: 'default',
            product: {
                // Appears in header & footer of e-mails
                name: 'Mailgen',
                link: 'https://mailgen.js/'
                // Optional product logo
                // logo: 'https://mailgen.js/img/logo.png'
            }
        });
        let  response = {
            body: {
                name: `${selected_name}`,
                intro: 'BOOKING DONE SUCCESSFULLY',
                outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
            }
        };
        let mail = mailGenerator.generate(response)

        const mail_id = await UserDetails.find({name:selected_name})
        // console.log(mail_id[0].email)
        let message ={
            from:'diwakargud202@gmail.com',
            to: mail_id[0].email,
            subject:"welcome to CBS ",
            html:mail,
        }
        transporter.sendMail(message).then(()=>{
            return res.status(200).json({
                status: "success",
                msg:"mail sent successfully"
            })
        }).catch((err)=>{
            console.log(err)
        })
        // return res.status(200).json({
        //     status: "success",
        //     message: "Successfully Booking",
        //     data
        // })

    } catch (e) {
        return res.status(409).json({
            status: "failed",
            message: e.message
        })
    }

})

module.exports = app;