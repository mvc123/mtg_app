var fs = require("fs"); // fs stands for filesystem
var file = "mtg_app.db";
var exists = fs.existsSync(file);
var _ = require('lodash');

if(!exists) { // if file "mtg_app.db" doesn't exist create it"
  console.log("Creating DB file.");
  fs.openSync(file, "w");
}

var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database(file);

db.serialize(function() {
  if(!exists) {
    db.run("CREATE TABLE Cards (name text, manacost text, cmc integer, colors text, type text, types text, subtypes text, text text, power integer, toughness integer, imageName text, colorIdentity text)");
  }
  
  var stmt = db.prepare("INSERT INTO Cards VALUES (?,?,?,?,?,?,?,?,?,?,?,?)");
// stmt: stands for statement or instruction
//Insert random data
  var cards = require("./AllCards-x.json");  
  _.forEach(cards, function(card){
    stmt.run(card.name, card.manaCost, card.cmc, _.toString(card.colors), card.type, _.toString(card.types), _.toString(card.subtypes), card.text, card.power, card.toughness, card.imageName, _.toString(card.colorIdentity));
  })

  stmt.finalize();  
});

db.close();