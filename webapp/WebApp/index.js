const express = require('express');
const bodyparser = require('body-parser');
const path = require('path');
const app = express();

require('dotenv').config();

const mysql = require('mysql');

let uuidv1 = require('uuid/v1')
const bcryptjs = require('bcryptjs');
const basicAuth = require('basic-auth');
const saltRounds = 10;

const multer = require('multer');
const multerS3 = require('multer-s3');

const AWS = require('aws-sdk');
const s3 = new AWS.S3();

var StatsD = require('node-statsd'),
    client = new StatsD();

let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();
var expect = chai.expect;
chai.use(chaiHttp);

app.use(bodyparser.urlencoded({
    extended: false
}));

app.use(bodyparser.json());

app.use(function (req, res, next) {

    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin,X-Requested-With,Content-Type,Accept");
    next();
});

app.listen('3000', () => {
    console.log('Server started on port 3000');
});

app.get('/hellotest', function (req, res) {
    res.send("HelloWorld");
    client.increment('hello');
});

//create the connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log("Database connected");
});

var database = 'Create database if not exists ' + process.env.DB_NAME;
db.query(database, function (err, dataa) {
    if (err) {
        throw err;
    }
    if (dataa) {
        console.log("Database created");
        var data = 'use ' + process.env.DB_NAME;
        db.query(data, function (err, succc) {
            if (err) {
                throw err;
            }
            else {
                console.log("database selected");
                var createTBLLoginSql = 'CREATE table if not exists login ( username varchar(255), password varchar(255));';
                db.query(createTBLLoginSql, function (err, createSuc) {
                    if (err) {
                        throw err;
                    } else {
                        console.log("Login Created");
                        const createTBLTransactionsSql = 'CREATE table if not exists transactions (id varchar(255),tran_description varchar(255), merchant varchar(255),amount varchar(255),transaction_date varchar(255),category varchar(255), username varchar(255),PRIMARY KEY (id));';
                        db.query(createTBLTransactionsSql, function (err, createSuc) {
                            if (err) {
                                throw err;
                            } else {
                                console.log("Transactions Table Created successfully");
                                const createTBLAttachmentsSql = 'CREATE table if not exists attachments ( id varchar(255), receipt varchar(255), transaction_id varchar(255),environment varchar(255));';
                                db.query(createTBLAttachmentsSql, function (err, createSuc) {
                                    if (err) {
                                        throw err;
                                    } else {
                                        console.log("Attachments Table Created successfully");
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    }
});

//Code to validate email
function validationemail(email) {
    var em = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return em.test(email);
}

// Code to validate whitespaces and tabs.
function hasWhiteSpace(sr) {
    reWhiteSpace = /\s/g;
    return reWhiteSpace.test(sr);
}


app.post('/register', (req, res) => {
    client.increment('registering');
    if (!req.body.username || !req.body.password) {
        console.log(req.body);
        res.json({ success: false, message: 'Please enter username and password.' });
    }
    if (req.body.username && req.body.password) {
        if (validationemail(req.body.username)) {
            var salt = bcryptjs.genSaltSync(saltRounds);
            var hash = bcryptjs.hashSync(req.body.password, salt);
            let selectsql = `Select username from login WHERE username = '${req.body.username}'`;
            db.query(selectsql, function (err, resu) {
                if (err) {
                    throw err;
                }
                if (!resu[0]) {
                    let sql = `INSERT INTO login (username,password) VALUES ('${req.body.username}','${hash}')`
                    db.query(sql, function (err, result) {
                        if (err) {
                            throw err;
                        }
                        res.send("User Successfully Created");
                    })
                }
                if (resu[0]) {
                    res.send("User already exits");
                }
            })
        }
        else {
            res.send("incorrect username")
        }
    }
    else {
        res.send("enter valid username and password")
    }
});

//Test case for register
// chai.request(app)
// .post('/register')
// .send({username: 'rini@gmail.com',password : 'rinimini'})
// .end(function (err,res) {
// expect(res).have.status(200);
// if(err)
// {
// console.log(err);
// }
// console.log("Test Successfull");
// })


