# Novia Virtual

Bot de telegram que cumple el rol de una novia virtual cariñosa y empatica.

## Comenzando
### Requisitos

- node.js v20.17.0
- npm v10.8.3
- telegraf v4.16.3
- elevenlabs v0.16.0
- axios v1.7.7
- dotenv v16.4.5
- Tener una cuenta en VoiceFlow
- Tener una cuenta en ElevenLabs

### Instalación

1. Instala [node.js](https://nodejs.org/en)
2. Clona el repositorio:
~~~
   git clone https://github.com/Ycamacho29/bot_novia_virtual.git
~~~
3. En la carpeta del proyecto abre la terminal y ejecuta los siguientes comandos
para instalar todas las dependencias:
~~~
   npm install telegraf@4.16.3
~~~
~~~
   npm install axios@1.7.7
~~~
~~~
   npm install dotenv@16.4.5
~~~
~~~
   npm install elevenlabs@0.16.0
~~~
4. Crea el Bot de Telegram utilizando [BotFather](https://t.me/BotFather)  
5. Crear una cuenta en [VoiceFlow](https://www.voiceflow.com/)
6. Crear una cuenta en [ElevenLabs](https://elevenlabs.io/)
7. En la raiz del proyecto crea una archivo **.env** y coloca los siguientes valores:
~~~
# CONECCION CON BOT DE TELEGRAM
BOT_TOKEN=<TOKEN_DE_TU_BOT_DE_TELEGRAM>

# CONECCION CON AGENTE DE VOICE FLOW
VOICEFLOW_API_KEY=<TU_CLAVE_API_DE_VOICE_FLOW>

# CONECCION CON ELEVEN LABS (CONVERTIR DE TEXTO A VOZ)
ELEVENLABS_API_KEY=<TU_CLAVE_API_DE_ELEVENLABS>
~~~
