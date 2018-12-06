const express = require('express');
const bodyparser = require('body-parser');
const path=require('path');
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
    extended : false
}));

 app.use(bodyparser.json());

 app.use(function (req,res,next) {

    res.header("Access-Control-Allow-Methods","GET,PUT,POST,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Headers","Origin,X-Requested-With,Content-Type,Accept");
    next();
});

app.listen('3000',()=>{
    console.log('Server started on port 3000');  
});

 app.get('/hellotest',function(req,res){
    res.send("HelloWorld");
    client.increment('hello');
});

//create the connection
const db =mysql.createConnection({
    host : process.env.DB_HOST,
    user : process.env.DB_USER,
    password : process.env.DB_PASS,
    database : process.env.DB_NAME
});

db.connect((err) =>{
    if(err)
    {
        throw err;
    }
    console.log("Database connected");
});


