const { Telegraf } = require('telegraf')
const { message } = require('telegraf/filters')
require('dotenv').config();

const Temporizador = require('./src/temporizador');
const Pago = require("./src/pagosStripe");
const interact = require("./src/integracionVF");
const bd = require('./src/metricas');

const bot = new Telegraf(process.env.BOT_TOKEN)

let temporizadores = {}; // Objeto para almacenar temporizadores por usuario
// let temporizador = new Temporizador(); // Crear una nueva instancia del temporizador
let pago;

bot.start(async (ctx) => {
    temporizadores[ctx.chat.id] = new Temporizador(); // Crear una nueva instancia del temporizador
    await ctx.reply('¡Hola! 😊 Bienvenido amor, aquí tienes los comandos que puedes ejecutar:', {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'Comprar minutos', callback_data: 'comprar' },
                    { text: 'Ver minutos restantes', callback_data: 'ver_minutos' }
                ],
                [
                    { text: 'Ayuda', callback_data: 'ayuda' }
                ]
            ]
        }
    });

    // Para probar el chat bot sin pasar por el pago
    // temporizador = new Temporizador(); // Crear una nueva instancia del temporizador
    // temporizador.iniciar(3); // Iniciar el temporizador con 3 minutos
});

bot.on('callback_query', async (ctx) => {
    const callbackData = ctx.callbackQuery.data;

    switch (callbackData) {
        case 'comprar':
            ctx.reply('¿Cuántos minutos deseas comprar?🛒');
            break;
        case 'ver_minutos':
            if (temporizadores[ctx.chat.id].estaActivo()) {
                await ctx.reply(temporizadores[ctx.chat.id].tiempoRestanteFormateado());
            } else {
                await ctx.reply('Aun no has comprado minutos de conversacion.');
            }
            break;
        case 'ayuda':
            await ctx.reply('Aquí tienes la ayuda que necesitas: ...');
            break;
        default:
            break;
    }
});

// Escuchar la respuesta del usuario
bot.on('text', async (ctx) => {
    if (temporizadores[ctx.chat.id].estaActivo()) {
        if (temporizadores && temporizadores[ctx.chat.id].estaActivo()) { // Solo procesar si el temporizadores está activo
            let chatID = ctx.message.chat.id;
            await interact.interact(ctx, chatID, {
                type: "text",
                payload: ctx.message.text
            });
        } else {
            await ctx.reply("El temporizador ha terminado. No se pueden procesar más mensajes.");
        }
    } else {
        pago = new Pago(ctx);

        const minutos = parseInt(ctx.message.text);

        const resp = {};

        if (!isNaN(minutos) && minutos > 0) {
            // Llama a la función de procesarPago y espera la respuesta
            const resp = await pago.procesarPago(minutos);
            if (resp.url) {
                // Enviar un mensaje con un botón inline
                await ctx.reply('Haz clic en el botón para pagar tus minutos:', {
                    reply_markup: {
                        inline_keyboard: [
                            [
                                { text: 'Pagar', url: resp.url } // Botón que redirige a la URL de pago
                            ]
                        ]
                    }
                });
            } else {
                await ctx.reply('Ocurrió un error al procesar el pago. Intenta nuevamente.');
            }
        } else {
            await ctx.reply('Por favor, ingresa un número válido de minutos.');
        }

        /*
        Este bloque de codigo tengo que pensar en donde colocarlo
        por que aqui no se puedo verificar bien el pago por que 
        el objeto despues de que el usuario paga en la pagina
        stipe ya no tiene el id
        */
        if (pago.validarPago(resp.id)) {
            // Iniciar el temporizador con los minutos comprados
            console.log(resp.id);
            temporizadores[ctx.chat.id].iniciar(minutos); // Iniciar el temporizador con los minutos comprados
        } else {
            await ctx.reply('Error al Validar el pago.');
        }
    }
});

bot.launch(); // start

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))

// bd.pruebaConeccion();


