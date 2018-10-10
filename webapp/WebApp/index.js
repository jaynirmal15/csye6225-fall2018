const express = require('express');
const mysql  =  require('mysql');
const bcryptjs = require('bcryptjs');
const basicAuth = require('basic-auth');
const bodyparser = require('body-parser');
const saltRounds = 10;
const app = express();



//testing
process.env.NODE_ENV = 'test';
var request = require('supertest');
let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();
var expect = chai.expect;
chai.use(chaiHttp);

//aws and image configuration
const multer = require('multer');
 var upload = multer({ storage: storage });
const de=require('dotenv').load();
const AWS = require('aws-sdk');
const multerS3 = require('multer-s3');
//storage configuration
const dt=Date.now();
var storage=null;
const uploadDir="upload/";

const s3 = new AWS.S3();
const sns = new AWS.SNS({
    region: 'us-east-1'
});







if(process.env.NODE_ENV==="local")

{
    storage = multer.diskStorage({
        destination:uploadDir,
        filename: function(req, file, callback) {
            callback(null, file.originalname + '-' + dt + path.extname(file.originalname))
        }
    });
}
else if(process.env.NODE_ENV==="development")
{
    storage=multerS3({
        s3: s3,
        bucket: process.env.BUCKET,//bucketname
        acl: 'public-read',
        metadata: function (req, file, cb) {
            cb(null, {fieldName: file.fieldname});//fieldname
        },
        key: function (req, file, cb) {
            cb(null, file + '-' + dt + path.extname(file))//uploaded file name after upload
        }
    });
}

function checkFileType(file,callback){
    const fileTypes=/jpeg|jpg|png|gif/;
    const extName=fileTypes.test(path.extname(file).toLowerCase());
    const mimeType=fileTypes.test(file.mimetype);
    if(mimeType && extName){
        return callback(null,true);
    } else{
        callback('Error: Images Only');
    }
}


//bodyparser for testing api inputs
app.use(bodyparser.urlencoded({
    extended : false
}));

app.use(bodyparser.json());

//enabling cors
app.use(function (req,res,next) {

    res.header("Access-Control-Allow-Methods","GET,PUT,POST,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Headers","Origin,X-Requested-With,Content-Type,Accept");
    next();
})

//create the connection
const db =mysql.createConnection({
    host     : 'localhost',
    user     :  'root',
    password : 'Hardik-2010',
    database : 'WebApp'
});

//start the server
app.listen('3000',()=>{
    console.log('Server started on port 3000');
});

//connect to the database
db.connect((err) =>{
    if(err)
    {
        throw err;
    }
    console.log("Database connected");
});

//register api
app.post('/testing',upload.single('recipt'),function (req,res) {
    res.send(req.file);
    console.log(req.file);
})
app.post('/register',(req,res) =>{
    //var u_image=uploadDir + req.file + '-' + dt + path.extname(req.file);
    var form = req.form;
    console.log(req.file);
    if(req.body.username && req.body.password) {
        if (validationemail(req.body.username)) {
            var salt = bcryptjs.genSaltSync(saltRounds);
            var hash = bcryptjs.hashSync(req.body.password, salt);
            let selectsql = `Select username from login WHERE username = '${req.body.username}'`
            db.query(selectsql, function (err, resu) {
                if (err) {
                    throw err;
                }
                if (!resu[0]) {
                    let sql = `INSERT INTO   login (username,password) VALUES ('${req.body.username}','${hash}')`
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

//get time api
app.get('/time',(req,res) => {
    var credentials = basicAuth(req);
    var salt = bcryptjs.genSaltSync(saltRounds);
    var decrypt = bcryptjs.hashSync(credentials.pass, salt);
    let seesql = `SELECT password from login WHERE username = '${credentials.name}'`
    db.query(seesql, function (err, passauth) {
        if (err) {
            throw err;
        }
        if (bcryptjs.compareSync(credentials.pass,passauth[0].password)) {

            let sql = `SELECT username,password from login WHERE username = '${credentials.name}' and password = '${passauth[0].password}'`;
            db.query(sql, function (err, log) {
                if (err) {
                    throw err;
                }
                if (log[0]) {
                    var date = new Date();
                    var hour = date.getHours();
                    hour = (hour < 10 ? "0" : "") + hour;

                    var min = date.getMinutes();
                    min = (min < 10 ? "0" : "") + min;

                    var seconds = date.getSeconds();
                    seconds = (seconds < 10 ? "0" : "") + seconds;

                    var year = date.getFullYear();

                    var month = date.getMonth() + 1;
                    month = (month < 10 ? "0" : "") + month;

                    var day = date.getDate();
                    day = (day < 10 ? "0" : "") + day - 1;

                    var time = (year + ":" + month + ":" + day + " : " + hour + ":" + min + ":" + seconds);
                    res.send(time);
                }
                if (!log[0]) {
                    res.send("invalid username/password")
                }

            })
        }
        else {
            res.send("invalid credentionals")
        }
    })
})

//Code to validate email
function validationemail(email){
  //  var em = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0,9]{1,3}\.[0,9]{1,3}\])\(([a-zA-Z\0-9]+\.)+[a-zA-Z]{2,}))$/;
    var em= /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return em.test(email);
}

// Code to validate whitespaces and tabs.
function hasWhiteSpace(sr)
{
    reWhiteSpace = /\s/g;
    return reWhiteSpace.test(sr);
}

//Test case for register
// chai.request(app)
//     .post('/register')
//     .send({username: 'rini@gmail.com',password : 'rinimini'})
//     .end(function (err,res) {
//         expect(res).have.status(200);
//         if(err)
//         {
//             console.log(err);
//         }
//         console.log("Test Successfull");
//     })
