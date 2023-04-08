const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const client = new Client({
    puppeteer: {
        args: ['--no-sandbox'],
    },
    authStrategy: new LocalAuth()
});

client.on('qr', (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
  console.log('Client is ready!');
});

client.on('message', async (message) => {
  if (message.body === '!check 1') {
    const serverUrl = process.env.SERVER_1;
    const monitorUrl = `http://${serverUrl}/monitor.php`;
    const response = await axios.get(monitorUrl);
    const data = response.data;
    const reply = `CPU USAGE = ${(data.cpuUsage * 100.0).toFixed(0)}%\nUp time = ${data.uptime}\nram usage = ${data.ramUsage}`;
    message.reply(reply);
  }

  if (message.body === '!check 2') {
    const serverUrl = process.env.SERVER_2;
    const monitorUrl = `http://${serverUrl}/monitor.php`;
    const response = await axios.get(monitorUrl);
    const data = response.data;
    const reply = `CPU USAGE = ${(data.cpuUsage * 100.0).toFixed(0)}%\nUp time = ${data.uptime}\nram usage = ${data.ramUsage}`;
    message.reply(reply);
  }
  if (message.body === '!forta-server1') {
    const serverUrl = process.env.SERVER_1;
    const fortaUrl = `http://${serverUrl}/nit.php`;
    const response = await axios.get(fortaUrl);
    let reply = `Ip = ${serverUrl}\n`;
    const statusList = response.data.split('\n');
    for (const status of statusList) {
        reply += `${status.trim()}\n`;
    }
    message.reply(reply);
}
   if (message.body === '!forta-server2') {
    const serverUrl = process.env.SERVER_2;
    const fortaUrl = `http://${serverUrl}/nit.php`;
    const response = await axios.get(fortaUrl);
    let reply = '';
    const statusList = response.data.split('\n');
    for (const status of statusList) {
        reply += `${status.trim()}\n`;
    }
    message.reply(reply);
}
if (message.body === '!forta-sla') {
    try {
        const scannerAddress = process.env.WALLET_1;
        const scannerAddress2 = process.env.WALLET_2;
        const network = process.env.NETWORK_WALLET_1;
        const network2 = process.env.NETWORK_WALLET_2;
        const slaUrl = `https://api.forta.network/stats/sla/scanner/${scannerAddress}`;
        const slaUrl2 = `https://api.forta.network/stats/sla/scanner/${scannerAddress2}`;
        const response = await axios.get(slaUrl);
        const response2 = await axios.get(slaUrl2);
        const data = response.data;
        const data2 = response2.data;
  
    // Determine score emoji based on lowest score
    const score1 = data.lowestScores[0].score;
    const score2 = data2.lowestScores[0].score;
    const scoreEmoji1 = score1 < 0.7 ? '🔴' : '🟢';
    const scoreEmoji2 = score2 < 0.7 ? '🔴' : '🟢';
  
     // Generate reply string
     const reply = `Scanner ID = ${scannerAddress}\n` +
     `Network = ${network}\n` +
     `SLA = ${scoreEmoji1}${score1}\n`+
     `Statistik = min: ${data.statistics.min}, max: ${data.statistics.max}, p50: ${data.statistics.p50}, avg: ${data.statistics.avg}\n\n` +
     `Scanner ID = ${scannerAddress2}\n` +
     `Network = ${network2}\n` +
     `SLA = ${scoreEmoji2}${score2}\n` +
     `Statistik = min: ${data2.statistics.min}, max: ${data2.statistics.max}, p50: ${data2.statistics.p50}, avg: ${data2.statistics.avg}\n`;

   message.reply(reply);
 } catch (error) {
   console.error(error);
   message.reply('Terjadi kesalahan saat memproses permintaan Anda');
 }
}

});

client.initialize();

const sendSLAData = async () => {
    try {
      const scannerAddress = process.env.WALLET_1;
      const scannerAddress2 = process.env.WALLET_2;
      const network = process.env.NETWORK_WALLET_1;
      const network2 = process.env.NETWORK_WALLET_2;
      const slaUrl = `https://api.forta.network/stats/sla/scanner/${scannerAddress}`;
      const slaUrl2 = `https://api.forta.network/stats/sla/scanner/${scannerAddress2}`;
      const response = await axios.get(slaUrl);
      const response2 = await axios.get(slaUrl2);
      const data = response.data;
      const data2 = response2.data;
  
      // Determine score emoji based on lowest score
      const score1 = data.lowestScores[0].score;
      const score2 = data2.lowestScores[0].score;
      const scoreEmoji1 = score1 < 0.7 ? '🔴' : '🟢';
      const scoreEmoji2 = score2 < 0.7 ? '🔴' : '🟢';
  
      // Generate reply string
      const reply = `Scanner ID = ${scannerAddress}\n` +
        `Network = ${network}\n` +
        `SLA = ${scoreEmoji1}${score1}\n`+
        `Statistik = min: ${data.statistics.min}, max: ${data.statistics.max}, p50: ${data.statistics.p50}, avg: ${data.statistics.avg}\n\n` +
        `Scanner ID = ${scannerAddress2}\n` +
        `Network = ${network2}\n` +
        `SLA = ${scoreEmoji2}${score2}\n` +
        `Statistik = min: ${data2.statistics.min}, max: ${data2.statistics.max}, p50: ${data2.statistics.p50}, avg: ${data2.statistics.avg}\n`;
  
      // Send the reply to the user
      const chat = await client.getChatById(process.env.YOUR_NUMBER + '@c.us');
      chat.sendMessage(reply);


    const interval = 2 * 60 * 60 * 1000;
    const remainingTime = interval - (new Date().getTime() % interval);
    console.log(`Next SLA data check in ${Math.floor(remainingTime / (60 * 1000))} minutes`);
    } catch (error) {
      console.error(error);
    }
  };
  const SendServerData = async () => {
    try {
        const serverUrl = process.env.SERVER_1;
        const serverUrl2 =process.env.SERVER_2;
        const monitorUrl = `http://${serverUrl}/monitor.php`;
        const monitorUrl2 = `http://${serverUrl2}/monitor.php`;
        const response = await axios.get(monitorUrl);
        const response2 = await axios.get(monitorUrl2);
        const data = response.data;
        const data2 = response2.data;
        const reply = `Ip = ${serverUrl} \nCPU USAGE = ${(data.cpuUsage * 100.0).toFixed(0)}%\nUp time = ${data.uptime}\nram usage = ${data.ramUsage}\n\nIp = ${serverUrl2} \nCPU USAGE = ${(data2.cpuUsage * 100.0).toFixed(0)}%\nUp time = ${data2.uptime}\nram usage = ${data2.ramUsage}\n\n`;

      // Send the reply to the user
      const chat = await client.getChatById(process.env.YOUR_NUMBER + '@c.us');
      chat.sendMessage(reply);

    const interval = 2 * 60 * 60 * 1000;
    const remainingTime = interval - (new Date().getTime() % interval);
    console.log(`Next Server data check in ${Math.floor(remainingTime / (60 * 1000))} minutes`);
    } catch (error) {
      console.error(error);
    }
  };
  const SendFortaStatus1 = async () => {
    try {
        const serverUrl = process.env.SERVER_1;
        const network = process.env.NETWORK_WALLET_1;
        const fortaUrl = `http://${serverUrl}/nit.php`;
        const response = await axios.get(fortaUrl);
        let reply = `Ip : ${serverUrl}\nNetwork : ${network}\n`;
        const statusList = response.data.split('\n');
        for (const status of statusList) {
            reply += `${status.trim()}\n`;
        }
      // Send the reply to the user
      const chat = await client.getChatById(process.env.YOUR_NUMBER + '@c.us');
      chat.sendMessage(reply);
      const interval = 2 * 60 * 60 * 1000;
    const remainingTime = interval - (new Date().getTime() % interval);
    console.log(`Next Forta Status check in ${Math.floor(remainingTime / (60 * 1000))} minutes`);
    } catch (error) {
      console.error(error);
    }
  };
  const SendFortaStatus2 = async () => {
    try {
        const serverUrl = process.env.SERVER_2;
        const network = process.env.NETWORK_WALLET_2;
        const fortaUrl = `http://${serverUrl}/nit.php`;
        const response = await axios.get(fortaUrl);
        let reply = `Ip : ${serverUrl}\nNetwork : ${network}\n`;
        const statusList = response.data.split('\n');
        for (const status of statusList) {
            reply += `${status.trim()}\n`;
        }
      // Send the reply to the user
      const chat = await client.getChatById(process.env.YOUR_NUMBER + '@c.us');
      chat.sendMessage(reply);
    } catch (error) {
      console.error(error);
    }
  };
  // Send the SLA data every 2 hours
  setInterval(SendServerData, 2 * 60 * 60 * 1000);
  setInterval(SendFortaStatus1, 2 * 60 * 60 * 1000);
  setInterval(SendFortaStatus2, 2 * 60 * 60 * 1000);
  setInterval(sendSLAData, 2 * 60 * 60 * 1000);
  
  const interval = 2 * 60 * 60 * 1000;
  let remainingTime = interval - (new Date().getTime() % interval);
  
  const countdown = setInterval(() => {
    remainingTime -= 1000;
    if (remainingTime < 0) {
      clearInterval(countdown);
      console.log("Data Auto check is now running");
    } else {
      const seconds = Math.floor((remainingTime / 1000) % 60);
      const minutes = Math.floor((remainingTime / (1000 * 60)) % 60);
      const hours = Math.floor(remainingTime / (1000 * 60 * 60));
     // console.log(`Next Data Auto check in ${hours} hours ${minutes} minutes ${seconds} seconds`);
    }
  }, 1000);
  
