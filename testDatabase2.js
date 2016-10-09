var fs = require("fs"); // fs stands for filesystem
var file = "test2.db";
var exists = fs.existsSync(file);

if(!exists) { // if file "test2.db doesn't exist create it"
  console.log("Creating DB file.");
  fs.openSync(file, "w");
}

var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database(file);

db.serialize(function() {
  if(!exists) {
    db.run("CREATE TABLE Stuff (thing text not null, word text not null)");
  }
  
        var stmt = db.prepare("INSERT INTO Stuff VALUES (?,?)");
// stmt: stands for statement or instruction
//Insert random data
  var rnd;
  for (var i = 0; i < 10; i++) {
    rnd = Math.floor(Math.random() * 10000000);
    stmt.run("Thing #" + rnd, "hallo");
  }
  
stmt.finalize();
  db.each("SELECT rowid AS id, thing, word FROM Stuff", function(err, row) {
    console.log(row.id + ": " + row.thing + "word = " + row.word);
  });
});

db.close();