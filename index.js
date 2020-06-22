const Discord = require('discord.js');
const ytdl = require('ytdl-core');
var fs = require('fs');
const bot = new Discord.Client();
bot.commands = new Discord.Collection();
const token = 'NzIwMjU4Mzk1OTkwNTI0MDE2.XuZMvA.cTd5uXYvvkw8gotUX4PEZUXKwXQ';
var PREFIX = 'e!';
const { ErelaClient, Utils } = require("erela.js");
var VERSION = 0.5;
var welcome_channel = 'welcome';
const usedCommandRecently = new Set();
var path = require('path');
var http = require('http');

http.createServer(function (request, response) {

  console.log('request starting for ');
  console.log(request);

  var filePath = '.' + request.url;
  if (filePath == './')
      filePath = './index.html';

  console.log(filePath);
  var extname = path.extname(filePath);
  var contentType = 'text/html';
  switch (extname) {
      case '.js':
          contentType = 'text/javascript';
          break;
      case '.css':
          contentType = 'text/css';
          break;
  }

  fs.exists(filePath, function(exists) {

      if (exists) {
          fs.readFile(filePath, function(error, content) {
              if (error) {
                  response.writeHead(500);
                  response.end();
              }
              else {
                  response.writeHead(200, { 'Content-Type': contentType });
                  response.end(content, 'utf-8');
              }
          });
      }
      else {
          response.writeHead(404);
          response.end();
      }
  });

}).listen(process.env.PORT || 5000);

console.log('Server running at http://127.0.0.1:5000/');


const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
for(const file of commandFiles){
    const command = require(`./commands/${file}`);
    bot.commands.set(command.name, command);
}

const nodes = [{
  host: "localhost",
  port: 2333,
  password: "youshallnotpass",
}]
bot.on('ready', () =>{
    console.log('Bot ready')
    bot.user.setActivity('people ( ͡° ͜ʖ ͡°)', { type: "WATCHING"}).catch(console.error);
})
  

/*bot.music = new ErelaClient(bot, nodes, {"userId": 720258395990524016})
        .on("nodeError", console.log)
        .on("nodeConnect", () => console.log("Successfully created a new Node."))
        .on("queueEnd", player => {
            player.textChannel.send("Queue has ended.")
            return bot.music.players.destroy(player.guild.id)
        })
        .on("trackStart", ({textChannel}, {title, duration}) => textChannel.send(`Now playing: **${title}** \`${Utils.formatTime(duration, true)}\``)
        .then(m => m.delete(15000)));*/


bot.on('message', message=>{
    let args = message.content.substring(PREFIX.length).split(" ");
    switch(args[0])
    {
        case 'setwelcomechannel':
            welcome_channel = message.channel.name
            message.channel.send('Welcome channel set to ' + welcome_channel)
            break;
        case 'help':
            const Embed = new Discord.MessageEmbed()
            .setTitle("Helper Embed")
            .setColor(0xFF0000)
            .setDescription("Make sure to use the e#help to get access to the commands");
            message.author.send(Embed);
            break;
        case 'poll':
            const Embed1 = new Discord.MessageEmbed()
            .setTitle("Initiate Poll")
            .setColor(0xFFC300)
            .setDescription("e!poll to initiate a simple yes or no poll");
            if(!args[1])
            {
              message.channel.send(Embed1);
            }
            let msgArgs = args.slice(1).join(" ");
            message.channel.send("📋 " + "**" + msgArgs + "**").then(messageReaction => {
              messageReaction.react("👍")
              messageReaction.react("👎")
              messageReaction.react("🤷")
              message.delete({ timeout: 1000 }).catch(console.error);
            })
            break;
        case 'mute':
          bot.commands.get('moderation').execute(message, 'mute', args[1], args[2]);
            break;
        case 'food':
          image(message, "delicious spicy food");
          break;
        case 'meme':
          image(message, "reddit dank memes");
          break;
        case 'cursed':
          image(message, "cursed images");
          break;
        case 'img':
          image(message, args[1]);
          break;
        case 'ping':
            bot.commands.get('ping').execute(message, args);
            break;
        case 'setprefix':
            if(args[1] !== undefined)
            {
                PREFIX = args[1]
                message.channel.send('Prefix set to ' + PREFIX)
                break;
            }
            else
            {
                message.channel.send('Invalid argument')
                break;
            }
        case 'resetprefix':
            PREFIX = 'e!'
            message.channel.send('Prefix set to ' + PREFIX)
            break;
        case 'woof':
            const attachment = new Discord.MessageAttachment('https://cdn.discordapp.com/emojis/611539538497503242.png');
            message.channel.send(`${message.author}`, attachment);
            break;
        case 'kick':
          bot.commands.get('moderation').execute(message, 'kick', args[1], args[2]);
          break;
        case 'ban':
          bot.commands.get('moderation').execute(message, 'ban', args[1], args[2]);
            break;
        case 'clear':
            if(!args[1]) return message.reply('Please define the no. of messages to be deleted')
            message.channel.bulkDelete(args[1])
            break;
        case 'myinfo':
            const embed = new Discord.MessageEmbed()
            .setTitle('User Information')
            .addField('Username', message.author.tag, true)
            .addField('Bot Version ', VERSION + '[Beta]', true)
            .addField('Account Created', message.author.createdAt, true)
            .addField('Current Server User In', message.guild.name)
            .setColor(0x000000)
            .setThumbnail(message.author.avatarURL)
            message.channel.send(embed)
            break;
        case 'servinfo':
            const embed_serv = new Discord.MessageEmbed()
            .setTitle('Server Information')
            .addField('Server Name', message.guild.name, true)
            .addField('Members', message.guild.memberCount, true)
            .addField('Server Created', message.guild.createdAt)
            .addField('Bot Version ', VERSION + '[Beta]')
            .setColor(0x000000)
            .setThumbnail(message.guild.avatarURL)
            message.channel.send(embed_serv)
            break;
        case 'cooldown':
            if(usedCommandRecently.has(message.author.id))
            {
              message.reply("You are on cooldown. Wait another 10 seconds.");
            }
            else 
            {
              message.reply("You are not on cooldown");
              
              usedCommandRecently.add(message.author.id);
              setTimeout(() => 
              {
                usedCommandRecently.delete(message.author.id)
              }, 10000)
            }
            break;
        case 'react':
          message.react('🐒');
          break;
        case 'play':
          bot.commands.get('play').execute(message, args);
          break;
        
        case 'skip':
          var server = servers[message.guild.id];
          if(server.dispatcher) server.dispatcher.end();
          message.channel.send('Skipping');
          break;
        case 'stop':
          if(message.guild.connection) message.guild.voice.connection.disconnect();
          break;
    }

    if(message.content === "No u" || message.content === "no u")
    {
        message.channel.send("no u");
    }

    if(message.content === "Hello")
    {
        message.reply("Hello there");
    }

    if(message.content === "monkey")
    {
      message.react('🐒');
    }

    if(message.content === "bruh" || message.content === "Bruh")
    {
        if (message.author.bot) return;
        message.channel.send('bruh');
    }
    if(message.content === "rip" || message.content === "RIP" || message.content === "Rip")
    {
        const attachment = new Discord.MessageAttachment('https://cdn.discordapp.com/emojis/230989718471442432.png');
        message.channel.send(attachment);
    }
    if(message.content === "f" || message.content === "F")
    {
        if (message.author.bot) return;
        message.channel.send('f');
    }
    if(message.content === "Echo Prefix")
    {
        message.reply("Default prefix is " + PREFIX);
    }
    if(message.content === "Show my dp" || message.content === "show my dp")
    {
        const exampleEmbed = new Discord.MessageEmbed().setTitle('Ur dp').setImage(message.author.displayAvatarURL());
        message.channel.send(exampleEmbed);
    }
})

bot.on('guildMemberAdd', member => {
    // Send the message to a designated channel on a server:
    const channel = member.guild.channels.cache.find(ch => ch.name === welcome_channel);
    // Do nothing if the channel wasn't found on this server
    if (!channel) return;
    // Send the message, mentioning the member
    message.channel.send(`Welcome to the server, ${member}`);
  });

function image(message, args){
  bot.commands.get('image').execute(message, args);
  
}


bot.login(token);