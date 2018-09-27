
Web App

Prerequisites:-
npm
node.js


----If you do not have node.js, run the following command in you ternimal :-
$ npm install


Installation
Install all dependencies in package.json file. This can be done by navigating to the root directory in the command line interface and running the following command:

$ npm install


$ npm install express --save



Following things to be done in order to connect the WebApp to MySql :-
Open mysql and run the following command :-
1. ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'Hardik-2010'
2. CREATE DATABASE WebApp
4. user WebApp
3. CREATE TABLE login(
    username varchar(255),
    password varchar(255)
    );



To run the application executue following commands :-
1. node express
    or
2. npm start
    or
3. nodemon (recommended as it automatically restarts the node application when file changes in the directory)



-- Access API at: http://localhost:3000
