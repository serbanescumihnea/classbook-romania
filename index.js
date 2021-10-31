var mysql = require('mysql');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');
let ejs = require('ejs')
const {
  resourceLimits
} = require('worker_threads');
const {
  request
} = require('express');
var useragent = require('express-useragent');


var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'catalog'
});






var app = express();

app.use(express.static('./public'));
app.use(useragent.express());
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));
app.use(express.urlencoded({
  extended: true
}));
app.use(express.json());

 

app.get('/', function(request, response) {
  response.sendFile(path.join(__dirname + '/login.html'));
  if (request.session.loggedin == true) {
    if (request.session.level == 0)
      response.redirect('/main?mode=note');
    else
      response.redirect('/main-teacher');

  }


});


app.post('/auth', function(request, response) {
  var username = request.body.username;
  var password = request.body.password;
  if (username && password) {
    connection.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
      if (results.length > 0) {
        request.session.loggedin = true;
        request.session.username = username;
        request.session.level = results[0].level;
        if (results[0].level == 0) {
          response.redirect('/main?mode=note');
        } else if (results[0].level == 1) {
          response.redirect('/main-teacher');
        }
      } else {
        response.send('Nume de utilizator sau parola gresita!');
      }
      response.end();
    });
  }
});

app.post('/adaugareNota', function(request, response) {

  var nota = request.body.nota;
  var elev = request.body.elev;
  var materie = request.body.materie;
  var data = request.body.data;
  var clasa = request.body.clasa;

  if (request.session.loggedin == true && request.session.level == 1) {
    connection.query("INSERT INTO note (materie, nota, elev, data, clasa) VALUES ('" + materie + "'," + nota + ",'" + elev + "','" + data + "','" + clasa + "')", function(err, result) {
      if (err) throw err;

      response.redirect(request.get('host'));
    });
  }

});




var materii = ["Biologie", "Chimie", "Desen", "Economie", "Filozofie", "Fizica", "Geografie", "Informatica", "Istorie", "Limba Franceza", "Limba Germana", "Limba Latina", "Limba Romana", "Logica", "Matematica", "Muzica", "Religie", "TIC"]





app.get('/main', function(request, response) {
  if (request.session.loggedin && request.session.level == 0) {

    if (request.query.mode == "note") {
      connection.query('SELECT * FROM note WHERE elev=' + "'" + request.session.username + "'", function(err, result) {
        if (err) throw err;
        const JSON_RESULT = JSON.stringify(result);
        response.render(path.join(__dirname + '/main.ejs'), {
          materii: materii,
          JSON_RESULT: JSON_RESULT
        });
      });
    } else if (request.query.mode = "absente") {
      connection.query('SELECT * FROM absente WHERE elev=' + "'" + request.session.username + "'", function(err, result) {
        if (err) throw err;
        const JSON_RESULT = JSON.stringify(result);
        response.render(path.join(__dirname + '/main.absente.ejs'), {
          materii: materii,
          JSON_RESULT: JSON_RESULT
        });
      });
    }

  }else if(request.session.loggedin && request.session.level==1){
      response.redirect("/main-teacher");
  }
   else {
    response.send('Intra in cont pentru a accesa aceasta pagina!');
  }

});

app.get('/statistici', function(request, response) {
  if (request.session.loggedin && request.session.level == 1) {



    if (request.query.clasa && request.session.level == 1) {
      var JSON_RESULT;
      connection.query('SELECT nume,diriginte FROM clase', function(err, result) {
        var elevi = [];
        JSON_RESULT = JSON.stringify(result);

      });
      connection.query('SELECT username FROM users WHERE clasa=' + "'" + request.query.clasa + "'", function(err, result) {
        var elevi = [];
        for (var i = 0; i < result.length; i++) {
          if (result[i].username != null) {
            elevi.push(result[i].username);
          }
        }

        elevi.sort();
        if (!request.query.elev) {
          var JSON_RESULT_NOTE = null;
          response.render(path.join(__dirname + '/stats.ejs'), {
            elevi: elevi,
            JSON_RESULT: JSON_RESULT,
            JSON_RESULT_NOTE: JSON_RESULT_NOTE
          });
        } else if (request.query.elev == "all") {
          var JSON_RESULT_NOTE = "";
          var JSON_RESULT_ABSENTE = "";
          connection.query('SELECT nota,data FROM note WHERE clasa=' + "'" + request.query.clasa + "'", function(err, result_note) {
            JSON_RESULT_NOTE = JSON.stringify(result_note)

            connection.query('SELECT data FROM absente WHERE clasa=' + "'" + request.query.clasa + "'", function(err, result_absente) {
              JSON_RESULT_ABSENTE = JSON.stringify(result_absente)
              response.render(path.join(__dirname + '/stats.ejs'), {
                elevi: elevi,
                JSON_RESULT: JSON_RESULT,
                JSON_RESULT_NOTE: JSON_RESULT_NOTE,
                JSON_RESULT_ABSENTE: JSON_RESULT_ABSENTE
              });
            });
          });


        } else if (request.query.elev) {
          var JSON_RESULT_NOTE;
          var JSON_RESULT_ABSENTE;
          connection.query('SELECT nota,data FROM note WHERE elev=' + "'" + request.query.elev + "'", function(err, result_note) {
            JSON_RESULT_NOTE = JSON.stringify(result_note)


            connection.query('SELECT data FROM absente WHERE elev=' + "'" + request.query.elev + "'", function(err, result_absente) {
              JSON_RESULT_ABSENTE = JSON.stringify(result_absente)
              response.render(path.join(__dirname + '/stats.ejs'), {
                elevi: elevi,
                JSON_RESULT: JSON_RESULT,
                JSON_RESULT_NOTE: JSON_RESULT_NOTE,
                JSON_RESULT_ABSENTE: JSON_RESULT_ABSENTE
              });
            });

          });

        }
      });
    } else if (!request.query.clasa && request.session.level == 1) {
      connection.query('SELECT nume,diriginte FROM clase', function(err, result) {
        var elevi = [];
        const JSON_RESULT = JSON.stringify(result);
        var JSON_RESULT_NOTE = null;
        response.render(path.join(__dirname + '/stats.ejs'), {
          elevi: elevi,
          JSON_RESULT: JSON_RESULT,
          JSON_RESULT_NOTE: JSON_RESULT_NOTE
        });
      });
    }
  }

    else if (request.session.level == 0) {
      var JSON_RESULT_NOTE;
      var JSON_RESULT_ABSENTE;
      connection.query('SELECT data FROM absente WHERE elev="' + request.session.username + '"', function(err, resultAbsente) {
         JSON_RESULT_ABSENTE = JSON.stringify(resultAbsente);
        connection.query('SELECT nota,data FROM note WHERE elev="' + request.session.username + '"', function(err, resultNote) {
            var elevi = [request.session.username];
            var JSON_RESULT = null;
            JSON_RESULT_NOTE = JSON.stringify(resultNote);

            response.render(path.join(__dirname+'/stats.ejs'),{
              elevi: elevi,
              JSON_RESULT:JSON_RESULT,
              JSON_RESULT_NOTE: JSON_RESULT_NOTE,
              JSON_RESULT_ABSENTE: JSON_RESULT_ABSENTE
            });
            response.end();

        });
      });
    }


});

app.get('/view', function(request, response) {
  if (request.session.loggedin && request.session.level == 1) {
    if (request.query.id != null && request.query.mode == "note") {
      connection.query('SELECT * FROM note WHERE elev=' + "'" + request.query.id + "'", function(err, result) {
        const JSON_RESULT = JSON.stringify(result);
        response.render(path.join(__dirname + '/inspect.note.ejs'), {
          materii: materii,
          JSON_RESULT: JSON_RESULT
        });
      });


    } else if (request.query.id != null && request.query.mode == "absente") {
      connection.query('SELECT * FROM absente WHERE elev=' + "'" + request.query.id + "'", function(err, result) {
        const JSON_RESULT = JSON.stringify(result);
        response.render(path.join(__dirname + '/inspect.absente.ejs'), {
          materii: materii,
          JSON_RESULT: JSON_RESULT
        });
      });
    } else if (request.query.class != null) {
      connection.query('SELECT username FROM users WHERE clasa="' + request.query.class + '"', function(err, result) {
        if (err) throw err;
        var eleviClasa = [];

        for (var i = 0; i < result.length; i++) {

          eleviClasa.push(result[i].username);

        }

        eleviClasa.sort();
        response.render(path.join(__dirname + '/inspect.class.ejs'), {
          result: eleviClasa,
          clasa: request.query.class
        });
      });


    } else {
      response.send("Nu ai selectat nimic!");
    }
  } else {
    response.send('Intra in cont pentru a accesa aceasta pagina si verifica nivelul de acces!');
  }
});
var clase = [];
app.get('/main-teacher', function(request, response) {
  if (request.session.loggedin && request.session.level == 1) {
    connection.query('SELECT * FROM clase', function(err, result) {

      if (err) throw err;





      response.render(path.join(__dirname + '/main.teacher.ejs'), {
        result: result
      });

    });

  }
});


app.post('/adaugareAbsenta', function(request, response) {

  var data = String(request.body.data);
  var elev = request.body.elev;
  var materie = request.body.materie;
  if (request.session.loggedin == true && request.session.level == 1) {
    connection.query("INSERT INTO absente (elev, data, materie) VALUES ('" + elev + "','" + String(data) + "','" + materie + "')", function(err, result) {
      if (err) throw err;

      response.redirect(request.get('host'));
    });
  }

});





app.post('/stergereAbsenta', function(request, response) {



  var data = request.body.data;
  var elev = request.body.elev;
  var materie = request.body.materie;
  if (request.session.loggedin == true && request.session.level == 1) {

    connection.query("UPDATE absente SET valabilitate=0 WHERE elev='" + elev + "' AND materie='" + materie + "' AND data='" + data + "'", function(err, result) {

      response.redirect(request.get('host'));
    });


  }

});



var server = app.listen(3000, function() {
  console.log('Listening on port %d', server.address().port);
});
