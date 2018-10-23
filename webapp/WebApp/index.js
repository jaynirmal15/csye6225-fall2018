const express = require('express');
const mysql  =  require('mysql');
const bcryptjs = require('bcryptjs');
const basicAuth = require('basic-auth');
const bodyparser = require('body-parser');
const saltRounds = 10;
const app = express();
const path=require('path');
const config = require('./config.js');
const multer = require('multer');
const multerS3 = require('multer-s3');
const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const fs = require('fs');
//testing
//process.env.NODE_ENV = 'test';
var request = require('supertest');
let chai = require('chai');
let chaiHttp = require('chai-http');
let uuidv1 = require('uuid/v1')
let should = chai.should();
var expect = chai.expect;
chai.use(chaiHttp);

//bodyparser for testing api inputs
app.use(bodyparser.urlencoded({
    extended : false
}));

app.use(bodyparser.json());
//console.log(config);
const bucket_name = config.aws.bucket_name;
const dt=Date.now();
var storage=null;
var lname;
const uploadDir='uploads/';
if(process.env.NODE_ENV==="local")
{
    storage = multer.diskStorage({
        destination:uploadDir,
        filename: function(req, file, callback) {
            callback(null, file.originalname)
        }
    });
}
else if(process.env.NODE_ENV==="dev")
{

    storage=multerS3({
        s3: s3,
        bucket: bucket_name,//bucketname
        metadata: function (req, file, cb) {
          //  console.log(bname);
            cb(null, {fieldName: file.fieldname});//fieldname
        },
        key: function (req, file, cb) {
            cb(null, file.originalname)//uploaded file name after upload
        }
    });
}
else{console.log("3");}
//init upload
const upload=multer({
    storage:storage,
    limits:{fileSize:1000000},
    fileFilter:function(req,file,callback){
        checkFileType(file,callback);
        console.log(file);
    }
}).single('fileupload');

function checkFileType(file,callback){
    const fileTypes=/jpeg|jpg|png|gif/;
    const extName=fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType=fileTypes.test(file.mimetype);
    if(mimeType && extName){
        return callback(null,true);
    } else{
        callback('Error: Images Only');
    }
}



app.post('/transactions/:id/attachments',function (req,res) {
    if(req.params.id && basicAuth(req)){
        var credentials = basicAuth(req);
        let sql = `SELECT password from login WHERE username = '${credentials.name}'`;
        db.query(sql,function (err,passauth) {
            if(err){
                throw err;
            }
            if(bcryptjs.compareSync(credentials.pass,passauth[0].password)){
                let transQuery = `SELECT id,username from transactions WHERE id ='${req.params.id}'`;
                db.query(transQuery,function (err,trans) {
                    if(err){
                        throw err;
                    }
                    if((trans.length) > 0){
                        if(trans[0].username == credentials.name){
                            upload(req,res,(err => {
                                if(err){
                                    throw err;
                                }
                                else {
                                    if(req.file === undefined){
                                        res.send("Please select an image");
                                        console.log("No images selected");
                                    }
                                    else {
                                        var uid = uuidv1();
                                        var url;
                                        if(process.env.NODE_ENV ==="dev"){
                                            url = "https://s3.amazonaws.com/" + bucket_name + "/" + req.file.originalname;
                                        }
                                        else if (process.env.NODE_ENV ==="local") {
                                            url = uploadDir + req.file.originalname;
                                        }

                                        var sql = `INSERT into attachments values('${uid}','${url}','${req.params.id}','${process.env.NODE_ENV}')`;
                                        db.query(sql,function (err,postSucess) {
                                            if(err){
                                                throw err;
                                            }
                                            else {
                                                if (postSucess) {
                                                    res.send("Attachment posted successfully");
                                                }
                                            }
                                        })

                                    }
                                }
                            }));
                        }
                        else{
                            res.status(401).send("User not authorized");
                        }
                    }
                    else{
                        res.status(400).send("Transaction not found");
                    }
                })
            }
            else{
                res.status(401).send("Authentication failed");
            }
        })
    }
    else{
        res.status(400).send("Please enter credentials");
    }
})

app.get('/transactions/:id/attachments',function (req,res) {
    if(req.params.id && basicAuth(req)){
        var credentials = basicAuth(req);
        let sql = `SELECT password from login WHERE username = '${credentials.name}'`;
        db.query(sql,function (err,passauth) {
            if(err){
                throw err;
            }
            if(bcryptjs.compareSync(credentials.pass,passauth[0].password)){
                let transQuery = `SELECT id,username from transactions WHERE id ='${req.params.id}'`;
                db.query(transQuery,function (err,trans) {
                    if(err){
                        throw err;
                    }
                    if((trans.length) > 0){
                        if(trans[0].username == credentials.name){
                            var qwsql = `SELECT transaction_id,id,receipt from attachments WHERE transaction_id = '${req.params.id}' AND environment = '${process.env.NODE_ENV}' `;
                            db.query(qwsql,function (err,getSuccess) {
                                if(err){
                                    throw err;
                                }
                                else{
                                    if(getSuccess[0])
                                    {
                                        res.send(getSuccess);
                                    }
                                    else {
                                        res.send("No receipts found for this transaction");
                                    }
                                }
                            })

                        }
                        else{
                            res.status(401).send("User not authorized");
                        }
                    }
                    else{
                        res.status(400).send("Transaction not found");
                    }
                })
            }
            else{
                res.status(401).send("Authentication failed");
            }
        })
    }
    else{
        res.status(400).send("Please enter credentials");
    }
})

app.delete('/transactions/:id/attachments/:attachmentId',function (req,res) {
    if(req.params.id && basicAuth(req)){
        var credentials = basicAuth(req);
        let qwsql = `SELECT password from login WHERE username = '${credentials.name}'`;
        db.query(qwsql,function (err,passauth) {
            if(err){
                throw err;
            }
            if(bcryptjs.compareSync(credentials.pass,passauth[0].password)){
                let transQuery = `SELECT id,username from transactions WHERE id ='${req.params.id}'`;
                db.query(transQuery,function (err,trans) {
                    if(err){
                        throw err;
                    }
                    if((trans.length) > 0){
                        if(trans[0].username == credentials.name){
                            var sql = `SELECT receipt from attachments WHERE id = '${req.params.attachmentId}' && transaction_id = '${req.params.id}'`
                            db.query(sql,function (err,deleteSuccess) {
                                if(err){
                                    throw err;
                                }
                                else {
                                    if(deleteSuccess[0]){

                                        if(process.env.NODE_ENV === "dev"){
                                            var spliturl = deleteSuccess[0].receipt.split(bucket_name);
                                            var url = spliturl[1].split("/");
                                              console.log(url[1]);
                                            s3.deleteObject({
                                                Bucket : config.aws.bucket_name,
                                                Key : url[1]
                                            },function (err,data) {
                                                //  res.send(data);
                                                var deleteSql = `DELETE from attachments where id = '${req.params.attachmentId}'`;
                                                db.query(deleteSql, function (err,deleteSuc) {
                                                    if(err){
                                                        throw err;
                                                    }
                                                    else {
                                                        res.send("Image delete successfully");

                                                    }
                                                })
                                            })
                                        }
                                        else if (process.env.NODE_ENV ==="local"){
                                            var localurl =  deleteSuccess[0].receipt;
                                            fs.unlink(localurl, (err) => {
                                                if(err){
                                                    throw err;
                                                }
                                                else {
                                                    var deletSql = `DELETE from attachments where id = '${req.params.attachmentId}'`;
                                                    db.query(deletSql, function (err,deleteSuc) {
                                                        if(err){
                                                            throw err;
                                                        }
                                                        else {
                                                            res.send("Image delete successfully");

                                                        }
                                                    })
                                                }
                                                // res.send("Image Successfully delete");
                                            })
                                        }

                                    }
                                    else{
                                        res.send("No attachments found");
                                    }
                                }
                            })
                        }
                        else{
                            res.status(401).send("User not authorized");
                        }
                    }
                    else{
                        res.status(400).send("Transaction not found");
                    }
                })
            }
            else{
                res.status(401).send("Authentication failed");
            }
        })
    }
    else{
        res.status(400).send("Please enter credentials");
    }
});

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
    if(process.env.NODE_ENV==='dev'){
        s3.listBuckets(function(err, data) {
            if (err) {
                console.log("Error", err);
            } else {
                lname = data.Buckets[0].Name;
            }
        });
    }

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

app.post('/register',(req,res) =>{
    console.log(lname);
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
    if(basicAuth(req)) {
        var credentials = basicAuth(req);
        var salt = bcryptjs.genSaltSync(saltRounds);
        var decrypt = bcryptjs.hashSync(credentials.pass, salt);
        let seesql = `SELECT password from login WHERE username = '${credentials.name}'`
        db.query(seesql, function (err, passauth) {
            if (err) {
                throw err;
            }
            if (bcryptjs.compareSync(credentials.pass, passauth[0].password)) {

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
    }
    else{
        res.send("Please enter credentials");
    }
})

app.get('/transaction',(req,res) => {
    if(basicAuth(req)) {
        var credentials = basicAuth(req);
        var salt = bcryptjs.genSaltSync(saltRounds);
        var decrypt = bcryptjs.hashSync(credentials.pass, salt);
        let seesql = `SELECT password from login WHERE username = '${credentials.name}'`
        db.query(seesql, function (err, passauth) {
            if (err) {
                throw err;
            }
            if (bcryptjs.compareSync(credentials.pass, passauth[0].password)) {

                let sql = `SELECT username,password from login WHERE username = '${credentials.name}' and password = '${passauth[0].password}'`;
                db.query(sql, function (err, log) {
                    if (err) {
                        throw err;
                    }
                    if (log[0]) {
                        let trans_sql = `SELECT * from transactions WHERE username = '${credentials.name}'`;
                        db.query(trans_sql, function (err, transac) {
                            if (err) {
                                throw err;

                            }
                            if (transac) {
                                res.json(transac);
                            }
                            if (!transac) {
                                res.status(400).send("No transactions found");
                            }

                        })
                    }

                    if (!log[0]) {
                        res.status(401).send("invalid username/password")
                    }

                })
            }
            else {
                res.status(400).send("invalid credentionals");
            }
        })
    }
    else{
        res.status(401).send("Please enter credentials");
        
    }
})


app.post('/transaction',(req,res) => {
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
                    var uidtesting = uuidv1();
                    console.log(uidtesting);
                    let trans_sql = `INSERT INTO transactions values('${uidtesting}','${req.body.description}','${req.body.merchant}','${req.body.amount}','${req.body.date}','${req.body.category}','${credentials.name}')`;
                    db.query(trans_sql, function (err,transac) {
                        if(err)
                        {
                            console.log(err)
                            throw err;

                        }
                        if(transac)
                        {
                            res.status(201).json(transac);
                        }
                        if(!transac)
                        {
                            res.status(400).send("No transactions found");
                        }

                    })
                }

                if (!log[0]) {
                    res.status(401).send("Unauthorized")
                }

            })
        }
        else {
            res.send("invalid credentionals")
        }
    })
})

app.delete('/transaction/:id',(req,res) =>{
    if(req.params.id && basicAuth(req)){
        var credentials = basicAuth(req);
        let sql = `SELECT password from login WHERE username = '${credentials.name}'`;
        db.query(sql,function (err,passauth) {
            if(err){
                throw err;
            }
            if(bcryptjs.compareSync(credentials.pass,passauth[0].password)){
                let transQuery = `SELECT id,username from transactions WHERE id ='${req.params.id}'`;
                db.query(transQuery,function (err,trans) {
                       if(err){
                           throw err;
                       }
                       if((trans.length) > 0){
                           if(trans[0].username == credentials.name){
                               delete_query = `DELETE from transactions WHERE id = '${req.params.id}'`;
                               db.query(delete_query,function (err,deleted) {
                                     if(err){
                                         throw err;
                                     }
                                     if(deleted){
                                         res.status(201).send("Transaction deleted successfully");
                                     }
                               })

                           }
                           else{
                               res.status(401).send("User not authorized");
                           }
                       }
                       else{
                           res.status(400).send("Transaction not found");
                       }
                })
            }
            else{
                res.status(401).send("Authentication failed");
            }
        })
    }
    else{
        res.status(400).send("Please enter credentials");
    }
})
app.put('/transaction/:id',(req,res) => {
    if(req.params.id) {
        var credentials = basicAuth(req);
        let sql = `SELECT password from login WHERE username = '${credentials.name}'`
        db.query(sql, function (err, passauth) {
            if (err) {
                throw err;
            }
            if (bcryptjs.compareSync(credentials.pass, passauth[0].password)) {
                let transQuery = `SELECT id,username from transactions WHERE id = '${req.params.id}'`
                db.query(transQuery, function (err, trans) {
                    if (err) {
                        throw err;
                    }

                    if ((trans.length > 0)) {

                        if (trans[0].username == credentials.name) {

                            ins_query = `UPDATE transactions SET tran_description ='${req.body.description}',merchant ='${req.body.merchant}',amount ='${req.body.amount}',transaction_date ='${req.body.date}',category ='${req.body.category}' WHERE id = '${req.params.id}'`;
                            db.query(ins_query, function (err, put_function) {
                                if (err) {
                                    throw err;
                                }
                                console.log(put_function);
                                if (put_function.protocol41 == true) {
                                    select_query = `SELECT * from transactions WHERE id='${req.params.id}'`;
                                    db.query(select_query, function (err, result) {
                                        if (err) {
                                            throw err;
                                        }
                                        if (result) {
                                            res.send(result);
                                        }

                                    })
                                }
                                else {
                                    res.send("Error while updating transactions please try again later.")
                                }
                            })
                        }
                        else {
                            res.status(401).send("User not authorzied to update this transaction");
                        }
                    }
                    else {
                        res.status(400).send("No transactions found");
                    }
                })

            }
            else {
                res.status(401).send("Authentication failed");
            }
        })
    }
    else{
        res.send("Please enter an id");
    }
});
app.put('/transactions/:id/attachments/:attachmentId', (req,res) =>{
    if(req.params.id) {
        var credentials = basicAuth(req);
        let sql = `SELECT password from login WHERE username = '${credentials.name}'`
        db.query(sql, function (err, passauth) {
            if (err) {
                throw err;
            }
            if (bcryptjs.compareSync(credentials.pass, passauth[0].password)) {
                let transQuery = `SELECT id,username from transactions WHERE id = '${req.params.id}'`
                db.query(transQuery, function (err, trans) {
                    if (err) {
                        throw err;
                    }

                    if ((trans.length > 0)) {

                        if (trans[0].username == credentials.name) {
                            let attachmentQuery = `SELECT receipt, environment from attachments WHERE transaction_id = '${req.params.id}' AND id = '${req.params.attachmentId}'`;
                            db.query(attachmentQuery,function (err,att) {
                                if(err){
                                    throw err;
                                }
                                if(att[0]){
                                    console.log(att[0]);
                                    upload(req,res, (err => {
                                        if(err){
                                            throw err;
                                        }
                                        else{
                                            if(att[0].environment == 'dev'){
                                                console.log("andar aaya dev delete k")
                                                var spliturl = att[0].receipt.split(bucket_name);
                                                var url = spliturl[1].split("/");
                                                console.log(url[1]);
                                                s3.deleteObject({
                                                    Bucket : config.aws.bucket_name,
                                                    Key : url[1]
                                                },function (err,data) {
                                                    //  res.send(data);
                                                    var awsUrl = "https://s3.amazonaws.com/" + bucket_name + "/" + req.file.originalname;
                                                    var updateSql = `UPDATE attachments SET receipt = '${awsUrl}' where id = '${req.params.attachmentId}'`;
                                                    db.query(updateSql,function (err,delSuc) {
                                                        if(err){
                                                            throw err;
                                                        }
                                                        else {
                                                            res.send("Image Updated Successfully");
                                                        }
                                                    });
                                                });

                                            }
                                            else if (att[0].environment == 'local'){
                                                console.log("Local aaya me")
                                                console.log(att[0].receipt);
                                                fs.unlink(att[0].receipt,(err) => {
                                                    if(err){
                                                        throw  err;
                                                    }
                                                    else {
                                                        var url = uploadDir + req.file.originalname;
                                                        var updateSql = `UPDATE attachments SET receipt = '${url}' WHERE id = '${req.params.attachmentId}'`;
                                                        db.query(updateSql, function (err,updated) {
                                                            if(err){
                                                                throw err;
                                                            }
                                                            else {
                                                                res.send("Image update successfully");
                                                            }
                                                        });
                                                    }
                                                });
                                            }
                                        }
                                    }));
                                }
                                else{
                                    res.send("Image not found");
                                }
                            })
                        }
                        else {
                            res.status(401).send("User not authorzied to update this transaction");
                        }
                    }
                    else {
                        res.status(400).send("No transactions found");
                    }
                })

            }
            else {
                res.status(401).send("Authentication failed");
            }
        })
    }
    else{
        res.send("Please enter an id");
    }
});










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

function isTransactionPresent(id){
	var isPresent = false;
	var sql = `select * from transactions where id = '${id}';`;
	db.query(sql,function (err,result) {
      if(err){
          throw err;
      }
      //console.log(result.length);
      if(result.length > 0)
      	isPresent = true;
  });
  return isPresent;
}

function isAttachmentPresent(id){
	var isPresent = false;
	var sql = `select * from attachments where id = '${id}';`;
	db.query(sql,function (err,result) {
      if(err){
          throw err;
      }
      //console.log(result.length);
      if(result.length > 0)
      	isPresent = true;
  });
  return isPresent;
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
