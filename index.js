const { Client, MessageMedia } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const fs = require("fs");

const sessionFile = "./session.js";

const country_code = "57";
const number = "3144530377";
const mensaje = "holaaaa";

let sessionData;
if (fs.existsSync(sessionData)) {
  sessionData = require(sessionFile);
}
const client = new Client({
  session: sessionData,
});

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("Client ready");
  let chatId = country_code + number + "@c.us";

  client.sendMessage(chatId, mensaje).then((res) => {
    if (res.id.fromMe) {
      console.log("msg sent");
    }
  });
});

client.on("authenticated", (session) => {
  sessionData = session;
  fs.writeFile(sessionFile, JSON.stringify(session), (error) => {
    if (error) {
      console.error(error);
    }
  });
});

client.on("auth_failure", (msg) => {
  console.error("Fallo en la autenticacion", msg);
});

client.on("message", async (msg) => {
  if (msg.body === "hola" || msg.body === "Hola") {
    client.sendMessage(msg.from, "Dime, puedo hacer algo por tí :D?");
  }
  if (msg.body === "!xd") {
    for (let i = 1; i < 250; i++) {
      client.sendMessage(msg.from, "XDD");
    }
  }
  if (msg.hasMedia) {
    const getMedia = await msg.downloadMedia();
    const { data, filename, mimetype } = getMedia;

    const media = new MessageMedia(mimetype, data);
    client.sendMessage(msg.from, media, { sendMediaAsSticker: true });
  }
  if (msg.body === "!comands") {
    const comands = ["hola", "!xd", "carga una imagen"];
    for (let i = 0; i < comands.length; i++) {
      client.sendMessage(msg.from, comands[i]);
    }
  }
});

client.initialize();
