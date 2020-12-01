const Discord = require('discord.js');

function embedTf(item, player) {
	const embed = new Discord.MessageEmbed()
		.setFooter('❤️'.repeat(player.health), player.client.displayAvatarURL())
		.setColor('#ffff')
		// .setTitle(`Score: ${player.score}`)
		.setDescription(item.category)
		.addField(item.question, '\u200B', true);
	return embed;
}

function embedTfInvite(author, opponent, title) {
	const embed = new Discord.MessageEmbed()
		.setColor('#ffff')
		.addField(`${author.username} wants to play \`${title}\`.`,
			`${opponent}, do you accept the game invite?`);


	return embed;
}

function embedTfCorrect(item, player) {
	const embed = new Discord.MessageEmbed()
		.setFooter('❤️'.repeat(player.health), player.client.displayAvatarURL())
		.setColor('#52AF52')
		// .setTitle(`Score: ${player.score}`)
		.setDescription(item.category)
		.addField(item.question, '\u200B', true);

	return embed;
}

function embedTfIncorrect(item, player) {
	const embed = new Discord.MessageEmbed()
		.setColor('#FE2E2E')
		.setFooter('❤️'.repeat(player.health - 1).concat('💔'), player.client.displayAvatarURL())
		// .setTitle(`Score: ${player.score}`)
		.setDescription(item.category)
		.addField(item.question, '\u200B', true);

	return embed;
}

module.exports.embedTf = embedTf;
module.exports.embedGameInvite = embedTfInvite;
module.exports.embedTfCorrect = embedTfCorrect;
module.exports.embedTfIncorrect = embedTfIncorrect;