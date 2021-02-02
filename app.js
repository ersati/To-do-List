const express = require('express');
const bodyParser = require('body-parser');
const data = require('./date')
const app = express();

// const jsonParser = bodyParser.json()
app.use(bodyParser.urlencoded({ extended: false }))
app.set('view engine', 'ejs');

const dataArr = ['zenek', 'Juziek', 'Zbyszek']

app.get('/', function(req,res){
app.use(express.static("public"))
const day = data.getDate()
    res.render('list', {kindDay: day, listOftask: dataArr})
})

app.post("/", function(req,res){
const newTask = req.body.newItem;
if(newTask === '' || typeof newTask === undefined || typeof newTask === null){
     console.log('empty string');
     res.redirect('/')
} else {
    dataArr.push(newTask)
    console.log(newTask)
    res.redirect('/')
}


})









app.listen(3000, function(){
    console.log('pete servers works')
})