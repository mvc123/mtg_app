// sqlitestudio-3.1.0 : database manager: C:\Program Files (x86)\sqlitestudio-3.1.0
// https://www.sqlite.org/docs.html


// add file "server.js" in the root directory (highest level of the projectfolder: "./server.js") .
// start server: CL: node server.js
// view result: http://localhost:8006/app/main/index.html
// function that handles http requests: 1. req (request, message) comes in 
//                                      2. server goes to database or serves file  
//                                      3. res (response) is send


// probleem: als Jester's Cap wordt opgevraagd: crash'

function handleHTTP (req, res){     
    // example: req = 'http:://localhost.com/aaa' 
    //          req.url = 'aaa'        
    if(req.url === '/cardnames'){        
        var sqlite3 = require('sqlite3').verbose();         
        var file = "mtg_app_allSets.db"; // name of the database => .db        
        var db = new sqlite3.Database(file); // Returns a new Database object and automatically opens the database        
        var allnames = "";        

        db.all("SELECT name FROM cards", function (err, rows) { // rows = results                        
            if(err){
                console.log(err);
            }
            rows.forEach(function (row) {
                allnames = allnames+row.name+",";
            })            
            res.writeHead(200, { 'Content-Type': 'text/html'});             
            res.end(allnames);            
            db.close();            
        })
        return;                                       
    }
    if(req.url === '/deck'){                                     
        var sqlite3 = require('sqlite3').verbose();
        var file = "mtg_app_allSets.db";   
        var db = new sqlite3.Database(file);
                           
        var body = [];
        req.on('data', function(chunk) {
        body.push(chunk);
        }).on('end', function() {
        body = Buffer.concat(body).toString();
        bodyobject = JSON.parse(body);
        console.log(bodyobject.name);

        db.all("INSERT INTO decks ('id', 'name', 'piles') VALUES (null,'"+bodyobject.name+"','"+JSON.stringify(bodyobject.piles)+"')", function (err, rows){
            var message = "";
            if(err){
                message = "opslaan mislukt";
            }
            if(!err){
                message = "opslaan gelukt";
            }            
            res.writeHead(200, { 'Content-Type': 'text/html'});             
            res.end(message);            
            db.close();    
        });        
});
                  
    }  
    if(req.url.match(/card/)){
        var queryObject = url.parse(req.url, true).query;                       
        var cardname = queryObject.cardname;
        var sqlite3 = require('sqlite3').verbose();        
        var file = "mtg_app_allSets.db";        
        var db = new sqlite3.Database(file);
        var cards = [];

        db.all(" SELECT * FROM cards WHERE name = '"+cardname+"'" , function (err, rows){
            
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
