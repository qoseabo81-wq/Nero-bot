import fs from "fs";
import axios from "axios";

const tempImageFilePath = "./cache/tempImage.jpg";

const config = {
  name: "دول",
  aliases: ["اعلام"],
  permissions: [0],
  description: "لعبة احزر العلم",
  usage: "",
  cooldown: 0,
  credits: "عمر",
  commandCategory: "العاب"
};

const langData = {
  ar_SY: {
    correct: "✅ إجابة صحيحة! لقد حصلت على 50 دولار 💵",
    wrong: "❌ إجابة خاطئة، حاول مرة أخرى",
    question: "ما اسم علم هذه الدولة؟"
  }
};

/** @type {TOnCallCommand} */
async function onCall({ message, global, Currencies }) {
  try {
    // تأكد من وجود global.client و handleReply
    if (!global.client) global.client = {};
    if (!global.client.handleReply) global.client.handleReply = [];

    // قائمة كاملة بالأسئلة مع الصور
    const questions = [
      { image: "https://i.pinimg.com/originals/6f/a0/39/6fa0398e640e5545d94106c2c42d2ff8.jpg", answer: "العراق" },
      { image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Flag_of_Brazil.svg/256px-Flag_of_Brazil.svg.png", answer: "البرازيل" },
      { image: "https://i.pinimg.com/originals/66/38/a1/6638a104725f4fc592c1b832644182cc.jpg", answer: "فلسطين" },
      { image: "https://i.pinimg.com/originals/f9/47/0e/f9470ea33ff6fbf794b0b8bb00a5ccb4.jpg", answer: "المغرب" },
      { image: "https://i.pinimg.com/originals/2d/a2/6e/2da26e58efd5f32fe2e33b9654907ab5.gif", answer: "الصومال" }
      // أضف بقية الأسئلة هنا...
    ];

    const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
    const correctAnswer = randomQuestion.answer.toLowerCase();

    // تنزيل الصورة مؤقتًا
    const imageResponse = await axios.get(randomQuestion.image, { responseType: "arraybuffer" });
    fs.writeFileSync(tempImageFilePath, Buffer.from(imageResponse.data, "binary"));

    // إرسال السؤال
    const sentMessage = await message.reply({
      body: langData.ar_SY.question,
      attachment: [fs.createReadStream(tempImageFilePath)]
    });

    // تسجيل handleReply
    global.client.handleReply.push({
      name: config.name,
      messageID: sentMessage.messageID,
      author: message.senderID,
      correctAnswer
    });

    // حذف الصورة بعد الإرسال
    setTimeout(() => {
      if (fs.existsSync(tempImageFilePath)) fs.unlinkSync(tempImageFilePath);
    }, 5000);

  } catch (error) {
    console.error(error);
    message.reply("❌ حدث خطأ، حاول مرة أخرى.");
  }
}

/** @type {TOnReplyCommand} */
async function onReply({ message, handleReply, Currencies, global }) {
  try {
    const userAnswer = message.body.trim().toLowerCase();

    if (userAnswer === handleReply.correctAnswer) {
      await Currencies.increaseMoney(message.senderID, 50);
      message.reply(langData.ar_SY.correct);
    } else {
      message.reply(langData.ar_SY.wrong);
    }

    // إزالة الرسالة من handleReply بعد الرد
    if (global.client && global.client.handleReply) {
      const index = global.client.handleReply.findIndex(
        (x) => x.messageID === handleReply.messageID
      );
      if (index !== -1) global.client.handleReply.splice(index, 1);
    }

  } catch (error) {
    console.error(error);
    message.reply("❌ حدث خطأ أثناء التحقق من الإجابة.");
  }
}

export default {
  config,
  langData,
  onCall,
  onReply
};
