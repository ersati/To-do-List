const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const _ = require("lodash");
const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(express.static("public"))

mongoose.connect("mongodb://localhost:27017/todolistDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const itemsSchema = {
    name: String
}

const Item = mongoose.model("Item", itemsSchema)


const task = new Item({
    name: "Hello everyone"
})
const task1 = new Item({
    name: "Press the Add button to add tasks"
})

const task2 = new Item({
    name: "Press <--- to delete the file"
})
const defaultTask = [task, task1, task2]


const listSchema = {
    name: String,
    items: [itemsSchema]
}

const List = mongoose.model("List", listSchema)

app.get('/', function (req, res) {
    Item.find({}, function (err, foundItems) {

        if (foundItems.length === 0) {
            Item.insertMany(defaultTask, function (err) {
                if (err) {
                    console.log(err)
                } else {
                    console.log("Successfully saved default items to DB")
                }
            })
            res.redirect("/")
        } else {
            res.render('list', {
                kindDay: "Today",
                listOftask: foundItems
            })
        }
    })
})


app.get('/:paramName', function (req, res) {

    const paramName = _.capitalize(req.params.paramName);

    List.findOne({
        name: paramName
    }, function (err, foundList) {
        if (!err) {
            if (!foundList) {
                const list = new List({
                    name: paramName,
                    items: defaultTask,
                })
                list.save()
                res.redirect(`/${paramName}`)
            } else {
                res.render("list", {
                    kindDay: foundList.name,
                    listOftask: foundList.items
                })
            }
        }
    })
})


app.post("/", function (req, res) {
    const newTask = req.body.newItem;
    const listName = req.body.list
    const item = new Item({
        name: newTask
    })

    if (listName === "Today") {
        item.save()
        res.redirect('/')

    } else {
        List.findOne({
            name: listName
        }, function (err, foundList) {
            foundList.items.push(item)
            foundList.save();
            res.redirect(`/${listName}`)
        })
    }
})
app.post('/delete', function (req, res) {
    const checkedItemId = req.body.checkbox;
    const listName = req.body.listName;
    if (listName === "Today") {
        Item.findByIdAndRemove(checkedItemId, (err) => {
            if (err) {
                console.log(err)
            } else {
                res.redirect('/')
            }

        })
    } else {
        List.findOneAndUpdate({
            name: listName
        }, {
            $pull: {
                items: {
                    _id: checkedItemId
                }
            }
        }, function (err, foundList) {
            if (!err) {
                res.redirect(`/${listName}`)
            }
        })
    }
})


app.listen(3000, function () {
    console.log('pete servers works')
})