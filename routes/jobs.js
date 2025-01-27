const express = require('express');
const router = express.Router();
const Job = require('../models/Job');

//rota de teste
router.get('/test', (req, res) => {
  res.send('deu certo');
});

//detalhe da vaga
router.get('/view/:id', (req, res) => Job.findOne({
  where: {id: req.params.id}
  }).then(job => {

    res.render('view',{
      job
    });

  }).catch(err => console.log(err)));


//form da rota de envio
router.get('/add', (req, res) => {
  res.render('add');
})

// Adiciona job via POST
router.post('/add', (req, res) => {

  let { title, salary, company, description, email, new_job } = req.body;

  // Insere no banco de dados
  Job.create({
    title,
    description,
    salary,
    company,
    email,
    new_job
  })
  .then(() => res.redirect('/'))
  .catch(err => {
    console.log(err);
    res.status(500).send('Erro ao criar job');
  });
});

module.exports = router;
