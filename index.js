const express = require('express');
const path = require("path");
const bcrypt = require("bcrypt");
const collection = require("./config");

const app = express();
// convert data into json format 
app.use(express.json());

app.use(express.urlencoded({extended: false}));

//use ejs as the viw engine
app.set('view engine', 'ejs');
//static file
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.render("login");
});

app.get("/signup", (req, res) => {
    res.render("signup");
});

//Register user
app.post("/signup", async (req, res) => {

    const data = {
        name: req.body.username,
        password: req.body.password
    }

    //check if the user already exists in the database
    const existinguser = await collection.findOne({name: data.name});
    if(existinguser) {
        res.send("user already exists. Please choose a different username. ");
    }else{
    // hash the password using bcrypt
    const saltRounds = 10; // Number of salt round for bcrypt
    const hashedpassword = await bcrypt.hash(data.password, saltRounds);

    data.password = hashedpassword; // replace the hash password with original password 
    const userdata = await collection.insertMany(data);
    console.log(userdata);
    }
});


//login user 
app.post("/login", async (req, res) => {
    try{
        const check = await collection.findOne({name: req.body.username});
        if(!check){
            res.send("user name cannot find");
        }
        // compare the hash password from the database with the plain text 
        const isPasswordMatch = await bcrypt.compare(req.body.password, check.password);
        if(isPasswordMatch) {
            res.render("home");
        }else{
            req.send("wrong password");
        }
    }catch{
        res.send("wrong Details");

    }
});


const port = 5000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})