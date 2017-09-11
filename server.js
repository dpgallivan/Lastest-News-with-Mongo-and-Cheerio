// Dependencies
var express = require("express");
var mongojs = require("mongojs")
var bodyParser = require("body-parser");
// var mongoose = require("mongoose");
var request = require("request");
var cheerio = require("cheerio");

var http = require("http");
var path = require("path");
// var index = require("./public/html/index.html")
var Server = http.createServer(function(request, response) {
  var index = path.join(__dirname, 'index.html');
});
// Initialize Express
var app = express();

// Use morgan and body parser with our app
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(express.static("public"));

// Database configuration
var databaseUrl = "news";
var collections = ["scrapeNews"];

// Hook mongojs config to db variable
var db = mongojs(databaseUrl, collections);

db.on("error", function(error) {
  console.log("Database Error:", error);
});


// Routes
// =======================================================
app.get("/", function(req, res) {
  res.send(index.html);
});

app.get("/all", function(req, res) {
  db.notes.find({}, function(error, found) {
    if (error) {
      console.log(error);
    }
    else {
      res.json(found);
    }
  });
});

app.get("/scrape", function(req, res){
  request("http//www.wsj.com/", function(err, res, html){
    var $ = cheerio.load(html);
      $("h3.wsj-headline").each(function(i, element){
        
        var result = {};
        result.title = $(this).children("a").text();
        result.note = $(this).children("a").attr("href");

        var entry = new Article(result);
        entry.save(function(err, doc){
          if(err) {
            console.log(err)
          } else {
            console.log(doc);
          }
        });
      });
  });
});

app.get("/find/:id", function(req, res) {
  db.notes.findOne({
    "_id": mongojs.ObjectId(req.params.id)
  }, function(error, found) {
    if (error) {
      console.log(error);
      res.send(error);
    }
    else {
      console.log(found);
      res.send(found);
    }
  });
});

app.post("/submit", function(req, res) {
  console.log(req.body);
  db.notes.insert(req.body, function(error, saved) {
    if (error) {
      console.log(error);
    }
    else {
      res.send(saved);
    }
  });
});

app.post("/update/:id", function(req, res) {
    db.notes.update({
    "_id": mongojs.ObjectId(req.params.id)
  }, {
    $set: {
      "title": req.body.title,
      "note": req.body.note,
      "modified": Date.now()
    }
  }, function(error, edited) {
    if (error) {
      console.log(error);
      res.send(error);
    }
    else {
      console.log(edited);
      res.send(edited);
    }
  });
});


app.get("/delete/:id", function(req, res) {
  db.notes.remove({
    "_id": mongojs.ObjectID(req.params.id)
  }, function(error, removed) {
    if (error) {
      console.log(error);
      res.send(error);
    }
    else {
      console.log(removed);
      res.send(removed);
    }
  });
});

app.get("/clearall", function(req, res) {
  db.notes.remove({}, function(error, response) {
    if (error) {
      console.log(error);
      res.send(error);
    }
    else {
      console.log(response);
      res.send(response);
    }
  });
});


// Listen on port 3000
app.listen(3000, function() {
  console.log("App running on port 3000!");
});