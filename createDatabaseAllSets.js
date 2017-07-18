// create database of allsets
// 1) go to https://mtgjson.com/ download All Sets (json);
// 2) remove previous version of AllSets.json and save downloaded on root of this folder as "AllSets.json" 
// 3) go to sqlitestudio-3.1.0 : database manager: C:\Program Files (x86)\sqlitestudio-3.1.0
// 4) rightclick table Cards / erase table data 
// 5) let node run this script to get all files: from the command line: node createDatabaseAllSets.js

var fs = require("fs"); // fs stands for filesystem
var file = "mtg_app_allSets.db";
var exists = fs.existsSync(file);
var _ = require('lodash');

if(!exists) { // if file "mtg_app_allSets.db" doesn't exist create it"
  console.log("Creating DB file.");
  fs.openSync(file, "w");
}

var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database(file);

db.serialize(function() {  
  var stmt = db.prepare("INSERT INTO Cards VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)");

  var sets = require("./AllSets.json");
  _.forEach(sets, function(set){
    _.forEach(set.cards, function(card){
        stmt.run(card.name, card.manaCost, card.cmc, _.toString(card.colors), card.type, _.toString(card.types), _.toString(card.subtypes), card.text, card.power, card.toughness, card.imageName, _.toString(card.colorIdentity), card.multiverseid);
    })  
  })  
  stmt.finalize();  
});

db.close();

/*
CREATE TABLE Cards (
    name          TEXT,
    manacost      TEXT,
    cmc           INTEGER,
    colors        TEXT,
    type          TEXT,
    types         TEXT,
    subtypes      TEXT,
    text          TEXT,
    power         INTEGER,
    toughness     INTEGER,
    imageName     TEXT,
    colorIdentity TEXT,
    multiverseId  INTEGER
)
*/
