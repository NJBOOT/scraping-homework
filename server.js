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
    console.log("Route Hit")
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
    db.Article.find({})
        .then(function (dbArticle) {
            res.json(dbArticle)
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });

})

// Route to save article 

app.get("/articles/saved/:id",function(req,res){
    db.Article.find({_id: req.params.id})
    .then(function(data){
        res.json(data)
    })

})


// app.get("/articles/:id", function (req,res){})
// app.post("/saved/articles/:id", function(req,res){})
// app.put("/saved/:id", function (req,res){})
// app.delete("/saved/:id", function(req,res){})

app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});