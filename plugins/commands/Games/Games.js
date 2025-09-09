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
      { image: "https://i.pinimg.com/originals/f9/47/0e/f9470ea33ff6fbf794b0b8bb00a5ccb4.jpg", answer: "المغرب" },
      { image: "https://i.pinimg.com/originals/2d/a2/6e/2da26e58efd5f32fe2e33b9654907ab5.gif", answer: "الصومال" },
      { image: "https://i.pinimg.com/originals/0e/10/d2/0e10d2240dd28af2eff27ce0fa8b5b8d.jpg", answer: "اليابان" },
      { image: "https://i.pinimg.com/originals/e8/8e/e7/e88ee7f3ba7ff9181aabdd9520bdfa64.jpg", answer: "الجزائر" },
      { image: "https://i.pinimg.com/564x/21/47/ba/2147ba2a3780fb5b9395af5a0eb30deb.jpg", answer: "سوريا" },
      { image: "https://i.pinimg.com/564x/a9/e9/c3/a9e9c3a54aa9fbe2400cc85c8dc45dc3.jpg", answer: "ليبيا" },
      { image: "https://i.pinimg.com/564x/72/d7/d9/72d7d9586177d3cd05adbd0d9f494b20.jpg", answer: "السعودية" },
      // يمكنك إضافة بقية الصور هنا بنفس التنسيق...
    ];

    // اختيار سؤال عشوائي
    const randomQuestion = questions[Math.floor(Math.random() * questions.length)];

    // تحميل الصورة مؤقتاً
    const imageResponse = await axios.get(randomQuestion.image, { responseType: "arraybuffer" });
    fs.writeFileSync(tempImageFilePath, Buffer.from(imageResponse.data, "binary"));

    // إرسال السؤال مع الصورة
    const messageContent = {
      body: langData.ar_SY.question,
      attachment: [fs.createReadStream(tempImageFilePath)]
    };

    const sentMessage = await message.reply(messageContent);

    // حفظ الإجابة الصحيحة مؤقتاً للتأكد من الرد
    global.client.handleReply.push({
      name: config.name,
      messageID: sentMessage.messageID,
      correctAnswer: randomQuestion.answer,
      Currencies,
      langData
    });

  } catch (error) {
    return message.reply(`حدث خطأ: ${error.message}`);
  }
}

/** @type {TOnReply} */
export async function handleReply({ message, handleReply }) {
  try {
    const userAnswer = message.body.trim().toLowerCase();
    const correctAnswer = handleReply.correctAnswer.toLowerCase();

    if (userAnswer === correctAnswer) {
      // زيادة الرصيد
      await handleReply.Currencies.increaseMoney(message.senderID, 50);
      message.reply(handleReply.langData.ar_SY.correct);
    } else {
      message.reply(handleReply.langData.ar_SY.wrong);
    }

    // حذف الصورة المؤقتة
    if (fs.existsSync(tempImageFilePath)) fs.unlinkSync(tempImageFilePath);

  } catch (error) {
    message.reply(`حدث خطأ: ${error.message}`);
  }
}

export default {
  config,
  langData,
  onCall,
  handleReply
};
