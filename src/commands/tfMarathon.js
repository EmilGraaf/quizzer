/**
 * @file Handles functionality for the 'TrueFalse' command, which allows players
 * 	     to compete against eachother in True/False trivia questions.
 * @author EmilG <emildegraaf@gmail.com>
 * @see {@link https://github.com/EmilGraaf/quizzer}
 */

const { prefix } = require('../config.json');
const { TrueFalse } = require('../gamemodes/truefalse');


module.exports = {
	name: 'tf-marathon',
	description: 'Start a round of True/False Marathon',
	aliases: ['tf', 'true-false'],
	args: false,
	usage: '@[User]',
	cooldown: 10,
	guildsOnly: true,
	lockChannel: true,

};

/**
 * @desc This function is called by main to launch the command.
 * @param {Message} message - The original message sent to initiate the command.
 * @param {Array<String>} args - An array containing any supplied arguments to the command.
 * @returns {Promise<(Message|Array<Message>)>} - A message containing a response to the request.
 */
function execute(message, args) {

	const game = new TrueFalse(message.channel, message.author);
	if (!args.length) {
		// If no args are supplied, a singleplayer game is launched
		return game.play();

	}
	else {
		// Exactly one user must be specified
		if ((message.mentions.users).size !== 1) {
			let reply = `Invalid argument(s), ${message.author}!`;
			if (this.usage) {
				reply += `\nThe proper usage would be: \`${prefix}${this.name} ${this.usage}\``;
			}
			return message.channel.send(reply);
		}

		const opponent = message.mentions.users.first();

		if (opponent.id === message.author.id) {
			return message.channel.send(`Invalid argument(s), ${message.author}! You cannot play against yourself.`);
		}
		// Send a game invite and launch the game if accepted

		game.invite(opponent)
			.then(reply => {
				if(reply) {
					return game.play(opponent);
				}
			});


	}
}

module.exports.execute = execute;