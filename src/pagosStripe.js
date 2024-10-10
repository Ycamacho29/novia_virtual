require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_PROVIDER_TOKEN);

class Pago {
    constructor(ctx) {
        this.ctx = ctx;
        this.chatId = ctx.chat.id;
    }

    // Método para recibir pagos
    async procesarPago(minutos) {
        const monto = minutos * 100; // Convertir a centavos (1 dólar = 100 centavos)

        const successMessage = '¡Gracias por tu pago exitoso! Tu pago ha sido procesado correctamente.';
        const cancelMessage = 'Lo sentimos, tu pago no se pudo procesar. Por favor, intenta nuevamente.';

        const successUrl = `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage?chat_id=${this.chatId}&text=${encodeURIComponent(successMessage)}`;
        const cancelUrl = `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage?chat_id=${this.chatId}&text=${encodeURIComponent(cancelMessage)}`;

        try {
            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: [{
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: 'Compra de minutos',
                        },
                        unit_amount: monto, // Precio en centavos
                    },
                    quantity: 1,
                }],
                mode: 'payment',
                success_url: successUrl,
                cancel_url: cancelUrl,
            });

            return session; // Devuelve la URL de la sesión de pago
        } catch (error) {
            console.error('Error al procesar el pago:', error);
            return null; // Manejo de errores
        }
    }

    // Método para validar el pago
    async validarPago(sessionId) {
        try {
            const session = await stripe.checkout.sessions.retrieve(sessionId);

            if (session.payment_status === 'paid') {
                return true; // Pago exitoso
            } else {
                return false; // Pago no procesado
            }
        } catch (error) {
            console.error('Error al validar el pago:', error);
            return false; // Manejo de errores
        }
    }
}

module.exports = Pago;