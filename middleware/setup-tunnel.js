require('dotenv').config({ path: '../.env' });
const localtunnel = require('localtunnel');
const axios = require('axios');

const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const PORT = process.env.PORT || 4000;

(async () => {
  try {
    const tunnel = await localtunnel({ port: PORT });
    console.log(`Localtunnel running at: ${tunnel.url}`);

    const webhookUrl = `${tunnel.url}/api/webhook/telegram-webhook`;
    console.log(`Setting Telegram webhook to: ${webhookUrl}`);

    const res = await axios.post(`https://api.telegram.org/bot${TOKEN}/setWebhook`, {
      url: webhookUrl
    });

    if (res.data.ok) {
      console.log('✅ Telegram webhook successfully set!');
    } else {
      console.error('❌ Failed to set webhook:', res.data);
    }

    tunnel.on('close', () => {
      console.log('Tunnels closed');
    });

  } catch (error) {
    console.error('Error starting locatunnel / setting webhook:', error.message);
  }
})();
