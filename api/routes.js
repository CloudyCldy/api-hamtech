// routes.js
const express = require('express');
const router = express.Router();
const connection = require('./db');
const jwt =require('jsonwebtoken');
//create new user
router.post('/users', (req, res) => {
  //const { name, email, password_hash } = req.body;
  const datosNuevos = req.body;
  connection.query(
    'INSERT INTO users SET ?',datosNuevos,
    (err, results) => {
      if (err) {
        console.error('Error al crear el usuario:', err);
        res.status(500).json({ error: 'Error al crear el usuario' });
        return;
      }
      res.status(201).json({ message: 'Usuario creado exitosamente' });
    }
  );
});
//get all users
router.get('/users', (req, res) => {
  connection.query('SELECT * FROM users', (err, results) => {
    if (err) {
      console.error('Error al obtener usuarios:', err);
      res.status(500).json({ error: 'Error al obtener usuarios' });
      return;
    }
    res.json(results);
  });
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const user =  Users.findOne({ where: { email: email } });

  if (!user) res.status(400).json({ error: "User Doesn't Exist" });

  const dbPassword = user.password;
  bcrypt.compare(password, dbPassword).then((match) => {
    if (!match) {
      res
        .status(400)
        .json({ error: "Wrong Email and Password Combination!" });
    } else {
      const accessToken = createTokens(user);

      res.cookie("access-token", accessToken, {
        maxAge: 60 * 60 * 24 * 30 * 1000,
        httpOnly: true,
      });

      res.json("LOGGED IN");
    }
  });
});


router.delete('/users/:id', (req, res) => {
  const { id } = req.params;
  connection.query('DELETE FROM users WHERE id = ?', [id], (err, results) => {
    if (err) {
      console.error('Error al eliminar el usuario:', err);
      res.status(500).json({ error: 'Error al eliminar el usuario' });
      return;
    }
    res.json({ message: 'Usuario eliminado exitosamente' });
  });
});


module.exports = router;
