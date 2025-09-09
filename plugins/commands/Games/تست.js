import fs from "fs";
import path from "path";
import axios from "axios";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const tempImageFilePath = path.join(__dirname, "../../cache/testImage.jpg");
const cacheDir = path.dirname(tempImageFilePath);
if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });

const config = {
  name: "تست",
  aliases: ["test"],
  permissions: [0],
  description: "اختبار message.reply مع صورة",
  usage: "",
  cooldown: 0,
  commandCategory: "اختبار"
};

export async function onCall({ message }) {
  try {
    // صورة بسيطة
    const url = "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg";
    const imageResponse = await axios.get(url, { responseType: "arraybuffer" });
    fs.writeFileSync(tempImageFilePath, Buffer.from(imageResponse.data, "binary"));

    const attachment = [fs.createReadStream(tempImageFilePath)];

    await message.reply({
      body: "🔹 هذا اختبار للـ message.reply",
      attachment
    });
  } catch (error) {
    console.error(error);
    await message.reply("❌ فشل الاختبار");
  }
}

export default {
  config,
  onCall
};
