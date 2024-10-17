const express = require('express');
const bodyParser = require('body-parser');
const { application } = require('express');
const { v4: uuidv4} = require('uuid');
var mysql = require('mysql');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE"
    );
    next();
});
app.use(express.json());

var con = mysql.createConnection({
    host: "korawit.ddns.net",
    user: "webapp",
    password: "secret2024",
    port : 3307,
    database: "shop"
});
con.connect(function(err){
    if (err) throw err;
});

// Get all products
app.get('/api/products', function (req, res) {
    con.query("SELECT * FROM products", function (err,result,fields) {
        if (err) throw res.status(400).send('Not found any products');
        console.log(result);
        res.send(result);
    });
});

// Get a specific product by ID
app.get('/api/products/:id', function (req, res) {
    const id = req.params.id;
    con.query("SELECT * FROM products where id="+id, function (err,result,fields){
        if (err) throw err;
        let product=result;
        if(product.length>0){
            res.send(product);
        }
        else{
            res.status(400).send('Not found any products for'+id);
        }
    });
});

app.post('/api/products', function (req, res) {
    const name = req.body.name;
    const price = req.body.price;
    const img = req.body.img;
    con.query(`insert into products (name,price,img) values('${name}','${price}','${img}')`, function (err,result,fields) {
        if (err) throw res.status(400).send('Not cannot add products');
        con.query("SELECT * FROM products", function (err,result,fields) {
            if (err) throw res.status(400).send('Not found any products');
            console.log(result);
            res.send(result);
        });
    });
});

app.delete('/api/products/:id', function (req, res) {
    const id = req.params.id;
    con.query(`delete FROM products where id=${id}`, function (err,result,fields){
        if (err) throw res.status(400).send('Not cannot delete products');
        con.query("SELECT * FROM products", function (err,result,fields) {
            if (err) throw res.status(400).send('Not found any products');
            console.log(result);
            res.send(result);
        });
    });
});

app.put('/api/products/:id', function (req, res) {
    const id = req.params.id;
    const name = req.body.name;
    const price = req.body.price;
    const img = req.body.img;
    con.query(`update products SET name='${name}',price='${price}',img='${img}' where id=${id}`, function (err,result,fields){
        if (err) throw res.status(400).send('Not cannot delete products');
        con.query("SELECT * FROM products", function (err,result,fields) {
            if (err) throw res.status(400).send('Not found any products');
            console.log(result);
            res.send(result);
        });
    });
});

const port = 5001;
app.listen(port, function () {
    console.log("Listening on port", port);
});
