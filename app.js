const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const app = express();
const port = 3000;
 //inmemory
 const users =[];
app.set('view engine', 'ejs');
app.use(express.static('public'))
app.use(express.json())
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

app.post('/register', async (req, res) => {
    try {
        const {email, password} = req.body;

        // Find User
        const findUser = users.find((data)=> email == data.email);

        if (findUser) {
            res.status(400).send("Wrong Email or password!");
        }
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        users.push({email , password: hashedPassword});
        console.log(users)
        res.status(201).send("Registered successfully!");
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
});

app.post('/login', async (req, res) => {
    try {
        const {email, password} = req.body;
        // Find User
        const findUser = users.find((data)=> email == data.email);

        if (!findUser) {
            res.status(400).send("Wrong Email or password!");
        }

        // Password Match
        const passwordMatch = await bcrypt.compare(password, findUser.password);

        if(passwordMatch){
            res.status(200).send("Logged in successfully!")
        } else {
            res.status(400).send("Wrong Email or password!");
        }

    } catch (err) {
        res.status(500).send({ message: err.message });
    }
});