import jwt from 'jsonwebtoken';
import { } from 'dotenv/config.js';

export const jwtGenerator = (user_id) => {
    const payload = {
        user: user_id
    }

    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1h" })
}

export const autho = async (req, res, next) => {
    try {
        const jwtToken = req.header('token');

        if (!jwtToken) {

            return res.status(403).json("Not Authorize");
        }

        const payload = jwt.verify(jwtToken, process.env.ACCESS_TOKEN_SECRET);

        req.user = payload.user;
        next();
    } catch (err) {
        console.error(err.message);
        return res.status(403).json("Not Authorize");
    }
}

export const validInfo = (req, res, next) => {
    const { username } = req.body;

    function validName(username) {
        return /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(username);
    }

    // if (req.path === "/register") {
    //     // console.log(!username.length);
    //     if (![username].every(Boolean)) {
    //         return res.json("Missing Credentials");
    //     } else if (!validName(username)) {
    //         return res.json("Invalid Username");
    //     }
    // } else if (req.path === "/login") {
    //     if (![username].every(Boolean)) {
    //         return res.json("Missing Credentials");
    //     } else if (!validName(username)) {
    //         return res.json("Invalid Username");
    //     }
    // }

    next();
}
