document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById("registrationForm");

    form.addEventListener("submit", function (event) {
        event.preventDefault(); // Prevenir el envío del formulario por defecto

        // Recoger los datos del formulario
        const formData = new FormData(form);

        // Convertir FormData a objeto para enviar como JSON
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });

        // Enviar los datos del formulario a través de fetch
        fetch("/submit", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(result => {
                console.log('Success:', result);
                document.getElementById('modal-message').textContent = result.message;
                var myModal = new bootstrap.Modal(document.getElementById('myModal'));
                myModal.show();
                form.reset();
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Hubo un error en la inscripción.');
            });
    });

    // Escuchar cambios en el campo de DNI
    document.getElementById("dni").addEventListener("input", traer);

    async function traer() {
        var dni = document.getElementById("dni").value;

        // Verificar que el DNI tenga una longitud válida para evitar solicitudes innecesarias
        if (dni.length === 8) {
            try {
                // Primero verificamos si el DNI está registrado en nuestra base de datos localmente
                const responseVerificar = await fetch(`/verificar-docente/${dni}`);
                if (responseVerificar.ok) {
                    // Si está registrado, mostramos un modal indicando que ya está inscrito
                    $('#inscritoModal').modal('show');
                    return; // Terminamos aquí si el DNI está registrado
                }

                // Si no está registrado localmente, consultamos a la API principal
                const response = await fetch(`http://127.0.0.1:8000/docentes/dni=${dni}`);
                if (!response.ok) {
                    throw new Error('Docente no encontrado');
                }
                const data = await response.json();

                // Verificar si la respuesta indica que el docente no fue encontrado
                if (data.detail && data.detail === 'Docente no encontrado') {
                    // Mostrar modal de error si el docente no está registrado
                    $('#errorModal').modal('show');
                } else {
                    // Asignar valores a los campos del formulario
                    document.getElementById("apellidos").value = data.ap_paterno + " " + data.ap_materno;
                    document.getElementById("nombres").value = data.nombre;
                    document.getElementById("Facultad").value = data.Facultad;
                    document.getElementById("escuelaProfesional").value = data.escuela;
                    document.getElementById("programaEstudios").value = data.programa;
                    document.getElementById("correoInstitucional").value = data.correo;
                    document.getElementById("celular").value = data.celular;
                }
            } catch (error) {
                // Mostrar mensaje de error en caso de que falle la solicitud
                console.error('Error:', error);
                $('#errorModal').modal('show'); // Mostrar modal de error general
            }
        } else {
            // Limpiar los campos si el DNI no tiene una longitud válida
            document.getElementById("apellidos").value = "";
            document.getElementById("nombres").value = "";
            document.getElementById("Facultad").value = "";
            document.getElementById("escuelaProfesional").value = "";
            document.getElementById("programaEstudios").value = "";
            document.getElementById("correoInstitucional").value = "";
            document.getElementById("celular").value = "";
        }
    }
});

function redirectToHomePage() {
    window.location.href = "/";
}
