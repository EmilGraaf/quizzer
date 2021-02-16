const { getjService } = require('../util/questions');
const Discord = require('discord.js');

class FreeForAll {
	constructor(channel, creator) {

		this.title = 'Free For All';
		this.channel = channel;
		this.creator = creator;
		this.questions = [];
		this.roundsLeft = 10;
		this.scores = new Discord.Collection();
	}

	async postQuestion(timeout) {
		if (this.questions.length === 0) {
			try {
				this.questions = await this.getQuestions();
			}
			catch(e) {
				console.error(e);
				return this.channel.send('sorry but I was unable to fetch your questions! Try again in a few moments.');
			}
		}

		const item = this.questions[0];
		console.log(item.answer);
		this.questions.shift();

		const filter = response => {
			return (item.answer.toLowerCase() == response.content.toLowerCase());
		};

		const questionObject = await this.channel.send(item.question);
		try {
			const collected = await this.channel.awaitMessages(filter, { max: 1, time: 10000, errors: ['time'] });
			const userID = collected.first().author;
			this.channel.send(`${userID} got the correct answer!`);

			if (!this.scores.has(userID)) {

				this.scores.set(userID, 1);
			}
			else {
				const currentScore = this.scores.get(userID);
				this.scores.set(userID, currentScore + 1);
			}

			return true;
		}
		catch(err) {
			this.channel.send('Looks like nobody got the answer this time.');
			return false;
		}


	}

	async getQuestions() {
		const url = 'https://jservice.io/api/random?count=20';
		const newQuestions = await getjService(url);
		return newQuestions;
	}

	play() {
		return this.gameLoop();
	}

	async gameLoop() {

		// Submit a question and wait for the user response
		const result = await this.postQuestion(15000);
		this.roundsLeft--;
		console.log(this.scores);

		if (this.roundsLeft > 0) {
			return this.gameLoop();
		}


	}
}

module.exports.FreeForAll = FreeForAll;