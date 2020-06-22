const Discord = require('discord.js');
const bot = new Discord.Client();
const ms = require('ms');
module.exports = {
    name: 'moderation',
    description: "moderation commands!",
    execute(message, args, name, time){
            switch(args)
            {
                case 'mute':
                    if (!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send("Only Admins can do that.")
                    var person  = message.guild.member(message.mentions.users.first() || message.guild.members.cache.get(name));
                    if(!person) return  message.reply("I CANT FIND THE USER " + person)
                    let mainrole = message.guild.roles.cache.find(role => role.name === "Newbie");
                    let role = message.guild.roles.cache.find(role => role.name === "Muted");
                    if(!role) return message.reply("Couldn't find the mute role.")
                    
                    if(!time){
                        return message.reply("You didnt specify a time!");
                    }
                    person.roles.remove(mainrole.id)
                    person.roles.add(role.id);
                    message.channel.send(`@${person.user.tag} has now been muted for ${ms(ms(time))}`)
                    setTimeout(function(){  
                        person.roles.add(mainrole.id)
                        person.roles.remove(role.id);
                        console.log(role.id)
                        message.channel.send(`@${person.user.tag} has been unmuted.`)
                    }, ms(time));
                  break;
                case 'ban':
                    if (!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send("Only Admins can do that.")
                    //.then(msg => msg.delete(5000));
                    var user = message.mentions.users.first();
                    // If we have a user mentioned
                    if (user) {
                      // Now we get the member from the user
                      const member = message.guild.member(user);
                      // If the member is in the guild
                      if (member) {
                        member
                          .ban({
                            reason: 'They were bad!',
                          })
                          .then(() => {
                            // We let the message author know we were able to ban the person
                            message.reply(`Successfully banned ${user.tag}`);
                          })
                          .catch(err => {
                            // An error happened
                            // This is generally due to the bot not being able to ban the member,
                            // either due to missing permissions or role hierarchy
                            message.reply('I was unable to ban the member');
                            // Log the error
                            console.error(err);
                          });
                      } else {
                        // The mentioned user isn't in this guild
                        message.reply("That user isn't in this guild!");
                      }
                    } else {
                      // Otherwise, if no user was mentioned
                      message.reply("You didn't mention the user to ban!");
                    }
                  break;
                case 'kick':
                    if (!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send("Only Admins can do that.")
                    //.then(msg => msg.delete(5000));
                    var user = message.mentions.users.first();
                    // If we have a user mentioned
                    if (user) {
                      // Now we get the member from the user
                      const member = message.guild.member(user);
                      // If the member is in the guild
                      if (member) {
                        member
                          .kick({
                            reason: 'They were bad!',
                          })
                          .then(() => {
                            // We let the message author know we were able to ban the person
                            message.reply(`Successfully kicked ${user.tag}`);
                          })
                          .catch(err => {
                            // An error happened
                            // This is generally due to the bot not being able to ban the member,
                            // either due to missing permissions or role hierarchy
                            message.reply('I was unable to kick the member');
                            // Log the error
                            console.error(err);
                          });
                      } else {
                        // The mentioned user isn't in this guild
                        message.reply("That user isn't in this guild!");
                      }
                    } else {
                      // Otherwise, if no user was mentioned
                      message.reply("You didn't mention the user to kick!");
                    }
                  break;
            }
    
}
}