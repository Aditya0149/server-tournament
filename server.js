var express = require("express");
var cors = require('cors');
var server = express();
var bodyParser = require("body-parser");
var fs = require("fs");
var jsonFile = require("jsonfile");
var mongoose = require('mongoose');
var yaml = require('yamljs');

server.use(express.static("js"));
server.use(express.static("css"));
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({extended:true}));
server.use(cors());
server.use(express.static('./pages'));

var usersFile = "D:/eprize project/2018/Apr/Cocacola/242816_cocacola_give/Source/04-Apr-18/give/copydeck/en";

var player = mongoose.Schema({
  emailId: String,
  password: String,
  name: String,
  team: String
});



var Player = mongoose.model('player', player);

server.get("/:path",function(req,res){
  let path = req.params.path;
  var fileArray = [];
  let promise = new Promise((resolve,reject) =>
    fs.readdir(usersFile, (err, files) => {
      files.forEach(file => {
        fileArray.push(file);
      });
      resolve(fileArray);
    })
  );

  promise.then((data) => {
    res.send(data);
  })
});

server.get("/getCopy/:filename",function(req,res){
  let toysFolder = "";
  let ymlfile= "";
  let filename = req.params.filename;
  nativeObject = yaml.load(usersFile + "/" + filename);
  res.send(nativeObject);
});


server.post("/creatPlayer",function(req,res){
  var reqObj = req.body;
  mongoose.connect('mongodb://localhost/tournament');
  var db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function() {

    var player = reqObj;
    player.save(function (err, data) {
      if (err) return console.error(err);
      console.log("data",data);
    });
  });
  res.send("");
});

server.get("/users/:id",function(req,res){ // get one element
  var configFile = "";
  configFile = fs.readFileSync(usersFile);
  var jsObj = JSON.parse(configFile);
  var resObj = {};
  for(i in jsObj){
    if(jsObj[i].id == req.params.id) {
        resObj = jsObj[i];
    }
  }

  res.send(resObj);
});

server.post("/users",function(req,res){ // save element
    var configFile = fs.readFileSync(usersFile);
    var jsObj = JSON.parse(configFile);
    var reqObj = req.body;
    Array.prototype.last = function() {
        return this[this.length-1];
    }
    if(jsObj.last()){
      var id = parseInt(jsObj.last().id) + 1;
      console.log(id);
    }
    else
      id = 1;
    reqObj.id = id;
    jsObj.push(reqObj);
    var newConfigFile = JSON.stringify(jsObj);
    fs.writeFileSync(usersFile,newConfigFile);
    res.send({});
});


server.put("/users/:id",function(req,res){ // update element
    var configFile = fs.readFileSync(usersFile);
    var jsObj = JSON.parse(configFile);
    var id = req.params.id;
    var resObj = {};
    for(i in jsObj){
      if(jsObj[i].id == req.params.id) {
          jsObj[i] = req.body;
      }
    }
    var newConfigFile = JSON.stringify(jsObj);
    fs.writeFileSync(usersFile,newConfigFile);
    res.send({});
});

server.delete("/users/:id",function(req,res){ // delete element
    var configFile = fs.readFileSync(usersFile);
    var jsObj = JSON.parse(configFile);
    var id = req.params.id;
    var resObj = {};
    for(i in jsObj){
      if(jsObj[i].id == req.params.id) {
          jsObj.splice(i,1)
      }
    }
    var newConfigFile = JSON.stringify(jsObj);
    fs.writeFileSync(usersFile,newConfigFile);
    res.send({});
});


server.listen(8888,function(){
   console.log("server is listening on port 8888");
});
