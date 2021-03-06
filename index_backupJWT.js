import express from 'express';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';
import usersRoutes from './routes/users.js';
import handlebars from 'handlebars';
import { allowInsecurePrototypeAccess } from "@handlebars/allow-prototype-access";
import hbs from "express-handlebars";

// import { verify } from 'crypto';
// import usersRoutes from './routes/users.js';
const app = express();

const PORT = 7000;

import pgPromise from 'pg-promise';

const pgp = pgPromise({});
const db = pgp('postgres://postgres:root@localhost:5433/belajar_fs');

app.use(bodyParser.json());
app.use(express.static('public'))

app.engine("hbs", hbs({
    defaultLayout: "loginView",
    extname: ".hbs",
    handlebars: allowInsecurePrototypeAccess(handlebars)
}));

app.set("view engine", "hbs");

app.get('/', (req, res) => {
    return res.render("login");
});

app.post('/login', (req, res) => {
    const { username } = req.body;
    let { user } = req.body;
    db.any(`SELECT * FROM users WHERE "firstName" = '${username}'`)
        .then(data => {
            console.log(data);
            user = data;// print data;
            // res.send(user)
        })
        .catch(error => {
            console.log('ERROR:', error); // print the error;
        });
    jwt.sign({ user }, 'secretkey', (err, token) => {
        res.json({
            token
        });
    });
})

// FORMAT OF TOKEN
// Authorization: Bearer <access_token>

// Verify Token
export const verifyToken = (req, res, next) => {
    // Get auth header value
    const bearerHeader = req.headers['authorization'];
    // Check if beare is undefined
    if (typeof bearerHeader !== 'undefined') {
        // SPlit at the space
        const bearer = bearerHeader.split(' ');
        // Get token from array
        const bearerToken = bearer[1];
        // Set the token
        req.token = bearerToken;
        // Next middleware
        next();
    } else {
        // Forbidden
        res.sendStatus(403);
    }
}

app.use('/users', verifyToken, usersRoutes, (req, res) => {
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else {
            // BESOK NGURUS INI COI
            // send.json(authData);
        }
    });
});

app.listen(PORT, () => console.log(`Server Running on port: http://localhost:${PORT}`))