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

// Ruta para manejar la inscripcion
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

//----------------------------------------------------------------------------------
// Endpoint para verificar el DNI y obtener datos del docente si está registrado
app.get('/verificar-docente/:dni', (req, res) => {
    const { dni } = req.params;

    const query = `SELECT nombres, apellidos FROM inscripciones WHERE dni = ?`;
    db.query(query, [dni], (err, result) => {
        if (err) {
            console.error('Error al buscar docente:', err.message);
            return res.status(500).json({ message: 'Error al buscar docente', error: err.message });
        }

        if (result.length === 0) {
            return res.status(404).json({ message: 'Docente no encontrado' });
        }

        const docente = result[0];
        res.status(200).json({
            message: 'Docente encontrado',
            docente: {
                apellidos: docente.apellidos + " " + docente.nombres
            }
        });
    });
});
//----------------------------------------------------------------------------------

//Ruta para la encuesta de satisfaccion
app.post('/submit_asistencia', (req, res) => {

    const {
        dni,
        inicio,
        final,
        contribucion,
        respuesta,
        formador,
        explicaciones,
        interes,
        tiempo,
        objetivos,
        organizacion,
        carga,
        participacion,
        satisfaccion,
        util,
        mejorar
    } = req.body;

    // Crear una nueva entrada en la tabla encuesta_satisfaccion
    const sql = 'INSERT INTO encuesta_satisfaccion (dni,P1_1, P1_2, P1_3, P1_4, P2_1, P2_2, P2_3, P2_4, P3_1, P3_2, P3_3, P3_4, P5, P6, P7) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const values = [
        dni,
        inicio, 
        final,
        contribucion,
        respuesta,
        formador,
        explicaciones,
        interes,
        tiempo,
        objetivos,
        organizacion,
        carga,
        participacion,
        satisfaccion,
        util,
        mejorar
    ];
    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error al insertar datos en la tabla encuesta_satisfaccion:', err);
            res.status(500).json({ error: 'Error al insertar datos en la tabla encuesta_satisfaccion' });
            return;
        }
        res.json({ message: '¡Encuesta de satisfacción enviada correctamente!' });
    });

});

// Configurar el puerto del servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor Node.js ejecutándose en http://localhost:${PORT}`);
});
