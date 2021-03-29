const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require("mongoose")
// const data = require(__dirname + './date')
const app = express();

// const jsonParser = bodyParser.json()
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

// const dataArr = ['zenek', 'Juziek', 'Zbyszek']
// const workArr = [];
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
    // const day = data.getDate()

})

app.post("/", function (req, res) {
    const newTask = req.body.newItem;
    const item = new Item({
        name: newTask
    })
    item.save()
    res.redirect('/')
    const btn = req.body.button
    // console.log(req.body)
    // if (newTask === '' || typeof newTask === undefined || typeof newTask === null) {
    //     console.log('empty string');
    //     res.redirect('/')
    // } else {

    //     if (btn === 'Work') {
    //         workArr.push(newTask)
    //         res.redirect('/work')
    //     } else {
    //         dataArr.push(newTask)
    //         // console.log(newTask)
    //         res.redirect('/')
    //     }

    // }
})
app.post('/delete', function (req, res) {
    const checkedItemId = req.body.checkbox;
    Item.findByIdAndRemove(checkedItemId, (err) => {
        if (err) {
            console.log(err)
        } else {
            console.log('delete item')
            res.redirect('/')
        }

    })
})
app.get('/work', function (req, res) {
    res.render('list', {
        kindDay: 'Work',
        listOftask: workArr
    })
})







app.listen(3000, function () {
    console.log('pete servers works')
})