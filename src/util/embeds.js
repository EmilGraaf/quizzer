const Discord = require('discord.js');

// Format True/False question for singleplayer mode
function embedTfSingle(item) {
	const embed = new Discord.MessageEmbed()
		.setColor('#ffff')
		.setDescription(item.category)
		.addField(item.question, item.correct_answer, true);
	return embed;
}

function embedGameInvite(message, opponent) {
	const embed = new Discord.MessageEmbed()
		.setColor('#ffff')
		.addField(`${message.author.username} wants to play \`True/False Marathon\`.`,
			`${opponent}, do you accept the game invite?`);


	return embed;
}

// '\u200B'

module.exports.embedTfSingle = embedTfSingle;
module.exports.embedGameInvite = embedGameInvite;