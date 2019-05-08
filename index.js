var bodyParser = require("body-parser"),
    express = require("express"),
    app = express(),
    mongoose = require("mongoose");
//Config
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

//Database
mongoose.connect("mongodb://localhost/restful_full_blog_app");

var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type:Date,default: Date.now}
});

var Blog = mongoose.model("Blog",blogSchema);

app.get("/",function(req,res){
    res.redirect("/blog");
});
//Index
app.get("/blog",function(req,res){
    Blog.find({},function(err,blogData){
        if(!err){
            res.render("index",{blogData:blogData});
        } else{
            console.log(err);
        }
    });    
});
//New post
app.get("/blog/new",function(req,res){
    res.render("new");
});

//form create post
app.post("/create",function(req,res){
    Blog.create(req.body.post,function(err,post){
        if(!err){
            res.redirect("/blog");
        } else{
            res.render("new");
        }
    });
});

//view
app.get("/blog/:id",function(req,res){
    Blog.findById(req.params.id,function(err,postContent){
        if(!err){
            res.render("show",{postContent:postContent});
        } else{
            res.redirect("/blog");
        }
    });
});

app.listen(3000,function(){
    console.log("Blog server started");
});