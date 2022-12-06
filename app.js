//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require('mongoose');
const e = require("express");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

main().catch(err => console.log(err));

async function main(){
  await mongoose.connect("mongodb+srv://suraj3730:YuWWkWrbF71FTFns@cereatingfirstdatabase.jhdm7oj.mongodb.net/todolistDB");
}

const itemSChema = new mongoose.Schema ({
   name : String
})

const Item = new mongoose.model("item",itemSChema);

const doc1 = new Item({
    name : "welcome to our todolist"
})
const doc2 = new Item({
    name : "hit + to add new item"
})
const doc3 = new Item({
    name  : "hit --> to delete an item"
})

const defaultItem = [doc1,doc2,doc3];

const listSchema = {
     name : String,
     items : [itemSChema]
}

const List = new mongoose.model("list",listSchema)

app.get("/", function(req, res) {


  Item.find({},function(err,items){

    if(items.length === 0)
    {
      Item.insertMany(defaultItem,function(err){
        if(err){
         console.log(err);
        }else{
         console.log("succesfull");
        } 
   })
   res.redirect("/");
    }
    else
    {  
       res.render("list", {listTitle: "Today", newListItems: items});
    }

  })

});

app.post("/", function(req, res){

  const itemname = req.body.newItem;
  const listname = req.body.list;

  const item = new Item({
    name : itemname
  })

  if(listname === "Today"){
    item.save();
    res.redirect("/");
  }else{
    List.findOne({name : listname}, function(err,foundlist){
      foundlist.items.push(item);
      foundlist.save();
      res.redirect("/" + listname);
    })
  }


 
   
});

app.post("/delete",function(req,res){

  

  const checkid = req.body.checkbox;
  const listName = req.body.listname;

  // Item.findByIdAndRemove(checkid,function(err){
  //    if(!err){
  //     console.log("succesfully deleted");
  //     res.redirect("/");
  //    }
  // })

  if(listName === "Today"){
    Item.findByIdAndRemove(checkid,function(err){
      if(!err){
        res.redirect("/");
      }
    })
  }
  else{
    List.findOneAndUpdate({name : listName},{$pull : {items : {_id : checkid}}}, function(err,foundlist){
            if(!err){
              res.redirect("/" + listName);
            }
    });
  }


});

// const list = new List({
//   name : "work",
//   items : defaultItem
// })

// list.save();

app.get("/:userId",function(req,res){
  const customListitem = req.params.userId;

  List.findOne({name : customListitem},function(err,result){
    if(!err){
      if(result){
        res.render("list",{listTitle : result.name , newListItems : result.items});
      }else{
        const list = new List({
          name : customListitem,
          items : defaultItem
        })

        list.save();

        res.redirect("/" + customListitem);
      }
    }
  })

  // List.findOne({customListitem},function(err,result){
  //       if(!err){
  //        if(result)
  //        {
  //          console.log(result);
  //        }
  //        else
  //        {
  //         console.log("exist");
  //        }
  //       }
  // })

})
// List.deleteMany({name : "home"},function(err){
//   if(err){
//     console.log(err);
//   }else{
//     console.log("succesfull");
//   }
// })

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});

