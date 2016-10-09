var fs = require("fs"); // fs stands for filesystem
var file = "test3.db";
var exists = fs.existsSync(file);

if(!exists) { // if file "test2.db doesn't exist create it"
  console.log("Creating DB file.");
  fs.openSync(file, "w");
}

var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database(file);

db.serialize(function() {
  if(!exists) {
    db.run("CREATE TABLE Cards (name text not null, text text not null)");
  }
  
        var stmt = db.prepare("INSERT INTO Cards VALUES (?,?)");
// stmt: stands for statement or instruction
//Insert random data
  var cards = [{name:"Lightning Bolt", text: "3 damage"},{name:"Disenchant" , text: "Destroy artifact or enchantment"}] 
  for (var i = 0; i < cards.length; i++) {    
    stmt.run(cards[i].name, cards[i].text);
  }
  
stmt.finalize();
  db.each("SELECT rowid AS id, name, text FROM Cards", function(err, row) {
    console.log(row.id + ": " + row.name + ":" + row.text);
  });
});

db.close();