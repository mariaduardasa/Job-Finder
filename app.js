const express = require('express');
const { engine } = require('express-handlebars');
const app = express();
const path = require('path');
const db = require('./db/connection');
const bodyParser = require('body-parser');
const Job = require('./models/Job');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const PORT = 3000;

//body parser
app.use(bodyParser.urlencoded({ extended: false}));

app.listen(PORT, function(){
    console.log('Express esta rodando na porta' + PORT);
});

// handle bars
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', engine({ defaultLayout: 'main' })); // Correção aqui
app.set('view engine', 'handlebars');

//static folder
app.use(express.static(path.join(__dirname, 'public')));

//db connection
db
    .authenticate()
    .then(() => {
        console.log('Conectou com o banco com sucesso!')
    })
    .catch(err => {
        console.log('Ocorreu um erro ao conectar', err);
    });

//routes
// routes
app.get('/', (req, res) => {

    let search = req.query.job;
    let query  = '%'+search+'%'; // PH -> PHP, Word -> Wordpress, press -> Wordpress
  
    if(!search) {
      Job.findAll({order: [
        ['createdAt', 'DESC']
      ]})
      .then(jobs => {
    
        res.render('index', {
          jobs
        });
    
      })
      .catch(err => console.log(err));
    } else {
      Job.findAll({
        where: {title: {[Op.like]: query}},
        order: [
          ['createdAt', 'DESC']
      ]})
      .then(jobs => {
        console.log(search);
        console.log(search);
    
        res.render('index', {
          jobs, search
        });
    
      })
      .catch(err => console.log(err));
    }
  
    
  });

//Job routes
app.use('/jobs', require('./routes/jobs'));