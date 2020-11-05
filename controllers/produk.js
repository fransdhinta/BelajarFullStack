import { jwtGenerator, autho, validInfo } from './jwtfun.js';
import pgPromise from 'pg-promise';

const pgp = pgPromise({});
const db = pgp('postgres://postgres:root@localhost:5433/belajar_fs');

export const getItems = (req, res) => {
    autho();
    db.any('SELECT * FROM product', [true])
        .then(data => {
            // console.log(data);
            res.json(data)// print data;
        })
        .catch(error => {
            console.log('ERROR:', error); // print the error;
        })
    // .finally(db.$pool.end);

}

export const getItem = (req, res) => {
    autho();
    const { id } = req.params;
    db.any('SELECT * FROM product WHERE id = $1', id)
        .then(data => {
            // console.log(data);
            res.json(data)// print data;
        })
        .catch(error => {
            console.log('ERROR:', error); // print the error;
        })
    // .finally(db.$pool.end);
}

export const createItem = (req, res) => {
    autho();
    const { id } = req.body;
    const { namaProduk } = req.body;
    const { stok } = req.body;
    const { hargaJual } = req.body;
    db.any(`INSERT INTO product (id, "namaProduk", stok, "hargaJual") VALUES (${id}, '${namaProduk}', ${stok}, ${hargaJual}) RETURNING *`)
        .then(data => {
            // console.log(data);
            res.json(data) // print data;
        })
        .catch(error => {
            console.log('ERROR:', error); // print the error;
        })
    // .finally(db.$pool.end);
}

export const deleteItem = (req, res) => {
    autho();
    const { id } = req.params;
    db.any('DELETE FROM product WHERE id = $1 RETURNING *', id)
        .then(data => {
            // console.log(data);
            // res.json(data)// print data;
            res.send(`Produk dengan id: ${id}, behasil dihapus`)
        })
        .catch(error => {
            console.log('ERROR:', error); // print the error;
        })
    // .finally(db.$pool.end);
}

export const updateItem = (req, res) => {
    autho();
    const { id } = req.params;
    const { namaProduk, stok, hargaJual } = req.body;
    db.any(`UPDATE product SET id = '${id}', "namaProduk" = '${namaProduk}', stok = ${stok}, "hargaJual" = ${hargaJual} WHERE id = $1 RETURNING *`, id)
        .then(data => {
            // console.log(data);
            // res.json(data)// print data;
            res.send(`Produk dengan id: ${id}, behasil diupdate`)
        })
        .catch(error => {
            console.log('ERROR:', error); // print the error;
        })
    // .finally(db.$pool.end);
}