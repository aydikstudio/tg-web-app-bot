const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const cors = require('cors');


const token = '6408700839:AAHJuhqvB8zngYg7Uj4c9lr3HeT6PPTmo_4';



const bot = new TelegramBot(token, {polling: true});
const site = "https://master--lighthearted-pixie-45fb66.netlify.app";
const app = express();

app.use(express.json())
app.use(cors())


bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if(text === '/start') {
    await bot.sendMessage(chatId, 'Bellow show buttons, full form', {
        reply_markup: {
            keyboard:[
                [{
                    text: 'full from',
                    web_app: {url: site+'/form'}
                }]
            ]
        }
    });

    // await bot.sendMessage(chatId, 'shop', {
    //     reply_markup: {
    //         inline_keyboard:[
    //             [{
    //                 text: 'Make order',
    //                 web_app: {url: site}
    //             }]
    //         ]
    //     }
    // });
  }

  if(msg?.web_app_data?.data) {
    try {
        const data = JSON.parse(msg?.web_app_data?.data)
  
        await bot.sendMessage(chatId, 'Спасибо за обратную связь!')
        await bot.sendMessage(chatId, 'Ваша страна: ' + data?.country);
        await bot.sendMessage(chatId, 'Ваша улица: ' + data?.street);

        setTimeout(async () => {
            await bot.sendMessage(chatId, 'Всю информацию вы получите в этом чате');
        }, 3000)
    } catch (e) {
        console.log(e);
    }
}
});

app.post('/web-data', async (req, res) => {
    console.log("WWWWeee")
    const {queryId, products, totalPrice} = req.body;
    try {
        await bot.answerWebAppQuery(queryId, {
            type: 'article',
            id: queryId,
            title: "Success buy",
            input_message_content: {message_text: 'Yeeee buy good' + totalPrice}
        })
        return res.status(200).json({})
    } catch(e) {
        await bot.answerWebAppQuery(queryId, {
            type: 'article',
            id: queryId,
            title: "NoSuccess buy",
            input_message_content: {message_text: 'NoSuccess buy' }
        })

        return res.status(500).json({})
    }
    
})

const PORT = 8000;

app.listen(PORT, () => console.log('server started'))