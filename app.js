// app.js
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();

// Middleware para parsear el cuerpo de las solicitudes HTTP
app.use(bodyParser.urlencoded({ extended: false }));

// Configurar conexión a la base de datos MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // Cambia esto si tienes un usuario diferente
    password: '', // Cambia esto si tienes una contraseña
    database: 'webapp_docentes' // Nombre de la base de datos creada
});

// Conectar a la base de datos
db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Conexión a la base de datos MySQL establecida');
});

// Ruta para servir el formulario HTML
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/formulario.html');
});

// Ruta para manejar el envío del formulario
app.post('/submit', (req, res) => {
    const { dni, nombre, email, mensaje } = req.body;
    const sql = 'INSERT INTO inscripciones (dni, nombre, email, mensaje) VALUES (?, ?, ?, ?)';
    db.query(sql, [dni, nombre, email, mensaje], (err, result) => {
        if (err) {
            throw err;
        }
        console.log('Registro insertado correctamente');
        res.send('¡Inscripción exitosa!');
    });
});

// Configurar el puerto del servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor Node.js ejecutándose en http://localhost:${PORT}`);
});
