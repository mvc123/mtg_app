// https://www.youtube.com/watch?v=nuw48-u3Yrg
// 52:30 client is sending data explanation.
// req.url = (http:://localhost.com/aaa) aaa

function handleHTTP (req, res){ // req = incoming message    
    console.log("request");
    if(req.url === '/cardnames'){        
        var sqlite3 = require('sqlite3').verbose();        
        var file = "mtg_app.db";        
        var db = new sqlite3.Database(file);        
        var allnames = [];        

        db.all("SELECT name FROM cards", function (err, rows) {            
            if(err){
                console.log(err);
            }
            rows.forEach(function (row) {
                allnames.push(row.name);
            })            
            res.writeHead(200, { 'Content-Type': 'application/json'});             
            res.end(JSON.stringify(allnames));            
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

var node_static = require("node-static");
var static_files = new node_static.Server(__dirname); 
// __dirname = current directory where the current node program is running in.