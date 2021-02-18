/**
 * @file Contains the message embeds used in the 'Free For All' gamemode.
 * @author EmilG <emildegraaf@gmail.com>
 * @see {@link https://github.com/EmilGraaf/quizzer}
 */

const Discord = require('discord.js');


/**
 * @desc Constructs a message embed of the supplied question.
 * @param {Object} item - The question to be embedded.
 * @returns {MessageEmbed} - The resulting embed.
 */
function embedFfa(item) {
	const embed = new Discord.MessageEmbed()
		.setColor('#ffff')
		.setDescription(item.category.title)
		.addField(item.question, '\u200B', true);
	return embed;
}

module.exports.embedFfa = embedFfa;