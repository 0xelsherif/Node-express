const express = require('express');
const mongoose = require('mongoose');

const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }));

var moment = require('moment');


mongoose
    .connect('mongodb+srv://rookie:mcsTlC9CfcVai1up@cluster0.ufinlu3.mongodb.net/test', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        app.listen(port, () => {
            console.log(`Server is running at http://localhost:${port}`);
        });
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err.message);
    });

// auto refresh
const path = require("path");
const livereload = require("livereload");
const liveReloadServer = livereload.createServer();
liveReloadServer.watch(path.join(__dirname, 'public'));


const connectLivereload = require("connect-livereload");
app.use(connectLivereload());

liveReloadServer.server.once("connection", () => {
    setTimeout(() => {
        liveReloadServer.refresh("/");
    }, 100);
});

// Models
const Users = require("./models/usersSchema")



// Get request
app.get('/', (req, res) => {
    res.render('index', { req: req });
});

app.get('/users', (req, res) => {
    Users.find().then((allusers) => {
        console.log(allusers);
        res.render('users/users', { Array: allusers, moment: moment, req: req });
    }).catch((error) => {
        console.log(error)
    });
});

// Post request
app.post('/users/add', (req, res) => {
    console.log(req.body)
    Users.create(req.body)
        .then(result => {
            res.redirect("/users");
        })
        .catch(err => {
            console.log(err);
        });
});