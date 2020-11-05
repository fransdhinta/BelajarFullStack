import { jwtGenerator, autho, validInfo } from './jwtfun.js';
import pgPromise from 'pg-promise';

const pgp = pgPromise({});
const db = pgp('postgres://postgres:root@localhost:5433/belajar_fs');

export const postOrder = (req, res) => {
    autho();
    const { id } = req.body;
    let aa = req.user;
    const userId = aa;
    const { produkId } = req.body;
    const { jumlah } = req.body;
    db.any(`INSERT INTO orders (id, "userId", "produkId", jumlah, "status") VALUES (${id}, ${userId}, ${produkId}, ${jumlah}, 'Pending') RETURNING *`)
        .then(data => {
            // console.log(data);
            res.json(data) // print data;
        })
        .catch(error => {
            console.log('ERROR:', error); // print the error;
        })
}

export const getOrders = (req, res) => {
    autho();
    try {
        db.any(`SELECT orders.id, users.email, product."namaProduk", product."hargaJual", orders.jumlah, (product."hargaJual" * orders.jumlah) AS Total, orders.status
        FROM orders
        JOIN users ON orders."userId" = users.id
        JOIN product ON orders."produkId" = product.id`)
            .then(data => {
                // console.log(data);
                res.json(data) // print data;
            })
            .catch(error => {
                console.log('ERROR:', error); // print the error;
            })
    } catch (err) {

    }
}