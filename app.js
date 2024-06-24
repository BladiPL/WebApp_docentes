const express = require('express');
const path = require('path');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();

// Middleware para parsear el cuerpo de las solicitudes HTTP
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // Para analizar cuerpos JSON

// Middleware para servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Configurar conexión a la base de datos MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // Cambiar si es necesario
    password: '', // Cambiar si es necesario
    database: 'webapp_docentes' // Nombre de la base de datos
});

// Conectar a la base de datos
db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Conexión a la base de datos MySQL establecida');
});

// Ruta para servir tu formulario HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Ruta para manejar el envío del formulario
app.post('/submit', (req, res) => {
    const { dni, apellidos, nombres, Facultad, escuelaProfesional, programaEstudios, correoInstitucional, celular, contrato, gradoAcademico } = req.body;

    // Ejemplo de cómo podrías insertar los datos en la base de datos
    const sql = 'INSERT INTO inscripciones (dni, apellidos, nombres, facultad, escuela, programa, correo, celular, contrato, grado_ac) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    db.query(sql, [dni, apellidos, nombres, Facultad, escuelaProfesional, programaEstudios, correoInstitucional, celular, contrato, gradoAcademico], (err, result) => {
        if (err) {
            console.error('Error al insertar los datos:', err);
            res.status(500).json({ error: 'Error al insertar los datos' });
            return;
        }
        console.log('Registro insertado correctamente');
        res.json({ message: '¡Inscripción exitosa!' }); // Enviar respuesta JSON
    });
});

// Configurar el puerto del servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor Node.js ejecutándose en http://localhost:${PORT}`);
});
