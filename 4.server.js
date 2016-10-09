function handleHTTP (req, res){
    static_files.serve(req,res);            
} 

// function to handle http request
// request and response.
var http = require("http");
var host = "localhost";
var port = 8006;
var http_serv = http.createServer(handleHTTP).listen(port,host);

var node_static = require("node-static");
var static_files = new node_static.Server(__dirname); 
// __dirname = current directory where the current node program is running in. 

