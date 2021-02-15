const Discord = require('discord.js');

function embedInvite(author, opponent, title) {
	const embed = new Discord.MessageEmbed()
		.setColor('#ffff')
		.addField(`${author.username} wants to play \`${title}\`.`,
			`${opponent}, do you accept the game invite?`);


	return embed;
}

module.exports.embedInvite = embedInvite;