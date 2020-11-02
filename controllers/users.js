import { v4 as uuidv4 } from 'uuid';
import pgPromise from 'pg-promise';

const pgp = pgPromise({});
const db = pgp('postgres://postgres:root@localhost:5433/belajar_fs');
let result = [];

export const getUsers = (req, res) => {
    db.any('SELECT * FROM users', [true])
        .then(data => {
            // console.log(data);
            res.json(data)// print data;
        })
        .catch(error => {
            console.log('ERROR:', error); // print the error;
        })
    // .finally(db.$pool.end);
}

export const getUser = (req, res) => {
    const { id } = req.params;
    db.any('SELECT * FROM users WHERE id = $1', id)
        .then(data => {
            // console.log(data);
            res.json(data)// print data;
        })
        .catch(error => {
            console.log('ERROR:', error); // print the error;
        })
    // .finally(db.$pool.end);
}

export const createUser = (req, res) => {
    const { id } = req.body;
    const { firstName } = req.body;
    const { lastName } = req.body;
    const { email } = req.body;
    const { age } = req.body;
    db.any(`INSERT INTO users (id, "firstName", "lastName", email, age) VALUES (${id}, '${firstName}', '${lastName}', '${email}', ${age})`)
        .then(data => {
            // console.log(data);
            res.json(data) // print data;
        })
        .catch(error => {
            console.log('ERROR:', error); // print the error;
        })
    // .finally(db.$pool.end);
}

export const deleteUser = (req, res) => {
    const { id } = req.params;
    db.any('DELETE FROM users WHERE id = $1', id)
        .then(data => {
            // console.log(data);
            // res.json(data)// print data;
            res.send(`User dengan id : ${id}, behasil dihapus`)
        })
        .catch(error => {
            console.log('ERROR:', error); // print the error;
        })
    // .finally(db.$pool.end);
}

export const updateUser = (req, res) => {
    const { id } = req.params;
    const { firstName, lastName, email, age } = req.body;
    db.any(`UPDATE users SET id= '${id}', "firstName"= '${firstName}', "lastName"= '${lastName}' , "email"= '${email}', age= ${age} WHERE id = $1`, id)
        .then(data => {
            // console.log(data);
            // res.json(data)// print data;
            res.send(`User dengan id : ${id}, behasil diupdate`)
        })
        .catch(error => {
            console.log('ERROR:', error); // print the error;
        })
    // .finally(db.$pool.end);
}