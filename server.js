// sqlitestudio-3.1.0 : database manager: C:\Program Files (x86)\sqlitestudio-3.1.0
// https://www.sqlite.org/docs.html


// add file "server.js" in the root directory (highest level of the projectfolder: "./server.js") .
// start server: CL: node server.js
// view result: http://localhost:8006/app/main/index.html
// function that handles http requests: 1. req (request, message) comes in 
//                                      2. server goes to database or serves file  
//                                      3. res (response) is send

var _ = require('lodash');

function handleHTTP (req, res){     
    // example: req = 'http:://localhost.com/aaa' 
    //          req.url = 'aaa'    
    if(req.url === '/cardnames'){        
        var sqlite3 = require('sqlite3').verbose();         
        var file = "mtg_app_allSets.db"; // name of the database => .db        
        var db = new sqlite3.Database(file); // Returns a new Database object and automatically opens the database        
        var allnames = [];        

        db.all("SELECT name FROM Cards", function (err, rows) { // rows = results                        
            if(err){
                console.log(err);
            }
            rows.forEach(function (row) {
                allnames.push(row);
            })            
            res.writeHead(200, { 'Content-Type': 'application/json'});             
            res.end(JSON.stringify(allnames));            
            db.close();            
        })
        return;                                       
    }
    // save new deck
    if(req.url === '/deck' && req.method === 'POST'){                                     
        var sqlite3 = require('sqlite3').verbose();
        var file = "mtg_app_allSets.db";   
        var db = new sqlite3.Database(file);
                           
        var body = [];
        req.on('data', function (chunk) {
            body.push(chunk);
        }).on('end', function () {
            body = Buffer.concat(body).toString(); // geen toString geeft Buffer 7b 52 6e 6d
            var parsedbody= JSON.parse(body);                        
            var stmt = db.prepare('INSERT INTO Decks ("id", "name", "piles") VALUES (?,?,?)');
            stmt.run(null, parsedbody.name, JSON.stringify(parsedbody.piles));   
            stmt.finalize();                              
            var message = "opslaan gelukt";            
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(message);
            db.close();                       
        });
        return; 
    } 
    // update existing deck (name + piles, keep id)
    if(req.url === '/deck' && req.method === 'PUT'){                                     
        var sqlite3 = require('sqlite3').verbose();
        var file = "mtg_app_allSets.db";   
        var db = new sqlite3.Database(file);
                           
        var body = [];
        req.on('data', function (chunk) {
            body.push(chunk);
        }).on('end', function () {
            body = Buffer.concat(body).toString(); // geen toString geeft Buffer 7b 52 6e 6d
            var parsedbody= JSON.parse(body);  
            var stmt = db.prepare('UPDATE Decks SET "name" = ?, "piles" = ? WHERE id = ?');
            stmt.run(parsedbody.name, JSON.stringify(parsedbody.piles), parsedbody.id);   
            stmt.finalize();                              
            var message = "update gelukt";            
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(message);
            db.close();                       
        });
        return; 
    } 
    if(req.url === '/alldecks'){
        var sqlite3 = require('sqlite3').verbose();
        var file = "mtg_app_allSets.db";   
        var db = new sqlite3.Database(file);
        var decks = [];

        db.all(" SELECT * FROM Decks", function (err, rows){
            if(err){
                console.log(err);
            }
            rows.forEach(function (row){
                decks.push(row);
            })
            res.writeHead(200, { 'Content-Type': "application/json"});
            res.end(JSON.stringify(decks));            
            db.close(); 
        })
        return;
    } 
    if(req.url.match(/card/)){
        var queryObject = url.parse(req.url, true).query;                       
        var cardname = queryObject.cardname;
        var sqlite3 = require('sqlite3').verbose();        
        var file = "mtg_app_allSets.db";        
        var db = new sqlite3.Database(file);
        var cards = [];

        db.all(' SELECT * FROM Cards WHERE name = "'+cardname+'"' , function (err, rows){
            
            if(err){
                console.log(err);
            }
            rows.forEach(function (row) {
                cards.push(row);
            })            
            res.writeHead(200, { 'Content-Type': "application/json"});
            res.end(JSON.stringify(cards));            
            db.close(); 
        })
        return;
    }
    static_files.serve(req,res);
}

var http = require("http");
var host = "localhost";
var port = 8006;
var http_serv = http.createServer(handleHTTP).listen(port,host);
var url = require("url");

// static file server
var node_static = require("node-static");
var static_files = new node_static.Server(__dirname, {cache: 0}); 
 // __dirname = current directory where the current node program is running in.
 var __dirname ="./app/main"  // niet zeker of dit juist is.   

console.log("Server started !");
console.log("Browse to http://localhost:8006/app/main/index.html")
// https://www.youtube.com/watch?v=nuw48-u3Yrg
// 52:30 client is sending data explanation.
