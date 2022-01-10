const telegramApi = require('node-telegram-bot-api');
const {gameOptions, againOptions} = require('./options')
const token = 'token must be here';

const bot = new telegramApi(token, {polling: true})

const chats = {}



bot.setMyCommands([
    {command: '/start', description: 'initial greetings'},
    {command: '/info', description: 'get username'},
    {command: '/game', description: 'guess a number'}

])

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, `I will guess a number from 0 to 9, try to guess ;) `);
    await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/19d/e76/19de7699-3e77-317e-ab54-01bca2f2fc16/256/16.webp');
    const randomNumber = Math.floor(Math.random()*10)
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, 'Try!', gameOptions)
}

const start = () => {
    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;
    
    if (text === '/start'){
        await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/19d/e76/19de7699-3e77-317e-ab54-01bca2f2fc16/6.webp')
        return bot.sendMessage(chatId, `Wellcome!`);
    }
    if (text === '/info'){
        return bot.sendMessage(chatId, `Your name is ${msg.from.first_name} ${msg.from.last_name}`);
    }
    if (text === '/game'){
       return  startGame(chatId);
    }
        return bot.sendMessage(chatId, `Don't understand You, try again!`),
        bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/19d/e76/19de7699-3e77-317e-ab54-01bca2f2fc16/8.webp')

    })
    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        if (data === '/again'){
            return  startGame(chatId);
        }
        if (data === chats[chatId]){
            console.log(data);
            return  bot.sendMessage(chatId, `Congratulations! You guessed the number ${chats[chatId]}`, againOptions);
        } else {
            console.log(data);
            return bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/19d/e76/19de7699-3e77-317e-ab54-01bca2f2fc16/8.webp'), 
            bot.sendMessage(chatId, `I'm sorry you didn't guess right number ${chats[chatId]}, try again! `, againOptions)
        }
    })
}
start()
export { start }
