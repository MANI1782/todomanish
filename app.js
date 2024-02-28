//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose")


const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://manish:12345@cluster0.guoe3yq.mongodb.net/MyLists")

const itemSchema = {
  name: String
}
const Items = mongoose.model("Items", itemSchema)

const item1 = new Items({
  name: "WELCOME TO TODO LIST"

})


const item2 = new Items({
  name: "PRESS + TO ADD ITEMS"
})
const item3 = new Items({
  name: "<---PRESS TO REMOVE ELEMENT"
})

const defaultItems = [item1, item2, item3]

const listSchema = {
  name: String,
  items: [itemSchema]
}
const LIST = mongoose.model("list", listSchema)






app.get("/", function (req, res) {

  const day = date.getDate();
  Items.find({}).then(function (FoundItems) {
    if (FoundItems.length === 0) {
      Items.insertMany(defaultItems)
      res.redirect("/")

    }
    else {
      res.render("list", { listTitle: day, newListItems: FoundItems });


    }


  })


});

app.post("/", function (req, res) {

  const itemName = req.body.newItem;
  const item = new Items({
    name: itemName
  })
  item.save()
  res.redirect("/")


});

app.post("/delete", function (req, res) {
  var itemsID = req.body.checkbox
  var id = itemsID.trim()

  Items.findByIdAndDelete(id).then(() => {
    console.log("DELETED")
    res.redirect("/")

  })
    .catch((err) => {
      console.log("ERR", err);
      res.redirect("/")
    })


})


app.get("/:customListName", function (req, res) {
  const name1 = (req.params.customListName)
  LIST.findOne({ name: name1 }).then((founds) => {

    if (!founds) {

      const list = new LIST({
        name: name1,
        items: defaultItems
      })

      list.save();
      res.redirect("/" + name1)

    }


    else {
      res.render("list", { listTitle: founds.name, newListItems: founds.items });
    }
  })
    .catch((err) => {
      console.log("ERROR", err)
    })

});

app.get("/about", function (req, res) {
  res.render("about");
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
