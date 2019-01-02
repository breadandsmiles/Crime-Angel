const { Client } = require('discord.js');
const yt = require('ytdl-core');
const tokens = require('./tokens.json');
const client = new Client();

let queue = {};

const commands = {
	'play': (msg) => {
		if (queue[msg.guild.id] === undefined) return msg.channel.sendMessage(`thêm bài hát vào danh sách ${tokens.prefix}add`);
		if (!msg.guild.voiceConnection) return commands.join(msg).then(() => commands.play(msg));
		if (queue[msg.guild.id].playing) return msg.channel.sendMessage('đang chơi');
		let dispatcher;
		queue[msg.guild.id].playing = true;

		console.log(queue);
		(function play(song) {
			console.log(song);
			if (song === undefined) return msg.channel.sendMessage('déll gáy nữa (T.T) ').then(() => {
				queue[msg.guild.id].playing = false;
				msg.member.voiceChannel.leave();
			});
			msg.channel.sendMessage(`đang gáy: **${song.title}** theo yêu cầu của: **${song.requester}**`);
			dispatcher = msg.guild.voiceConnection.playStream(yt(song.url, { audioonly: true }), { passes : tokens.passes });
			let collector = msg.channel.createCollector(m => m);
			collector.on('message', m => {
				if (m.content.startsWith(tokens.prefix + 'pause')) {
					msg.channel.sendMessage('tạm dừng').then(() => {dispatcher.pause();});
				} else if (m.content.startsWith(tokens.prefix + 'resume')){
					msg.channel.sendMessage('tiếp tục').then(() => {dispatcher.resume();});
				} else if (m.content.startsWith(tokens.prefix + 'skip')){
					msg.channel.sendMessage('đã bỏ qua').then(() => {dispatcher.end();});
				} else if (m.content.startsWith('volume+')){
					if (Math.round(dispatcher.volume*50) >= 100) return msg.channel.sendMessage(`Volume: ${Math.round(dispatcher.volume*50)}%`);
					dispatcher.setVolume(Math.min((dispatcher.volume*50 + (2*(m.content.split('+').length-1)))/50,2));
					msg.channel.sendMessage(`Volume: ${Math.round(dispatcher.volume*50)}%`);
				} else if (m.content.startsWith('volume-')){
					if (Math.round(dispatcher.volume*50) <= 0) return msg.channel.sendMessage(`Volume: ${Math.round(dispatcher.volume*50)}%`);
					dispatcher.setVolume(Math.max((dispatcher.volume*50 - (2*(m.content.split('-').length-1)))/50,0));
					msg.channel.sendMessage(`Volume: ${Math.round(dispatcher.volume*50)}%`);
				} else if (m.content.startsWith(tokens.prefix + 'time')){
					msg.channel.sendMessage(`time: ${Math.floor(dispatcher.time / 60000)}:${Math.floor((dispatcher.time % 60000)/1000) <10 ? '0'+Math.floor((dispatcher.time % 60000)/1000) : Math.floor((dispatcher.time % 60000)/1000)}`);
				}
			});
			dispatcher.on('end', () => {
				collector.stop();
				play(queue[msg.guild.id].songs.shift());
			});
			dispatcher.on('error', (err) => {
				return msg.channel.sendMessage('error: ' + err).then(() => {
					collector.stop();
					play(queue[msg.guild.id].songs.shift());
				});
			});
		})(queue[msg.guild.id].songs.shift());
	},
	'join': (msg) => {
		return new Promise((resolve, reject) => {
			const voiceChannel = msg.member.voiceChannel;
			if (!voiceChannel || voiceChannel.type !== 'voice') return msg.reply('vào voice chát trước đi giáo sư');
			voiceChannel.join().then(connection => resolve(connection)).catch(err => reject(err));
			msg.reply(" đã chui zo (˵ ͡° ͜ʖ ͡°˵) ")
		});
	},
	'leave': (msg) => {
		return new Promise((resolve, reject) => {
			const voiceChannel = msg.member.voiceChannel;
			voiceChannel.leave().then(disconnect => resolve(disconnect)).catch(err => reject(err));
		});
	},
	'add': (msg) => {
		let url = msg.content.split(' ')[1];
		if (url == '' || url === undefined) return msg.channel.sendMessage(`bạn phải add link video YouTube hoắc ID ${tokens.prefix}add`);
		yt.getInfo(url, (err, info) => {
			if(err) return msg.channel.sendMessage('link YouTube không hợp lệ: ' + err);
			if (!queue.hasOwnProperty(msg.guild.id)) queue[msg.guild.id] = {}, queue[msg.guild.id].playing = false, queue[msg.guild.id].songs = [];
			queue[msg.guild.id].songs.push({url: url, title: info.title, requester: msg.author.username});
			msg.channel.sendMessage(`đã thêm **${info.title}** vào danh sách`);
		});
	},
	'list': (msg) => {
		if (queue[msg.guild.id] === undefined) return msg.channel.sendMessage(`thêm bài hát vào danh sách ${tokens.prefix}add`);
		let tosend = [];
		queue[msg.guild.id].songs.forEach((song, i) => { tosend.push(`${i+1}. ${song.title} - được yêu cầu bởi: ${song.requester}`);});
		msg.channel.sendMessage(`__**${msg.guild.name} danh sách nhạc:**__ hiện tại **${tosend.length}** bài hát ${(tosend.length > 15 ? '*[Only next 15 shown]*' : '')}\n\`\`\`${tosend.slice(0,15).join('\n')}\`\`\``);
	},
	'help': (msg) => {
		let tosend = ['```xl','CHỨC NĂNG VOICE CHÁT', tokens.prefix + 'join : "vào voice chát"',tokens.prefix + 'leave : "ra khỏi voice chát "',	tokens.prefix + 'add : "thêm link YouTube vào danh sách"', tokens.prefix + 'list : "hiển thị danh sách, tối đa 15 bài hát được hiển thị."', tokens.prefix + 'play : "chơi nhạc khi đã vào voice chát"', '', 'CÁC LỆNH KHI ĐANG PHÁT NHẠC:'.toUpperCase(), tokens.prefix + 'pause : "tạm dừng bài hát"',	tokens.prefix + 'resume : "tiếp tục bài hát"', tokens.prefix + 'skip : "bỏ qua bài hát"', tokens.prefix + 'time : "thời gian đang phát bài hát."',	'volume+(+++) : "tăng âm lượng 2%/+"',	'volume-(---) : "Giảm âm lượng 2%/-"',
		'CÁC CHỨC LỆNH KHÁC', tokens.prefix + 'say : "bot nói"', tokens.prefix + 'lenny : "(˵ ͡° ͜ʖ ͡°˵)"','```'];
		msg.channel.sendMessage(tosend.join('\n'));
	},

};

client.on('ready', () => {
	console.log('Tao online rồi');
});

client.on('message', msg => {
	if (!msg.content.startsWith(tokens.prefix)) return;
  if (commands.hasOwnProperty(msg.content.toLowerCase().slice(tokens.prefix.length).split(' ')[0])) commands[msg.content.toLowerCase().slice(tokens.prefix.length).split(' ')[0]](msg);
  
  if(msg.content.startsWith(tokens.prefix + "lenny")){
    msg.delete();
    msg.channel.sendMessage("(˵ ͡° ͜ʖ ͡°˵)");
  }
  let args = msg.content.slice(tokens.prefix.length).trim().split(' ');
  let command = args.shift().toLowerCase();
  if(msg.content.startsWith(tokens.prefix + "say")) {
    let say = args.join(' ');
    msg.delete();
    msg.channel.sendMessage(say);
  };
	if(msg.content.startsWith(tokens.prefix + "kick")) {
		let user = msg.mentions.users.first();
        if (user) {
            let member = msg.guild.member(user);
            if (member) {
                member.kick('Optional reason that will display in the audit logs').then(() =>{
                    msg.reply(`đã cho ${user.tag} ra đảo `);
                }).catch(err =>{
                    msg.reply('em không kick được nó');
                    console.error(err);
                });
            } else {
                msg.reply('thằng này tao không biết!');
            }   
        } else {
            msg.reply('giáo sư chưa chọn người để cho ra đảo!');
        }
	}if(msg.content.startsWith(tokens.prefix + "avatar")) {
		let user = msg.mentions.users.first() || msg.author;
		msg.channel.sendMessage(user.avatarURL)
	}
	
});
client.login(process.env.BOT_TOKEN);
