/**
 * @file Contains the Abstract 'Game' class which is implemented
 *       by several gamemodes.
 * @author EmilG <emildegraaf@gmail.com>
 * @see {@link https://github.com/EmilGraaf/quizzer}
 */

const { embedInvite } = require('../embeds/miscEmbeds');
const { Player } = require('../util/player');

class Game {
	constructor(channel, creator) {
		if (this.constructor == Game) {

			throw new Error('Cannot instantiate an abstract class.');
		}
		this.title = 'Abstract Game Class';
		this.channel = channel;
		this.creator = creator;
		this.questions = [];
	}

	/**
	 * @desc Sends a game invite message and awaits a response.
	 * @param {User} opponent - The user which must respond to the game invite.
	 * @returns {Promise<(Boolean)>} - A boolean indicating whether the game invite has been accepted.
	 */
	async invite(opponent) {
		const timeout = 60000;

		const filter = (reaction, user) => {
			return ['✅', '❌'].includes(reaction.emoji.name) && user.id === opponent.id;
		};

		const inviteEmbed = embedInvite(this.creator, opponent, this.title);

		const inviteMessage = await this.channel.send(inviteEmbed);
		await inviteMessage.react('✅');
		await inviteMessage.react('❌');

		try {
			const response = await inviteMessage.awaitReactions(filter, { max: 1, time: timeout, errors: ['time'] });
			const reaction = response.first();
			if (reaction.emoji.name === '✅') {
				this.channel.send('Accepted game invite');
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

	async postQuestion() {
		throw new Error('Abstract method lacks an implementation.');
	}

	async getQuestions() {
		throw new Error('Abstract method lacks an implementation.');
	}

	/**
	 * @desc Used initially to launch the game.
	 * @param {User} opponent - The optional second player.
	 * @returns {Promise<(Message|Array<Message>)>} - Sends a message indicating the result of the game.
	 */
	play(opponent) {
		const player1 = new Player(this.creator);
		if (opponent === undefined) {
			return this.gameLoop(player1);
		}
		const player2 = new Player(opponent);
		return this.gameLoop(player1, player2);
	}

	/**
 * @desc Responsible for handling game flow. Uses recursive calls to repeatedly ask questions
 * 		 until a player is out of health.
 * @param {Player} player1 - The active player which is currently being quizzed.
 * @param {Player} player2 - An optional player for Duo mode.
 * @returns {Promise<(Message|Array<Message>)>} - Sends a message indicating the result of the game.
 */
	async gameLoop(player1, player2) {

		// Submit a question and wait for the user response
		const response = await this.postQuestion(player1, 15000);

		if (response) {
			player1.increaseScore();

			if (player2 === undefined) {
				return this.gameLoop(player1);
			}
			// This conditional is used in a tie-breaker
			if (player2.isDead()) {
				return this.channel.send(`${player2.getName()}, you lost!`);
			}

			return this.gameLoop(player2, player1);


		}
		// Remainder of function handles incorrect answers
		player1.takeDamage();

		if (player2 === undefined) {
			if (player1.isDead()) {
				return this.channel.send(`Ouch, incorrect! You answered \`${player1.score}\` questions correctly. Your highscore is Y.`);
			}

			return this.gameLoop(player1);

		}

		if (player1.isDead()) {
			if (player1.score === player2.score) {
				if (!player2.isDead()) {
					return this.gameLoop(player2, player1);
				}
				else {
					return this.channel.send('The game is a tie!');
				}
			}

			return this.channel.send(`${player1.getName()}, you lost!`);
		}

		this.gameLoop(player2, player1);


	}
}

module.exports.Game = Game;
