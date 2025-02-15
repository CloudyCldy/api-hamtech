// routes.js
const express = require('express');
const router = express.Router();
const connection = require('./db');
const bcrypt = require('bcrypt');


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
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Validación básica de los datos de entrada
  if (!email || !password) {
    return res.status(400).json({ error: 'Por favor, proporciona un email y una contraseña.' });
  }

  console.log('Intento de login para el email:', email); // Evita registrar datos sensibles como la contraseña

  // Buscar el usuario en la base de datos
  connection.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
    if (err) {
      console.error('Error al verificar el usuario:', err);
      return res.status(500).json({ error: 'Error interno del servidor.' });
    }

    // Verificar si el usuario existe
    if (results.length === 0) {
      return res.status(400).json({ error: 'Credenciales inválidas.' }); // Mensaje genérico para seguridad
    }

    const user = results[0];

    // Comparar la contraseña proporcionada con el hash almacenado
    bcrypt.compare(password, user.password_hash, (err, isMatch) => {
      if (err) {
        console.error('Error al comparar las contraseñas:', err);
        return res.status(500).json({ error: 'Error interno del servidor.' });
      }

      // Verificar si la contraseña coincide
      if (!isMatch) {
        return res.status(400).json({ error: 'Credenciales inválidas.' }); // Mensaje genérico para seguridad
      }

      // Login exitoso
      res.status(200).json({
        message: 'Login exitoso',
        user: {
          id: user.id,
          email: user.email,
          name: user.name
        }
      });
    });
  });
});


//update
router.put('/users/:id', (req, res) => {
  const { id } = req.params;
  const { name, email, password_hash } = req.body;
  connection.query(
    'UPDATE users SET name = ?, email = ?, password_hash = ? WHERE id = ?',
    [name, email, password_hash, id],
    (err, results) => {
      if (err) {
        console.error('Error al actualizar el usuario:', err);
        res.status(500).json({ error: 'Error al actualizar el usuario' });
        return;
      }
      res.json({ message: 'Usuario actualizado exitosamente' });
    }
  );
});
//delete
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
