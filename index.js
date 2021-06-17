const express = require('express');
const bodyParser = require('body-parser');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const shortid = require('shortid');

const adapter = new FileSync('db.json');
const db = low(adapter);
const app = express();

app.use(bodyParser.json());


app.get(`/api/users`, async (req, res) => {
  const users = db.get('users').value();
  return res.status(200).send(users);
});

app.post(`/api/user`, async (req, res) => {
  const { name, lastName } = req.body;
  const id = shortid.generate();
  db
  .get('users')
  .push({ id, name, lastName })
  .write();
  
  const user = db.get('users')
  .find({ id })
  .value();
  
  return res.status(201).send({
    error: false,
    user
  });
})

app.put(`/api/user`, async (req, res) => {
  const { name, lastName, id } = req.body;
  
  db.get('users')
  .find({ id })
  .assign({ name, lastName })
  .write();
  
  const user = db.get('users')
  .find({ id })
  .value();
  
  return res.status(202).send({
    error: false,
    user
  });
});

app.delete(`/api/user/:id`, async (req, res) => {
  const { id } = req.params;
  
  db.get('users')
  .remove({ id })
  .write()
  
  return res.status(202).send({
    error: false
  })
  
})

app.get(`/api/aem`, async (req, res) => {
  const aem = db.get('aem').value();
  return res.status(200).send(aem);
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`app running on port ${PORT}`)
});