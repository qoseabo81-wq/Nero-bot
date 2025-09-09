import fs from "fs";
import axios from "axios";

const tempImageFilePath = "./cache/tempImage.jpg";

const config = {
  name: "اعلام",
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
async function onCall({ message, Currencies }) {
  try {
    const questions = [
      { image: "https://i.pinimg.com/originals/6f/a0/39/6fa0398e640e5545d94106c2c42d2ff8.jpg", answer: "العراق" },
      { image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Flag_of_Brazil.svg/256px-Flag_of_Brazil.svg.png", answer: "البرازيل" },
      { image: "https://i.pinimg.com/originals/66/38/a1/6638a104725f4fc592c1b832644182cc.jpg", answer: "فلسطين" },
      { image: "https://i.pinimg.com/originals/f9/47/0e/f9470ea33ff6fbf794b0b8bb00a5ccb4.jpg", answer: "المغرب" }
      // أضف باقي الأسئلة هنا
    ];

    const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
    const correctAnswer = randomQuestion.answer;

    // تحميل الصورة مؤقتاً
    const imageResponse = await axios.get(randomQuestion.image, { responseType: "arraybuffer" });
    fs.writeFileSync(tempImageFilePath, Buffer.from(imageResponse.data, "binary"));

    const attachment = [fs.createReadStream(tempImageFilePath)];
    const messageSent = await message.reply({ body: langData.ar_SY.question, attachment });

    // تسجيل handleReply بشكل صحيح
    message.client.handleReply.push({
      name: config.name,
      messageID: messageSent.messageID,
      correctAnswer,
      async onReply({ message: replyMsg, handleReply }) {
        const userAnswer = replyMsg.body.trim().toLowerCase();
        const correct = handleReply.correctAnswer.toLowerCase();

        if (userAnswer === correct) {
          await Currencies.increaseMoney(replyMsg.senderID, 50);
          await replyMsg.reply(langData.ar_SY.correct);
        } else {
          await replyMsg.reply(langData.ar_SY.wrong);
        }

        // مسح الصورة بعد الرد
        if (fs.existsSync(tempImageFilePath)) fs.unlinkSync(tempImageFilePath);
      }
    });

  } catch (error) {
    console.error(error);
    await message.reply(`حدث خطأ: ${error.message}`);
  }
}

export default {
  config,
  langData,
  onCall
};
