/**
 * @file Handles functionality for the 'FreeForAll' command, which allows players
 * 	     to compete against eachother in jeopardy-style trivia questions.
 * @author EmilG <emildegraaf@gmail.com>
 * @see {@link https://github.com/EmilGraaf/quizzer}
 */

const { prefix } = require('../config.json');
const { FreeForAll } = require('../gamemodes/freeForAll');


module.exports = {
	name: 'free-for-all',
	description: 'Start a round of Free For All Sprint',
	aliases: ['ffa', 'sprint'],
	args: false,
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

	const game = new FreeForAll(message.channel, message.author);
	if (!args.length) {

		return game.play();

	}

}

module.exports.execute = execute;