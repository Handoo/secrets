//jshint esversion:6
require('dotenv').config();
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const app = express();

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect('mongodb://localhost:27017/userDB', {useNewUrlParser: true});

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

const User = new mongoose.model('User', userSchema);


app.get('/', function(req, res){
    res.render('home');
});


// When a user get and post on the login page
app.route('/login')

.get(function(req, res){
    res.render('login');
})

.post(function(req, res){
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({email: username}, function(err, foundUser){
        if(err){
            res.render(err);
        } else {
            User.findOne({email: username}, function(err, foundUser){
                if(foundUser) {
                    bcrypt.compare(password, foundUser.password, function(err, result){
                        if(result){
                            res.render('secrets');
                        }
                    });
                }
            });
        }
    });

})






//When a user get and post on the Register page
app.route('/register')

.post(function(req, res){

    bcrypt.hash(req.body.password, saltRounds, function(err, hash){
        const newUser = new User({
            email: req.body.username,
            password: hash
        });
    
        newUser.save(function(err){
            if(!err){
                res.render('login');
            } else {
                res.send(err);
            }
        });
    });
})

.get(function(req, res){
    res.render('register');
});





const port = 3000;
app.listen(port, function(){
    console.log('Server started on port ' + port);
})