import express from 'express';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';
import usersRoutes from './routes/users.js';
import dashboardRoutes from './routes/dashboard.js';
import produkRoutes from './routes/produk.js';
import orderRoutes from './routes/order.js';
import handlebars from 'handlebars';
import { allowInsecurePrototypeAccess } from "@handlebars/allow-prototype-access";
import hbs from "express-handlebars";
import { } from 'dotenv/config.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import pkg from 'bcryptjs';
import pgPromise from 'pg-promise';
import { jwtGenerator, autho, validInfo } from './controllers/jwtfun.js';
import router from './routes/users.js';

// import { verify } from 'crypto';
// import usersRoutes from './routes/users.js';
const app = express();

const PORT = 7000;

const pgp = pgPromise({});
const db = pgp('postgres://postgres:root@localhost:5433/belajar_fs');

app.use(cookieParser());

app.use(bodyParser.json());
app.use(express.static('public'))

app.engine("hbs", hbs({
    defaultLayout: "main",
    extname: ".hbs",
    handlebars: allowInsecurePrototypeAccess(handlebars)
}));

app.set("view engine", "hbs");

// MAIN ROUTES
app.get('/', (req, res) => {
    return res.render("login");
});

app.post('/register', validInfo, async (req, res) => {
    try {
        //1. Membaca inputan username dll.
        const { id, username, lastname, email, age } = req.body;

        //2. Cek apakah username sudah ada.
        db.any(`SELECT * FROM users WHERE "firstName" = '${username}'`)
            .then(data => {
                if (data.length == 0) {
                    db.any(`INSERT INTO users (id, "firstName", "lastName", email, age) VALUES (${id}, '${username}', '${lastname}', '${email}', ${age}) RETURNING *`)
                        .then(data => {
                            // res.json(data[0].id);

                            const token = jwtGenerator(data[0].id);
                            res.json({ token })
                        });

                } else {
                    res.json(data);
                }
                // let user = data;
                // if (user.rows.length !== 0) {
                //     res.json('Ada Data');
                // } else {
                //     res.json('Tikdak Ada Data');
                // }
            })
            .catch(error => {
                console.log('ERROR:', error); // print the error;
            });

    } catch (error) {

    }
})

app.post('/login', validInfo, async (req, res) => {
    const { email, password } = req.body;

    db.any(`SELECT * FROM users WHERE "email" = '${email}' AND "password" = '${password}'`)
        .then(data => {
            let user = data;// print data;

            if (data.length == 0) {
                res.json('nope');
            } else {
                const token = jwtGenerator(data[0].id);
                res.json({ token })
                // res.json(data);
            }
        })
        .catch(error => {
            console.log('ERROR:', error); // print the error;
        });

})

app.use('/dashboard', autho, dashboardRoutes, async (req, res) => { })

app.use('/produk', autho, produkRoutes, async (req, res) => { })

app.use('/order', autho, orderRoutes, async (req, res) => { })

app.use('/users', autho, usersRoutes, async (req, res) => { });

// MAIN ROUTES

app.get('/is-verify', autho, async (req, res) => {
    try {
        res.json(true);
    } catch (err) {

    }
});

app.listen(PORT, () => console.log(`Server Running on port: http://localhost:${PORT}`))

// app.post('/logout', (_req, res) => {
//     res.clearCookie('refreshtoken', { path: '/refresh_token' });
//     return res.send({
//         message: 'Logged out'
//     })
// });

// Create Access Token
// const createAccessToken = user => {
//     return jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
//         expiresIn: '15m'
//     })
// }

// // Create Refresh Token
// const createRefreshToken = user => {
//     return jwt.sign({ user }, process.env.REFRESH_TOKEN_SECRET, {
//         expiresIn: '7d'
//     })
// }

// // Send Access Token
// const sendAccessToken = (res, req, accesstoken) => {
//     res.send({
//         accesstoken
//     })
// }

// // Send Refresh Token
// const sendRefreshToken = (res, refreshtoken) => {
//     res.cookie('refreshtoken', refreshtoken, {
//         httpOnly: true,
//         path: '/refresh_token'
//     })
// }

// FORMAT OF TOKEN
// Authorization: Bearer <access_token>

// Verify Token
// const verifyToken = (req, res, next) => {
//     // Get auth header value
//     const authHeader = req.headers['authorization'];

//     if (typeof authHeader !== 'undefined') {
//         const bearer = authHeader.split(' ');
//         const token = bearer[1];

//         req.token = token;
//         next();
//     } else {
//         res.sendStatus(403);
//     }
// }

// const isAuth = req => {
//     const authorization = req.headers['authorization'];
//     if (!authorization) throw new Error("You need to login");

//     const token = authorization.split(' ')[1];

//     const { user } = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
//     return user;
// }

// app.use('/users', autho, usersRoutes, async (req, res) => {
//     // try {
//     //     const user = isAuth(req);
//     //     if (user !== null) {
//     //         // res.send({
//     //         //     data: 'Blabaabs'
//     //         // })
//     //     }
//     // } catch (err) {
//     //     res.send({
//     //         error: `${err.message}`
//     //     })
//     // }

//     // jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, authData) => {
//     //     if (err) {
//     //         res.sendStatus(403);
//     //     } else {
//     //         // BESOK NGURUS INI COI
//     //         // send.json(authData);
//     //     }
//     // });

// });

// app.use(cors({
//     origin: 'http://localhost:7000',
//     credentials: true,
// }));

