var express = require("express");
var handlebars = require("handlebars");
var mongoose = require("mongoose");

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var PORT = 3000;

// Initialize Express
var app = express();

// Configure middleware

// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// Connect to the Mongo DB

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

// Routes

app.get("/home", function (req, res) {
    console.log("home Route Hit")
    res.send("scrape.html")
})

app.get("/scrape", function (req, res) {
    axios.get("https://www.washingtonpost.com").then(function (response) {

        var data = cheerio.load(response.data)
        data(".headline").each(function (i, element) {
            var result = {}

            result.title = data(element).children("a").text();
            result.link = data(element).children("a").attr("href");
            result.blurb = data(element).next().text()

            if (result.title && result.link && result.blurb) {
                db.Article.create(result).then(function (data) {
                    console.log(data)
                }).catch(function (err) {
                    console.log(err)
                })
            }



        })
        res.send("Scrape Complete");
    })
})

app.get("/articles", function (req, res) {
    console.log("Article Route Hit")
    db.Article.find({})
        .then(function (dbArticle) {
            res.json(dbArticle)
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });

})

app.delete("/articles", function(req,res){
    db.Article.deleteMany({})
    .then(function(data){
        res.json(data)
    })
})

// Route to save article 

app.get("/articles/saved/:id",function(req,res){
    console.log("Saved Route Hit")
    db.Article.findOneAndUpdate({_id: req.params.id}, {$set: { saved: true }},{new: true})
    .then(function(data){
        console.log(data)
        res.json(data)
    })

})

// Route to unsave article
app.get("/articles/delete/:id",function(req,res){
    console.log("Saved Route Hit")
    db.Article.findOneAndUpdate({_id: req.params.id}, {$set: { saved: false }},{new: true})
    .then(function(data){
        console.log(data)
        res.json(data)
    })

})
// Route to retrieve saved articles

app.get("/saved", function(req,res){
    db.Article.find({saved: true})
    .then(function(data){
        res.json(data)
    })
})

// Route for grabbing a specific Article by id, populate it with it's note
app.get("/savenote/:id", function(req, res) {
    console.log("Article ID Route Hit")
    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
    db.Article.findOne({ _id: req.params.id })
      // ..and populate all of the notes associated with it
      .populate("comment")
      .then(function(dbArticle) {
        // If we were able to successfully find an Article with the given id, send it back to the client
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });

 app.post("/savenote/:id", function(req,res){
    db.Comment.create(req.body)
    .then(function(dbComment) {
        console.log(dbComment)
      // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
      // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
      // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
      return db.Article.findOneAndUpdate({ _id: req.params.id }, { comment: dbComment._id }, { new: true });
    })
    .then(function(dbArticle) {
      // If we were able to successfully update an Article, send it back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
 })

app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});