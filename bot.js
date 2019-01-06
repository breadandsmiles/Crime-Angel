const Discord = require('discord.js');
const yt = require('ytdl-core');
const tokens = require('./tokens.json');
const client = new Discord.Client();

let queue = {};

const commands = {
	'play': (message) => {
		if (queue[message.guild.id] === undefined) return message.channel.send(`thêm bài hát vào danh sách ${tokens.prefix}add`);
		if (!message.guild.voiceConnection) return commands.join(message).then(() => commands.play(message));
		if (queue[message.guild.id].playing) return message.channel.send('đang chơi');
		let dispatcher;
		queue[message.guild.id].playing = true;

		console.log(queue);
		(function play(song) {
			console.log(song);
			if (song === undefined) return message.channel.send('danh sách trống').then(() => {
				queue[message.guild.id].playing = false;
				message.member.voiceChannel.leave();
			});
			message.channel.send(`đang nghe: **${song.title}** theo danh sách của: **${song.requester}**`);
			dispatcher = message.guild.voiceConnection.playStream(yt(song.url, { audioonly: true }), { passes : tokens.passes });
			let collector = message.channel.createCollector(m => m);
			collector.on('message', m => {
				if (m.content.startsWith(tokens.prefix + 'pause')) {
					message.channel.send('tạm đừng').then(() => {dispatcher.pause();});
				} else if (m.content.startsWith(tokens.prefix + 'resume')){
					message.channel.send('tiếp tục').then(() => {dispatcher.resume();});
				} else if (m.content.startsWith(tokens.prefix + 'skip')){
					message.channel.send('đã bỏ qua').then(() => {dispatcher.end();});
				} else if (m.content.startsWith('volume+')){
					if (Math.round(dispatcher.volume*50) >= 100) return message.channel.send(`Volume: ${Math.round(dispatcher.volume*50)}%`);
					dispatcher.setVolume(Math.min((dispatcher.volume*50 + (2*(m.content.split('+').length-1)))/50,2));
					message.channel.send(`Volume: ${Math.round(dispatcher.volume*50)}%`);
				} else if (m.content.startsWith('volume-')){
					if (Math.round(dispatcher.volume*50) <= 0) return message.channel.send(`Volume: ${Math.round(dispatcher.volume*50)}%`);
					dispatcher.setVolume(Math.max((dispatcher.volume*50 - (2*(m.content.split('-').length-1)))/50,0));
					message.channel.send(`Volume: ${Math.round(dispatcher.volume*50)}%`);
				} else if (m.content.startsWith(tokens.prefix + 'time')){
					message.channel.send(`time: ${Math.floor(dispatcher.time / 60000)}:${Math.floor((dispatcher.time % 60000)/1000) <10 ? '0'+Math.floor((dispatcher.time % 60000)/1000) : Math.floor((dispatcher.time % 60000)/1000)}`);
				}
			});
			dispatcher.on('end', () => {
				collector.stop();
				play(queue[message.guild.id].songs.shift());
			});
			dispatcher.on('error', (err) => {
				return message.channel.send('error: ' + err).then(() => {
					collector.stop();
					play(queue[message.guild.id].songs.shift());
				});
			});
		})(queue[message.guild.id].songs.shift());
	},
	'join': (message) => {
		return new Promise((resolve, reject) => {
			const voiceChannel = message.member.voiceChannel;
			if (!voiceChannel || voiceChannel.type !== 'voice') return message.reply('vào voice chát trước đi giáo sư');
			voiceChannel.join().then(connection => resolve(connection)).catch(err => reject(err));
			message.reply(" đã chui zo (˵ ͡° ͜ʖ ͡°˵) ")
		});
	},
	'leave': (message) => {
		return new Promise((resolve, reject) => {
			const voiceChannel = message.member.voiceChannel;
			voiceChannel.leave().then(disconnect => resolve(disconnect)).catch(err => reject(err));
		});
	},
	'add': (message) => {
		let url = message.content.split(' ')[1];
		if (url == '' || url === undefined) return message.channel.send(`bạn phải add link video YouTube hoắc ID ${tokens.prefix}add`);
		yt.getInfo(url, (err, info) => {
			if(err) return message.channel.send('link YouTube không hợp lệ: ' + err);
			if (!queue.hasOwnProperty(message.guild.id)) queue[message.guild.id] = {}, queue[message.guild.id].playing = false, queue[message.guild.id].songs = [];
			queue[message.guild.id].songs.push({url: url, title: info.title, requester: message.author.username});
			message.channel.send(`đã thêm **${info.title}** vào danh sách`);
		});
	},
	'list': (message) => {
		if (queue[message.guild.id] === undefined) return message.channel.send(`thêm bài hát vào danh sách ${tokens.prefix}add`);
		let tosend = [];
		queue[message.guild.id].songs.forEach((song, i) => { tosend.push(`${i+1}. ${song.title} - được yêu cầu bởi: ${song.requester}`);});
		message.channel.send(`__**${message.guild.name} danh sách nhạc:**__ hiện tại **${tosend.length}** bài hát ${(tosend.length > 15 ? '*[Only next 15 shown]*' : '')}\n\`\`\`${tosend.slice(0,15).join('\n')}\`\`\``);
	},
	'help': (message) => {
		let tosend = ['```xl','CHỨC NĂNG VOICE CHÁT', tokens.prefix + 'join : "vào voice chát"',tokens.prefix + 'leave : "ra khỏi voice chát "',	tokens.prefix + 'add : "thêm link YouTube vào danh sách"', tokens.prefix + 'list : "hiển thị danh sách, tối đa 15 bài hát được hiển thị."', tokens.prefix + 'play : "chơi nhạc khi đã vào voice chát"', '', 'CÁC LỆNH KHI ĐANG PHÁT NHẠC:'.toUpperCase(), tokens.prefix + 'pause : "tạm dừng bài hát"',	tokens.prefix + 'resume : "tiếp tục bài hát"', tokens.prefix + 'skip : "bỏ qua bài hát"', tokens.prefix + 'time : "thời gian đang phát bài hát."',	'volume+(+++) : "tăng âm lượng 2%/+"',	'volume-(---) : "Giảm âm lượng 2%/-"',
		'CÁC CHỨC LỆNH KHÁC', tokens.prefix + 'say : "bot nói"', tokens.prefix + 'lenny : "(˵ ͡° ͜ʖ ͡°˵)"',tokens.prefix + 'avatar:"xem avatar"',tokens.prefix + 'ping: "xem ping"',	'```'];
		message.channel.send(tosend.join('\n'));
	},
	'reboot': (message) => {
		if (message.author.id == tokens.adminID) process.exit();
	},

};

client.on('ready', () => {
	console.log('Tao online rồi');
	client.user.setStatus('available')
	client.user.setPresence({
		game: {
			name: 'Your Girlfriend',
			type: "PLAYING"
		}
	})
});

client.on('message', message => {
	if (!message.content.startsWith(tokens.prefix)) return;
  if (commands.hasOwnProperty(message.content.toLowerCase().slice(tokens.prefix.length).split(' ')[0])) commands[message.content.toLowerCase().slice(tokens.prefix.length).split(' ')[0]](message);
  
  if(message.content.startsWith(tokens.prefix + "lenny")){
    message.delete();
    message.channel.send("(˵ ͡° ͜ʖ ͡°˵)");
  }
  let args = message.content.slice(tokens.prefix.length).trim().split(' ');
  let command = args.shift().toLowerCase();
  if(message.content.startsWith(tokens.prefix + "say")) {
    let say = args.join(' ');
    message.delete();
    message.channel.send(say);
	};

	if(message.content.startsWith(tokens.prefix + "kick")) {
		let user = message.mentions.users.first();
        if (user) {
            let member = message.guild.member(user);
            if (member) {
                member.kick('Optional reason that will display in the audit logs').then(() =>{
                    message.reply(`đã cho ${user.tag} ra đảo `);
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
	};
	if (message.content.startsWith(tokens.prefix + "avatar")) {
        let user = message.mentions.users.first() || message.author;
        let embed = new Discord.RichEmbed()
        .setAuthor(`${user.tag}`)
        .setImage(user.avatarURL)
        .setColor('RANDOM')
		message.channel.send(embed)
	};
	if(message.content.startsWith(tokens.prefix + "ping")) {
		let tosend = ['```xl','PING đang lag sml:',`${client.ping} ms`,'```'];
		message.channel.send(tosend.join('\n'));
	};
		
});
client.login(process.env.BOT_TOKEN);
