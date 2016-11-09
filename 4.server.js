// https://www.youtube.com/watch?v=nuw48-u3Yrg
// 52:30 client is sending data explanation.
// req.url = (http:://localhost.com/aaa) aaa

function handleHTTP (req, res){ // req = incoming message        
    if(req.url === '/cardnames'){        
        var sqlite3 = require('sqlite3').verbose();        
        var file = "mtg_app_allSets.db";        
        var db = new sqlite3.Database(file);        
        var allnames = "";        

        db.all("SELECT name FROM cards", function (err, rows) {            
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

var node_static = require("node-static");
var static_files = new node_static.Server(__dirname); 
// __dirname = current directory where the current node program is running in.