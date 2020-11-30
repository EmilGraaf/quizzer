/**
 * @file Handles functionality for the 'TrueFalse' command, which allows players
 * 	     to compete against eachother in True/False trivia questions.
 * @author EmilG <emildegraaf@gmail.com>
 * @see {@link https://github.com/EmilGraaf/quizzer}
 */

const { getQuestions, TrueFalse } = require('../util/questions');
const { embedGameInvite } = require('../util/embeds');
const { prefix } = require('../config.json');
const { Player } = require('../util/player');


module.exports = {
	name: 'trueFalse',
	description: 'Start a round of True/False',
	aliases: ['tf', 'true-false'],
	args: false,
	usage: '@[User]',
	cooldown: 10,
	guildsOnly: true,
	lockChannel: true,
	url: 'https://opentdb.com/api.php?amount=20&type=boolean',
};

/**
 * @desc This function is called by main to launch the command.
 * @param {Message} message - The original message sent to initiate the command.
 * @param {Array<String>} args - An array containing any supplied arguments to the command.
 * @returns {Promise<(Message|Array<Message>)>} - A message containing a response to the request.
 */
function execute(message, args) {

	if (!args.length) {
		// If no args are supplied, a singleplayer game is launched
		getQuestions(this.url)
			.then(questions => {
				const player = new Player(message.author);
				playGame(message.channel, questions, player);
			})
			.catch((e) => {
				console.error(e);
				return message.reply('sorry but I was unable to fetch your questions! Try again in a few moments.');
			});

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
		gameInvite(message, opponent)
			.then(reply => {
				if(reply) {
					getQuestions(this.url)
						.then(questions => {
							const player1 = new Player(message.author);
							const player2 = new Player(opponent);
							playGame(message.channel, questions, player1, player2);
						})
						.catch((e) => {
							console.error(e);
							return message.reply('sorry but I was unable to fetch your questions! Try again in a few moments.');
						});

				}
			});


	}
}

/**
 * @desc Responsible for handling game flow. Uses recursive calls to repeatedly ask questions
 * 		 until a player is out of health.
 * @param {TextChannel} channel - The channel in which the game takes place.
 * @param {Object} questions - The questions fetched from the Open Trivia DB.
 * @param {Player} player1 - The active player which is currently being quizzed.
 * @param {Player} player2 - An optional player for Duo mode.
 * @returns {Promise<(Message|Array<Message>)>} - Sends a message indicating the result of the game.
 */
async function playGame(channel, questions, player1, player2) {

	if (questions.length === 0) {
		try {
			questions = await getQuestions(this.url);
		}
		catch(e) {
			console.error(e);
			return channel.send('sorry but I was unable to fetch your questions! Try again in a few moments.');
		}
	}
	// Submit a question and wait for the user response
	const question = new TrueFalse(questions[0]);
	const response = await question.post(channel, player1, 15000);

	if (response) {
		player1.increaseScore();
		question.setCorrect(player1);
		questions.shift();
		if (player2 === undefined) {
			return playGame(channel, questions, player1);
		}
		// This conditional is used in a tie-breaker
		if (player2.isDead()) {
			return channel.send(`${player2.getName()}, you lost!`);
		}

		return playGame(channel, questions, player2, player1);


	}
	// Remainder of function handles incorrect answers
	player1.takeDamage();
	question.setIncorrect(player1);
	questions.shift();

	if (player2 === undefined) {
		if (player1.isDead()) {
			return channel.send(`Ouch, incorrect! You answered \`${player1.score}\` questions correctly. Your highscore is Y.`);
		}

		return playGame(channel, questions, player1);

	}

	if (player1.isDead()) {
		if (player1.score === player2.score) {
			if (!player2.isDead()) {
				return playGame(channel, questions, player2, player1);
			}
			else {
				return channel.send('The game is a tie!');
			}
		}

		return channel.send(`${player1.getName()}, you lost!`);
	}

	playGame(channel, questions, player2, player1);


}

/**
 * @desc Sends a game invite message and awaits a response.
 * @param {Message} message - The original message sent to initiate the game invite.
 * @param {User} opponent - The user which must respond to the game invite.
 * @returns {Promise<(Boolean)>} - A boolean indicating whether the game invite has been accepted.
 */
async function gameInvite(message, opponent) {

	const filter = (reaction, user) => {
		return ['✅', '❌'].includes(reaction.emoji.name) && user.id === opponent.id;
	};

	const inviteEmbed = embedGameInvite(message.author, opponent);

	const inviteMessage = await message.channel.send(inviteEmbed);
	await inviteMessage.react('✅');
	await inviteMessage.react('❌');

	try {
		const response = await inviteMessage.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] });
		const reaction = response.first();
		if (reaction.emoji.name === '✅') {
			message.channel.send('Accepted game invite');
			return true;
		}
		else {
			return false;
		}
	}
	catch(e) {
		return false;
	}

}


module.exports.execute = execute;