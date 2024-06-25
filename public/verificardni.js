document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById("encuesta_satisfaccion");

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
        fetch("/submit_asistencia", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(result => {
                document.getElementById('modal-message').textContent = result.message;
                var myModal = new bootstrap.Modal(document.getElementById('myModal'));
                myModal.show();
                form.reset();
                // window.location.href = "/";
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Hubo un error al enviar la asistencia.');
            });
    });

    // La función de verificación de DNI sigue igual
    document.getElementById("dni").addEventListener("input", verificarDocente);

    async function verificarDocente() {
        const dni = document.getElementById('dni').value.trim();
        if (!dni) return;

        try {
            const response = await axios.get(`/verificar-docente/${dni}`);
            const { docente } = response.data;

            // Actualizar campos de apellidos si se encontró el docente
            document.getElementById('apellidos').value = docente.apellidos.toUpperCase();

            // Mostrar el formulario de la encuesta
            document.getElementById('dni').setAttribute('readonly', true); // Hacer el campo DNI no editable
            document.getElementById('nombres_apellidos').style.display = 'block';
            document.getElementById('formulario_encuesta').style.display = 'block';
            document.getElementById('button-container').style.display = 'none';
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                console.error('Error al verificar DNI:', error.response.data.message);
                alert('Docente no encontrado o error de conexión');
            } else {
                console.error('Error inesperado al verificar DNI:', error.message);
                alert('Error inesperado al verificar DNI');
            }
        }
    }
});


function redirectToHomePage() {
    window.location.href = "/";
}
