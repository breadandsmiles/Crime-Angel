const { version } = require('../package.json');
const { embed_color, prefix } = require('../settings.json');
const { formatTime } = require('./util.js');

module.exports = {

    ping: (client, roundtime) => {
        return {
            embed: {
                color: embed_color,
                footer: {
                    text: `Crimebot v${version}`
                },
                fields: [
                    {
                        name: "Latest :heart: ",
                        value: "`" + client.pings[0] + " ms`",
                        inline: true
                    },
                    {
                        name: " Trung Bình :flag_vn: ",
                        value: "`" + Math.round(client.ping) + " ms`",
                        inline: true
                    },
                    {
                        name: "Message :pen_ballpoint: ",
                        value: "`" + roundtime + " ms`",
                        inline: true
                    }
                ]
            }
        }
    },

    playing: instance => {
        const client = instance.client;
        const song = instance.playing;
        const queue = instance.queue;
        const duration = song.duration == 0 ? '∞' : 
            formatTime(song.duration);

        // generate embed
        const embed = {
            embed: {
                title: song.title,
                description: "by *" + song.artist + "*",
                url: song.link,
                color: embed_color,
                footer: {
                    icon_url: song.message.author.avatarURL,
                    text: "Được đề nghị bởi " + song.message.author
                        .username
                },
                thumbnail: {
                    url: song.thumbnail
                },
                author: {
                    name: duration
                },
                fields: []
            }
        };

        const next = queue.peek();
        if (next) {
            embed.embed.fields[0] = {
                name: " tiếp theo",
                value: "*" + next.title + "*\n" + 
                    "by *" + next.artist + "*"
            }
            embed.embed.footer.text += 
                ` • ${queue.size()} item${
                    queue.size() > 1 ? 's' : ''
                } in queue • ${instance.queueTime()} queue time`;
        }
        if (song.flags.indexOf('loop') != -1) embed.embed.author
            .name += ' (đang lặp lại)';
        return embed;
    },

    queued: (instance, song, queue_length) => {
        const queue = instance.queue;
        const playing = instance.playing;
        const dispatcher = instance.dispatcher
            ? instance.dispatcher
            : { time: 0 };
        const remaining = formatTime(playing.duration - 
            (Math.round(dispatcher.time / 1000)));
        
        let duration
        let songs;
        if (Array.isArray(song)) {
            songs = song;
            song = songs[0]
            duration = instance.queueTime(songs);
        }
        else duration = formatTime(song.duration);

        const new_songs = songs ? songs.length : 1;
        const queue_size = queue.size() - new_songs + 1;

        if (queue.peek() === song && queue_length !== '∞') {
            if (playing.duration > 0)
                queue_length = formatTime(Math.round(
                    playing.duration - (dispatcher.time / 1000)));
            else queue_length = '∞';
        }

        if (dispatcher.paused) queue_length += ' (paused)';
        else if (queue_size > 1) queue_length += ` (${queue_size
            } items)`;

        // generate embed
        return embed = {
            embed: {
                title: song.title,
                description: "by *" + song.artist + "*",
                url: song.link,
                color: embed_color,
                footer: {
                    icon_url: playing.message.author.avatarURL,
                    text: `Đang nghe gáy "${playing.title}" 
                        ${queue.peek() !== song
                        ? ` with ${remaining} thời gian còn lại`
                        : ` by ${playing.artist}`}`
                },
                thumbnail: {
                    url: song.thumbnail
                },
                author: {
                    name: `Hàng Chờ ${songs ? `${songs.length} items, including:` : 'mục:'}`
                },
                fields: [
                    {
                        name: "Thời lượng",
                        value: "`" + (song.duration == 0
                            ? "∞"
                            : duration
                        ) + "`",
                        inline: true
                    },
                    {
                        name: "thời gian hàng chờ",
                        value: "`" + queue_length + "`",
                        inline: true
                    }
                ]
            }
        };
    },
    
    remaining: instance => {
        const queue = instance.queue;
        const playing = instance.playing;
        const dispatcher = instance.dispatcher
            ? instance.dispatcher
            : { time: 0 };
        const time_played = formatTime(Math.round(dispatcher.time
            / 1000)) + (dispatcher.paused ? ' (paused)' : '');

        // generate embed
        const embed = {
            embed: {
                title: playing.title,
                description: "by *" + playing.artist + "*",
                url: playing.link,
                color: embed_color,
                footer: {
                    icon_url: playing.message.author.avatarURL,
                    text: 'Được đề nghị bởi ' + playing.message.author
                        .username + ' • không có gì trong danh sách'
                },
                thumbnail: {
                    url: playing.thumbnail
                },
                author: {
                    name: 'Đang gáy:'
                },
                fields: [
                    {
                        name: "Gáy time",
                        value: "`" + time_played + "`",
                        inline: true
                    },
                    {
                        name: "thời gian còn lại",
                        value: "`" + (playing.duration == 0
                            ? "∞"
                            : formatTime(Math.round(playing
                                .duration - dispatcher.time / 1000))
                        ) + "`",
                        inline: true
                    }
                ]
            }
        };

        const next = queue.peek();
        if (next) {
            embed.embed.fields[2] = {
                name: "Tiếp theo",
                value: "*" + next.title + "*\n" +
                    "by *" + next.artist + "*"
            }
            embed.embed.footer.text =
                `Được đề nghị bởi ${playing.message.author.username} • 
                ${queue.size()} mục${queue.size() > 1 ? 's' : ''} 
                trong hàng chờ • ${instance.queueTime()} queue time`;
        }
        return embed;
    },

    help: message => {
        return {
            embed: {
                title: 'Link',
                url: 'https://cdn.discordapp.com/attachments/527900435672072202/533008778040180756/unknown.png',
                color: embed_color,
                author: {
                    name: 'Crimebot!'
                },
                description: 'Sau đây là danh sách tất cả ' +
                    'các lệnh, cách dùng ' +
                    'lệnh.',
                footer: {
                    text: `Sent from #${message.obj.channel.name} 
                        in ${message.obj.guild.name} by Crimebot 
                        v${version}`
                },
                fields: [
                    {
                        name: '`' + prefix + 'help`',
                        value: 'Gửi một bảng gồm tất cả các lệnh có sẵn\n~'
                    },
                    {
                        name: '`' + prefix + 'ping`',
                        value: ' Hiển thị độ chễ ' +
                            'đo lường thời gian message' +

                            '       **lệnh khác:** `latency`, `measure`\n~'
                    },
                    {
                        name: '`' + prefix + 'play <tên hoặc link youtube>`',
                        value: ' chơi nhạc theo yêu cầu. ' +

                            '       **lệnh khác:** `sing`, `gáy`, `p`\n'
                    },
                    {
                        name: '`' + prefix + 'playit`',
                        value: '\n~'
                    },
                    {
                        name: '`' + prefix + 'pause`',
                        value: 'tạm dừng\n\n'
                    },
                    {
                        name: '`' + prefix + 'resume`',
                        value: 'tiếp tục\n\n' +
                            '       **aliases:** `start`, `unpause`, `up`\n'
                    },
                    {
                        name: '`' + prefix + 'skip`',
                        value: 'Bỏ qua bài hát đang gáy\n\n' +

                            '       **lệnh khác:** `next`\n'
                    },
                    {
                        name: '`' + prefix + 'queue`',
                        value: 'thông tin bài hát đang phát và trong hàng chờ\n\n' +

                            '       **lệnh khác:** `playing`, `list`, `remaining`\n'
                    },
                    {
                        name: '`' + prefix + 'replay`',
                        value: 'hát lại bài hát đang phát\n\n' +

                            '       **lệnh khác:** `rp`\n'
                    },
                    {
                        name: '`' + prefix + 'loop`',
                        value: 'lặp lại bài hát hiện đang phát, có thể bỏ qua với `' + prefix + 'skip`\n\n'
                    },
                    {
                        name: '`' + prefix + 'autoplay`',
                        value: 'tự động phát các bài hát tương tự như bài hát hiện đang phát, khi bài hát hiện tại kết thúc\n\n'
                    },
                    {
                        name: '`' + prefix + 'end`',
                        value: 'kết thúc phát nhạc\n\n' +

                            '       **lệnh khác:** `stop`\n'
                    }
                ]
            }
        }
    }
    
}