var mysql = require('mysql');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');
let ejs = require('ejs')
const { resourceLimits } = require('worker_threads');

//  CONNECT TO MYSQL DATABASE
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'catalog'
});






var app = express();

app.use(express.static('./public'));
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

// DISPLAY LOGIN PAGE
app.get('/',function(request,response){
    response.sendFile(path.join(__dirname+'/login.html'));
});

app.post('/auth', function(request, response){
    var username = request.body.username;
    var password = request.body.password;
    if(username && password){
        connection.query('SELECT * FROM users WHERE username = ? AND password = ?', [username,password],function(error,results,fields){
            if(results.length > 0){
                request.session.loggedin = true;
                request.session.username = username;
                response.redirect('/main');
            }else{
                response.send('Nume de utilizator sau parola gresita!');
            }
            response.end();
        });
    }
})




var materii = [    "Biologie",    "Chimie",    "Desen",    "Economie",    "Filozofie",    "Fizica",    "Geografie",    "Informatica",    "Istorie",    "Limba Franceza",    "Limba Germana",    "Limba Latina",    "Limba Romana",    "Logica",    "Matematica",    "Muzica",    "Religie",    "TIC"  ]













app.get('/main',function(request,response){
    if(request.session.loggedin){
        //response.send('Buna, ' + request.session.username + '!');
        //response.sendFile(path.join(__dirname+'/main.html'));
        response.render(path.join(__dirname+'/main.ejs'),{materii:materii});
    }else{
        //response.send('Intra in cont pentru a accesa aceasta pagina!');
    }
    //response.end();
});





app.listen(3000);