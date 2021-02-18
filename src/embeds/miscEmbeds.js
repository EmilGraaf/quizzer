/**
 * @file Contains the message embeds used for miscellaneous messages.
 * @author EmilG <emildegraaf@gmail.com>
 * @see {@link https://github.com/EmilGraaf/quizzer}
 */

const Discord = require('discord.js');

/**
 * @desc Constructs a message embed of a game invite sent
 *       from one user to another.
 * @param {User} author - The sender of the game invite.
 * @param {User} opponent - The receiver of the game invite.
 * @param {String} title - The title of the game.
 * @returns {MessageEmbed} - The resulting embed.
 */
function embedInvite(author, opponent, title) {
	const embed = new Discord.MessageEmbed()
		.setColor('#ffff')
		.addField(`${author.username} wants to play \`${title}\`.`,
			`${opponent}, do you accept the game invite?`);


	return embed;
}

module.exports.embedInvite = embedInvite;