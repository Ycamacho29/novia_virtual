const { ElevenLabsClient } = require('elevenlabs');
require('dotenv').config();

// Función para crear un flujo de audio a partir de texto
const convertirTextoAAudio = async (text) => {
    // Crear una instancia del cliente de ElevenLabs
    const client = new ElevenLabsClient({
        apiKey: process.env.ELEVENLABS_API_KEY,
    });

    const audioStream = await client.generate({
        voice: "Alice",
        model_id: "eleven_turbo_v2_5",
        text,
    });

    const chunks = [];
    for await (const chunk of audioStream) {
        chunks.push(chunk);
    }

    const content = Buffer.concat(chunks);
    return content;
};

module.exports.convertirTextoAAudio = convertirTextoAAudio;