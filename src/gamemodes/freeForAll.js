/**
 * @file Contains the FreeForAll class which handles functionality
 *       for the 'Free For All' gamemode.
 * @author EmilG <emildegraaf@gmail.com>
 * @see {@link https://github.com/EmilGraaf/quizzer}
 */

const { getjService } = require('../util/questions');
const { embedFfa } = require('../embeds/ffaEmbeds');
const Discord = require('discord.js');

class FreeForAll {
	constructor(channel, creator) {

		this.title = 'Free For All';
		this.channel = channel;
		this.creator = creator;
		this.questions = [];
		this.roundsLeft = 10;
		// Maintains a collection of each user's points
		this.scores = new Discord.Collection();

	}

	/**
	 * @desc Posts a question and awaits a response.
	 * @param {Integer} timeout - Number of milliseconds users have to respond.
	 * @returns {Promise<(Boolean)>} - A boolean indicating if the question was answered correctly.
	 */
	async postQuestion(timeout) {
		if (this.questions.length === 0) {
			try {
				this.questions = await this.getQuestions();
			}
			catch(e) {
				console.error(e);
				this.channel.send('sorry but I was unable to fetch your questions! Try again in a few moments.');
				return false;
			}
		}

		const item = this.questions[0];
		console.log(item);
		this.questions.shift();

		const filter = response => {
			return (item.answer.toLowerCase() == response.content.toLowerCase());
		};

		const questionEmbed = embedFfa(item);
		const questionObject = await this.channel.send(questionEmbed);
		try {
			const collected = await this.channel.awaitMessages(filter, { max: 1, time: 20000, errors: ['time'] });
			const userID = collected.first().author;

			if (!this.scores.has(userID)) {

				this.scores.set(userID, 1);
			}
			else {
				const currentScore = this.scores.get(userID);
				this.scores.set(userID, currentScore + 1);
			}

			this.channel.send(`${userID} got the correct answer! \nYour current score is \`⭐${this.scores.get(userID)}\``);
			return true;
		}
		catch(err) {
			this.channel.send('Looks like nobody got the answer this time.');
			return false;
		}


	}

	/**
	 * @desc Fetches a number of questions for the game.
	 * @returns {Promise<(Array<Object>)>} - The array containing the question objects.
	 */
	async getQuestions() {
		const url = 'https://jservice.io/api/random?count=20';
		const newQuestions = await getjService(url);
		return newQuestions;
	}

	/**
	 * @desc Used initially to launch the game.
	 * @param {Integer} rounds - Number of rounds to be played.
	 * @returns {Promise<(Message|Array<Message>)>} - Sends a message indicating the result of the game.
	 */
	play(rounds) {
		if (rounds !== undefined) {
			this.roundsLeft = rounds;
		}

		return this.gameLoop();
	}

	/**
	 * @desc This function is looped repeatedly while the game is running.
	 * @returns {Promise<(Message|Array<Message>)>} - Sends a message indicating the result of the game.
	 */
	async gameLoop() {

		// Submit a question and wait for the user response
		const result = await this.postQuestion(15000);
		this.roundsLeft--;

		if (this.roundsLeft > 0) {
			return this.gameLoop();
		}

		// No users got a correct answer
		if (!this.scores.array().length) {
			return this.channel.send('Game over! No one got a correct answer');
		}

		// Finds the highest scored user/users
		const highestScore = Array.from(this.scores.values())
			.reduce(function(a, b) {
				return Math.max(a, b);
			});
		const winners = Array.from(this.scores.filter(score => score == highestScore).keys());

		if (winners.length == 1) {
			return this.channel.send(`The winner is ${winners[0]}`);

		}

		if (winners.length > 1) {
			return this.channel.send(`The game is a tie between ${winners.join()}`);
		}


	}
}

module.exports.FreeForAll = FreeForAll;