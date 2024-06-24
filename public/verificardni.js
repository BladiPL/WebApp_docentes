async function verificarDocente() {
    const dni = document.getElementById('dni').value.trim();
    if (!dni) return;

    try {
        const response = await axios.get(`/verificar-docente/${dni}`);
        const { docente } = response.data;

        // Actualizar campos de apellidos y nombres si se encontró el docente
        document.getElementById('apellidos').value = docente.apellidos.toUpperCase();

        // Mostrar el formulario de la encuesta
        document.getElementById('nombres_apellidos').style.display = 'block';
        document.getElementById('formulario_encuesta').style.display = 'block';
        document.getElementById('button-container').remove();
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
