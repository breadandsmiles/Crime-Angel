const Discord = require("discord.js");
const Client = new Discord.Client();
const prefix = "+";


Client.on('ready', ()=>{
    console.log("tao online rồi.");
    Client.user.setGame('(˵ ͡° ͜ʖ ͡°˵)')
})

Client.on('guildMemberAdd', member => {
    let channel = member.guild.channels.find('name', 'welcome-leave');
    let memberavatar = member.user.avatarURL
        if (!channel) return;
        let embed = new Discord.RichEmbed()
        .setColor('RANDOM')
        .setThumbnail(memberavatar)
        .addField(':bust_in_silhouette: | name : ', `${member}`)
        .addField(':microphone2: | Welcome!', `Welcome to the server, ${member}`)
        .addField(':id: | User :', "**[" + `${member.id}` + "]**")
        .addField(':family_mwgb: | Your are the member', `${member.guild.memberCount}`)
        .addField("Name", `<@` + `${member.id}` + `>`, true)
        .addField('Server', `${member.guild.name}`, true )
        .setFooter(`**${member.guild.name}**`)
        .setTimestamp()

        channel.sendEmbed(embed);
});

Client.on('guildMemberAdd', member => {

    console.log(`${member}`, "has joined" + `${member.guild.name}`)

});

Client.on('guildMemberRemove', member => {
    let channel = member.guild.channels.find('name', 'welcome-leave');
    let memberavatar = member.user.avatarURL
        if (!channel) return;
        let embed = new Discord.RichEmbed()
        .setColor('RANDOM')
        .setThumbnail(memberavatar)
        .addField('Name:', `${member}`)
        .addField('Has Let the Server', ';(')
        .addField('Bye Bye :(', 'We will all miss you!')
        .addField('The server now as', `${member.guild.memberCount}` + " members")
        .setFooter(`**${member.guild.name}`)
        .setTimestamp()

        channel.sendEmbed(embed);
});

Client.on('guildMemberRemove', member => {
    console.log(`${member}` + "has left" + `${member.guild.name}` + "Sending leave message now")
    console.log("Leave Message Sent")
});

Client.on('message', (message)=>{
    if(!message.content.startsWith(prefix)) return;

    if(message.content.startsWith(prefix + "lenny")){
        message.delete();
        message.channel.send("(˵ ͡° ͜ʖ ͡°˵)");
    }

    if(message.content.startsWith(prefix + "giup")){
        message.channel.send(" check PM");
        message.author.send(" dùng google để biết thêm thông tin chi tiết ");
    }

    if(message.content.startsWith(prefix + "ping")){
        message.channel.send(`ping đang lag vl: ${Client.ping}ms`);
    }


    
    if (message.content.startsWith(prefix + "avatar")) {
        let user = message.mentions.users.first() || message.author;
        let embed = new Discord.RichEmbed()
        .setAuthor(`${user.tag}`)
        .setImage(user.avatarURL)
        .setColor('RANDOM')
        message.channel.send(embed)
    }
    let args = message.content.slice(prefix.length).trim().split(' ');
    let command = args.shift().toLowerCase();
    if(message.content.startsWith(prefix + "say")) {
        let say = args.join(' ');
        message.delete();
        message.channel.send(say);  
    }
    
    
    if (!message.guild) return;
    if (message.content.startsWith(prefix + "join")){
        if (message.member.voiceChannel){
            message.member.voiceChannel.join()
            .then(connection => {
                message.reply('ok đã vào!');
            })
            .catch(console.log);
        }else {
            message.reply('vào voice chát trước đi giáo sư!');
        }
    }

    if(message.content.startsWith(prefix + "leave")){
        if(message.guild.voiceConnection)
        message.guild.voiceConnection.disconnect()
    }

    if (!message.guild) return;
    if (message.content.startsWith(prefix + "kick")){
        let user = message.mentions.users.first();
        if (user) {
            let member = message.guild.member(user);
            if (member) {
                member.kick('Optional reason that will display in the audit logs').then(() =>{
                    message.reply(`đã cho ${user.tag} ra đảo thành công`);
                }).catch(err =>{
                    message.reply('em không kick được nó');
                    console.error(err);
                });
            } else {
                message.reply('thằng này tao không biết!');
            }   
        } else {
            message.reply('giáo sư chưa chọn người để cho ra đảo!');
        } 


    }

});


Client.login("NTI4MjQyMjEzNjE2ODc3NTk4.Dwfbeg.sv5UTXAcmwVXoeLobGmA7C8tXuo");
