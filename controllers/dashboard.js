import { jwtGenerator, autho, validInfo } from './jwtfun.js';
import pgPromise from 'pg-promise';

const pgp = pgPromise({});
const db = pgp('postgres://postgres:root@localhost:5433/belajar_fs');

export const showBoard = (req, res) => {
    autho();
    let aa = req.user;
    // res.json(aa);
    db.any('SELECT "firstName" FROM users WHERE id = $1', [aa])
        .then(data => {
            // console.log(data);
            res.json(data)// print data;
        })
        .catch(error => {
            console.log('ERROR:', error); // print the error;
        })
    // .finally(db.$pool.end);

}