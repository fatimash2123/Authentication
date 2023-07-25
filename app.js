require('dotenv').config();
const express = require("express");
const ejs = require('ejs');
const bodyParser = require("body-parser");
const mongoose=require("mongoose");
const encrypt=require("mongoose-encryption");

const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set('view engine', 'ejs');

//connecting to db
mongoose.connect("mongodb://0.0.0.0:27017/UserDB")
.then(connection=>{
    console.log("Successfully Connected");
})
.catch(err=>{
    console.log("Connection Failed");
    console.log(err);
})

//defining a schema using ORM for user
const userSchema=new mongoose.Schema({
    email:{type:String},
    password:{type:String}
})

//encryption
secretKey=process.env.SECRET_KEY
userSchema.plugin(encrypt,{secret:secretKey,encryptedFields: ['password']})

//model
const User=  mongoose.model('User',userSchema,"Users");


app.get('/', (req, res) => {
    res.render("home")
})

app.get('/login', (req, res) => {
    res.render("login")
})

app.get('/register', (req, res) => {
    res.render("register")
})

app.post('/register',(req,res)=>{
    const {username,password} = req.body;
    const user=new User({
        email:username,
        password:password
    })
    user.save()
    .then((result)=>{console.log(`Stored Successfully ${result}`); res.render("secrets")})
    .catch(err=>{console.log(`Not Stored ${err}`)})

})

app.post("/login",(req,res)=>{
    const {username,password}=req.body;
    User.findOne({"email":username})
    .then(userFound=>{
        if(userFound && password===userFound.password)
            res.render('secrets')
        else{res.render('login');console.log("user not found")}
        })
        
        .catch(err=>{console.log(err)})
    })


app.listen(3000, () => {
    console.log("Server is listening");
})
