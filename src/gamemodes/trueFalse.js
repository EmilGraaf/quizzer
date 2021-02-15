const { Game } = require('./game');
const { embedTf, embedTfCorrect, embedTfIncorrect } = require('../embeds/tfEmbeds');
const { getOpenTriviaDB } = require('../util/questions');


class TrueFalse extends Game {
	constructor(channel, creator) {
		super(channel, creator);
		this.title = 'True/False Marathon';

	}

	async postQuestion(player, timeout) {

		if (this.questions.length === 0) {
			try {
				this.questions = await this.getQuestions();
			}
			catch(e) {
				console.error(e);
				return this.channel.send('sorry but I was unable to fetch your questions! Try again in a few moments.');
			}
		}

		// Filter out invalid emojis and unauthorized users
		const filter = (reaction, author) => {
			return ['✅', '❌'].includes(reaction.emoji.name) && player.getID() === author.id;
		};

		const emojiDict = {
			'✅': 'True',
			'❌': 'False',
		};

		const item = this.questions[0];
		this.questions.shift();
		// Send message and apply reactions
		const questionEmbed = embedTf(item, player);

		const questionObject = await this.channel.send(questionEmbed);
		await questionObject.react('✅');
		await questionObject.react('❌');

		// Await a response
		try {
			const response = await questionObject.awaitReactions(filter, { max: 1, time: timeout, errors: ['time'] });
			const reaction = response.first();
			if (emojiDict[reaction.emoji.name] === item.correct_answer) {
				questionObject.edit(embedTfCorrect(item, player));
				return true;
			}
			else {

				questionObject.edit(embedTfIncorrect(item, player));
				return false;
			}
		}
		catch(err) {
			questionObject.edit(embedTfIncorrect(item, player));
			return false;
		}
	}


	async getQuestions() {
		const url = 'https://opentdb.com/api.php?amount=20&type=boolean';
		const newQuestions = await getOpenTriviaDB(url);
		return newQuestions;
	}

}

module.exports.TrueFalse = TrueFalse;