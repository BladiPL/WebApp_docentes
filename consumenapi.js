/*var boton = document.getElementById("boton");

function traer(){
    var dni = document.getElementById("dni").value;
    fetch ("http://127.0.0.1:8000/docentes/dni="+dni
    )

    .then((res) => res.json())
    .then((data) => {

        console.log(data);

        document.getElementById("doc").value = data.dni;
        document.getElementById("nombre").value = data.nombre;
        document.getElementById("apellido").value = data.ap_paterno + " " + data.ap_materno;
    });
}

boton.addEventListener("input",traer);*/

// Escuchar cambios en el campo de DNI
// Escuchar el evento submit del formulario
document.getElementById("registrationForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevenir el envío del formulario por defecto
});

// Escuchar cambios en el campo de DNI
document.getElementById("dni").addEventListener("input", traer);

function traer(){
    var dni = document.getElementById("dni").value;

    // Verificar que el DNI tenga una longitud válida para evitar solicitudes innecesarias
    if (dni.length === 8) {
        fetch("http://127.0.0.1:8000/docentes/dni=" + dni)
            .then((res) => res.json())
            .then((data) => {
                console.log(data); // Mostrar datos recibidos en la consola

                // Asignar valores a los campos del formulario
                document.getElementById("apellidos").value = data.ap_paterno + " " +data.ap_materno;
                document.getElementById("nombres").value = data.nombre;
                document.getElementById("Facultad").value = data.Facultad;
                document.getElementById("escuelaProfesional").value = data.escuela;
                document.getElementById("programaEstudios").value = data.programa;
                document.getElementById("correoInstitucional").value = data.correo;
                document.getElementById("celular").value = data.celular;
            })
            .catch((error) => {
                console.error('Error:', error);
                // Mostrar mensaje de error en caso de que falle la solicitud
                alert('No se pudo obtener la información del docente.');
            });
    } else {
        // Limpiar los campos si el DNI no tiene una longitud válida
        document.getElementById("apellidos").value = -"";
        document.getElementById("nombres").value = "";
        document.getElementById("Facultad").value = "";
        document.getElementById("escuelaProfesional").value = "";
        document.getElementById("programaEstudios").value = "";
        document.getElementById("correoInstitucional").value = "";
        document.getElementById("celular").value = "";
    }
}
