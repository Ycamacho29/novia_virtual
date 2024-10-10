const axios = require('axios');
const audio = require('./integracionEleveLabs');

require('dotenv').config();

async function interact(ctx, chatID, request) {
    const response = await axios({
        method: "POST",
        url: `https://general-runtime.voiceflow.com/state/user/${chatID}/interact`,
        headers: {
            Authorization: process.env.VOICEFLOW_API_KEY
        },
        data: {
            request
        }
    });

    for (const trace of response.data) {
        switch (trace.type) {
            case "text":
            case "speak":
                {
                    const numeroAleatorio = () => Math.random() < 0.8 ? 1 : 2;

                    // const numeroAleatorio = 2; // para probrar el audio

                    if (numeroAleatorio == 1) {
                        await ctx.reply(trace.payload.message);
                    } else {
                        const audioBuffer = await audio.convertirTextoAAudio(trace.payload.message); // Generar audio a partir del texto
                        await ctx.replyWithAudio({ source: audioBuffer }); // Enviar el audio
                    }

                    break;
                }
            case "visual":
                {
                    await ctx.replyWithPhoto(trace.payload.image);
                    break;
                }
            case "end":
                {
                    await ctx.reply("La conversacion ha terminado.")
                    break;
                }
        }
    }
};

module.exports.interact = interact;