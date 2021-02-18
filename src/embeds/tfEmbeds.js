/**
 * @file Contains the message embeds used in the 'True False' gamemode.
 * @author EmilG <emildegraaf@gmail.com>
 * @see {@link https://github.com/EmilGraaf/quizzer}
 */

const Discord = require('discord.js');

/**
 * @desc Constructs a message embed of the supplied question.
 * @param {Object} item - The question to be embedded.
 * @param {Player} player - The user who must answer the question.
 * @returns {MessageEmbed} - The resulting embed.
 */
function embedTf(item, player) {
	const embed = new Discord.MessageEmbed()
		.setFooter('❤️'.repeat(player.health), player.client.displayAvatarURL())
		.setColor('#ffff')
		// .setTitle(`Score: ${player.score}`)
		.setDescription(item.category)
		.addField(item.question, '\u200B', true);
	return embed;
}

/**
 * @desc Constructs a message embed of a question which has been
 *       answered correctly.
 * @param {Object} item - The question to be embedded.
 * @param {Player} player - The user who answered the question.
 * @returns {MessageEmbed} - The resulting embed.
 */
function embedTfCorrect(item, player) {
	const embed = new Discord.MessageEmbed()
		.setFooter('❤️'.repeat(player.health), player.client.displayAvatarURL())
		.setColor('#52AF52')
		// .setTitle(`Score: ${player.score}`)
		.setDescription(item.category)
		.addField(item.question, '\u200B', true);

	return embed;
}

/**
 * @desc Constructs a message embed of a question which has been
 *       answered incorrectly.
 * @param {Object} item - The question to be embedded.
 * @param {Player} player - The user who answered the question.
 * @returns {MessageEmbed} - The resulting embed.
 */
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
module.exports.embedTfCorrect = embedTfCorrect;
module.exports.embedTfIncorrect = embedTfIncorrect;