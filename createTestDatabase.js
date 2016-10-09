var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(':memory:');

var allcardsJSON = require ("./AllCards-x.json");
// var allcards = JSON.parse(allcardsJSON);

db.serialize(function() {
  db.run("CREATE TABLE cards (id int primary key, layout text, name text, manacost text, cmc integer, colors text, type text, types text, subtypes text, text text, power integer, toughness integer, imageName text, printings text, legalities text, colorIdentity text)");

  /*forEach(allcards, function(card){
      "INSERT INTO cards VALUES("+card.layout+","+card.name+","+card.manacost+","+card.cmc+","+card.colors+","+card.type+","+card.types+","+card.subtypes+","+card.text+","+card.power+","+card.toughness+","+card.imageName+","+card.printings+","+card.legalities+","+card.colorIdentity+")";
  })*/

  var stmt = db.prepare("INSERT INTO cards VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)");
  for (var i = 0; i < allcardsJSON.length; i++) {
      stmt.run(allcards[i]);
  }
  stmt.finalize();

  /*db.each("SELECT rowid AS id, info FROM lorem", function(err, row) {
      console.log(row.id + ": " + row.info);
  });*/

  /*var stmt = db.prepare("INSERT INTO cards VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)");
  for (var i = 0; i < 10; i++) {
      stmt.run("Ipsum " + i);
  }
  stmt.finalize(); */

  /*db.each("SELECT rowid AS id, info FROM lorem", function(err, row) {
      console.log(row.id + ": " + row.info);
  });*/
});

db.close();