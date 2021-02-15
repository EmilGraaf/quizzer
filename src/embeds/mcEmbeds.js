const Discord = require('discord.js');

const emojiDict = {
	0 : '🇦',
	1 : '🇧',
	2 : '🇨',
	3 : '🇩',
};

function embedMc(item, player) {
	const embed = new Discord.MessageEmbed()
		.setFooter('❤️'.repeat(player.health), player.client.displayAvatarURL())
		.setColor('#ffff')
		// .setTitle(`Score: ${player.score}`)
		.setDescription(item.category)
		.addFields(
			{ name: item.question, value: '\u200B' },
			{ name: `🇦: ${item.shuffled[0]}`, value: '\u200B', inline: true },
			{ name: `🇧: ${item.shuffled[1]}`, value: '\u200B', inline: true },
			{ name: '\u200B', value: '\u200B' },
			{ name: `🇨: ${item.shuffled[2]}`, value: '\u200B', inline: true },
			{ name: `🇩: ${item.shuffled[3]}`, value: '\u200B', inline: true },
		);
	return embed;
}

function embedMcCorrect(item, player) {
	const embed = new Discord.MessageEmbed()
		.setFooter('❤️'.repeat(player.health), player.client.displayAvatarURL())
		.setColor('#52AF52')
		// .setTitle(`Score: ${player.score}`)
		.setDescription(item.category)
		.addField(item.question, '\u200B');
	let i;
	for (i = 0; i < item.shuffled.length; i++) {

		if (item.shuffled[i] == item.correct_answer) {
			embed.addField(`✅: ${item.shuffled[i]}`, '\u200B', true);
		}
		else {
			embed.addField(`${emojiDict[i]}: ${item.shuffled[i]}`, '\u200B', true);
		}
		if (i == 1) {
			embed.addField('\u200B', '\u200B', false);
		}
	}

	return embed;
}

function embedMcIncorrect(item, player, answer) {
	const embed = new Discord.MessageEmbed()
		.setColor('#FE2E2E')
		.setFooter('❤️'.repeat(player.health - 1).concat('💔'), player.client.displayAvatarURL())
		// .setTitle(`Score: ${player.score}`)
		.setDescription(item.category)
		.addField(item.question, '\u200B');
	let i;
	for (i = 0; i < item.shuffled.length; i++) {

		if (item.shuffled[i] == item.correct_answer) {
			embed.addField(`✅: ${item.shuffled[i]}`, '\u200B', true);
		} 
		else if (item.shuffled[i] == answer) {
			embed.addField(`❌: ${item.shuffled[i]}`, '\u200B', true);
		}
		else {
			embed.addField(`${emojiDict[i]}: ${item.shuffled[i]}`, '\u200B', true);
		}
		if (i == 1) {
			embed.addField('\u200B', '\u200B', false);
		}
	}

	return embed;
}

module.exports.embedMc = embedMc;
module.exports.embedMcCorrect = embedMcCorrect;
module.exports.embedMcIncorrect = embedMcIncorrect;