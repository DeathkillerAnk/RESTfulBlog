var bodyParser = require("body-parser"),
    express = require("express"),
    expressSanitizer = require("express-sanitizer"),
    app = express(),
    methodOverride = require("method-override"),
    mongoose = require("mongoose");
//Config
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));
//Database
mongoose.connect("mongodb://localhost/restful_full_blog_app");
mongoose.set('useFindAndModify', false);
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
    console.log(req.body.post.body);
    req.body.post.body = req.sanitize(req.body.post.body);
    console.log(req.body.post.body);
    Blog.create(req.body.post,function(err){
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

//Edit page
app.get("/blog/:id/edit",function(req,res){
    Blog.findById(req.params.id,function(err,postContent){
        if(!err){
            res.render("edit",{postContent:postContent});
        } else{
            res.redirect("/blog");
        }
    });
});

app.put("/edit/:id",function(req,res){
    Blog.findByIdAndUpdate(req.params.id,req.body.post,function(err,updatedPost){
        if(!err){
            res.redirect("/blog/"+req.params.id);
        } else{
            res.redirect("/blog");
        }
    });
});
//delete
app.delete("/blog/:id/delete",function(req,res){
    Blog.findByIdAndRemove(req.params.id,function(err){
        if(!err){
            res.redirect("/blog");
        } else{
            res.redirect("/blog");
        }
    });
});

app.listen(3000,function(){
    console.log("Blog server started");
});