const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DetailSchema = new Schema({
    selected_state:{type: String },
    selected_district:{type: String },
    selected_car_name:{type: String },
    selectes_price_value:{type: String },
    selected_slot:{type: String }
});

const bookingDetails = mongoose.model('BookingDetail', DetailSchema);
module.exports = bookingDetails;

// selected_state,selected_district,selected_car_name,selectes_price_value,selected_slot