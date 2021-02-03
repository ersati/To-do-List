const express = require('express');
const bodyParser = require('body-parser');
const data = require('./date')
const app = express();

// const jsonParser = bodyParser.json()
app.use(bodyParser.urlencoded({
    extended: false
}))
app.set('view engine', 'ejs');

const dataArr = ['zenek', 'Juziek', 'Zbyszek']
const workArr = [];
app.use(express.static("public"))
app.get('/', function (req, res) {

    const day = data.getDate()
    res.render('list', {
        kindDay: day,
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