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

mongoose.connect("mongodb://localhost:27017/todolistDB", {useNewUrlParser: true})

const itemsSchema = {
    item: String
}

const Item = mongoose.model("Ttem", itemsSchema)


const task = new Item ({
    name:"Zebej"
})
const task1 = new Item ({
    name:"bej"
})

const task2 = new Item ({
    name:"Ze"
})
const defaultTask = [task, task1, task2]
Item.insertMany(defaultTask, function(err, docs){
    if(!err){
     console.log(err)   
    }else {
        console.log('succesfully saved default')
    }
})
const dataArr = ['zenek', 'Juziek', 'Zbyszek']
const workArr = [];
app.get('/', function (req, res) {

    // const day = data.getDate()
    res.render('list', {
        kindDay: "Today",
        listOftask: dataArr
    })
})

app.post("/", function (req, res) {
    const newTask = req.body.newItem;
    const btn = req.body.button
    console.log(req.body)
    if (newTask === '' || typeof newTask === undefined || typeof newTask === null) {
        console.log('empty string');
        res.redirect('/')
    } else {

        if(btn === 'Work'){
            workArr.push(newTask)
            res.redirect('/work')
        } else{
            dataArr.push(newTask)
            console.log(newTask)
            res.redirect('/')
        }
        
    }
})

app.get('/work', function(req, res){
    res.render('list', {
        kindDay: 'Work',
        listOftask: workArr
    })
})







app.listen(3000, function () {
    console.log('pete servers works')
})