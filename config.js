const mongoose = require("mongoose");
const connect = mongoose.connect("mongodb://localhost:27017/BJSC");

//check database connected or not
connect.then(() => {
    console.log("Database connected Successfully");
})
.catch(() => {
    console.log("Database not connected");
});


//create a schema
const LoginSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

//collection part
const collection = new mongoose.model("orders",LoginSchema);

module.exports = collection;