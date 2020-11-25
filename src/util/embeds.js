const Discord = require('discord.js');

// Format True/False question for singleplayer mode
function embedTfSingle(item) {
	const embed = new Discord.MessageEmbed()
		.setColor('#ffff')
		.setDescription(item.category)
		.addField(item.question, item.correct_answer, true);
	return embed;
}

// '\u200B'

module.exports.embedTfSingle = embedTfSingle;