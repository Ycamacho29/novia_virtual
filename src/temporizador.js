class Temporizador {
    constructor() {
        this.tiempoRestante = 0; // Inicializar el tiempo restante
        this.intervalo = null; // Inicializar el intervalo
    }

    // Método para iniciar el temporizador
    iniciar(minutos) {
        // Verificar que el parámetro sea un número entero
        if (typeof minutos !== 'number' || minutos < 0 || !Number.isInteger(minutos)) {
            console.log('Error: Debes ingresar un número entero positivo.');
            throw new Error('Número entero positivo requerido.');
        }

        this.tiempoRestante = minutos * 60; // Convertir minutos a segundos

        if (this.intervalo) {
            console.log('El temporizador ya está en marcha.');
            return;
        }

        this.intervalo = setInterval(() => {
            // Calcular horas, minutos y segundos
            const horas = Math.floor(this.tiempoRestante / 3600);
            const minutosRestantes = Math.floor((this.tiempoRestante % 3600) / 60);
            const segundos = this.tiempoRestante % 60;

            // Formatear el tiempo en hh:mm:ss
            const tiempoFormateado =
                String(horas).padStart(2, '0') + ':' +
                String(minutosRestantes).padStart(2, '0') + ':' +
                String(segundos).padStart(2, '0');

            console.log(tiempoFormateado); // Mostrar el tiempo restante

            // Decrementar el tiempo restante
            this.tiempoRestante--;

            // Verificar si el tiempo ha llegado a 0
            if (this.tiempoRestante < 0) {
                this.detener(); // Detener el temporizador al llegar a 0
                console.log('El temporizador ha terminado.');
            }
        }, 1000); // 1000 ms = 1 segundo
    }

    // Método para detener el temporizador
    detener() {
        if (this.intervalo) {
            clearInterval(this.intervalo);
            this.intervalo = null; // Reiniciar el intervalo
        }
    }

    // Método para verificar si el temporizador sigue activo
    estaActivo() {
        return this.tiempoRestante >= 0 && this.intervalo !== null;
    }

    // Método para obtener el tiempo restante formateado
    tiempoRestanteFormateado() {
        const horas = Math.floor(this.tiempoRestante / 3600);
        const minutosRestantes = Math.floor((this.tiempoRestante % 3600) / 60);
        const segundos = this.tiempoRestante % 60;

        return `${String(horas).padStart(2, '0')}:${String(minutosRestantes).padStart(2, '0')}:${String(segundos).padStart(2, '0')}`;
    }
}

// Exportar la clase
module.exports = Temporizador;