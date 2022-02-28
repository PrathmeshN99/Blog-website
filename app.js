
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const homeStartingContent = "A Simple and Minimalist blogging website that you can use to write your thoughts and it can be your daily journal. You can compose new blogs as well as read the existing blogs on this website and the blogs are safely stored in mongoDB database. Here on the blogs commence....";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/blogDB", {useNewUrlParser: true});

const postSchema = {
  title: String,
  content: String
};

const Post = mongoose.model("Post", postSchema);

app.get("/", function(req, res){

  Post.find({}, function(err, posts){
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts
      });
  });
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });

  post.save(function(err){
    if (!err){
        res.redirect("/");
    }
  });
});

app.get("/posts/:postId", function(req, res){

const requestedPostId = req.params.postId;

  Post.findOne({_id: requestedPostId}, function(err,post){
    res.render("post", {
      title: post.title,
      content: post.content
    });
  });
});

app.get('/posts/update/:postId', function(req, res){
  
const requestedPostId = req.params.postId;

  Post.findOne({_id: requestedPostId}, function(err,post){ 
    res.render("update", {
     updateBlogName: post.title,
     updateBlogId: post._id,
     oldContent: post.content
    });

  });

});

app.post("/posts/update/:postId", function(req, res){
  
  const requestedPostId = req.params.postId;
  const updatedContent = req.body.postBody;

  Post.updateOne( {_id: requestedPostId } , {$set: {content: updatedContent}}, function(err,post){ 
    res.redirect('/');
    });
  
  
});

app.get("/posts/delete/:postId", function(req, res){

  const requestedPostId = req.params.postId;
  Post.deleteOne({_id:requestedPostId}, function(err,post){
    res.redirect('/');
  });

});


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
