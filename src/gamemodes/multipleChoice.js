const { Game } = require('./game');
const { embedMc, embedMcCorrect, embedMcIncorrect } = require('../embeds/mcEmbeds');
const { getOpenTriviaDB, shuffle } = require('../util/questions');


class MultipleChoice extends Game {
	constructor(channel, creator) {
		super(channel, creator);
		this.title = 'Multiple Choice Marathon';

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
			return ['🇦', '🇧', '🇨', '🇩'].includes(reaction.emoji.name) && player.getID() === author.id;
		};

		const emojiDict = {
			'🇦': 0,
			'🇧': 1,
			'🇨': 2,
			'🇩': 3,
		};

		const item = this.questions[0];
		this.questions.shift();

		item.shuffled = shuffle(item.incorrect_answers.concat(item.correct_answer));
		console.log(item.shuffled);
		// Send message and apply reactions
		const questionEmbed = embedMc(item, player);

		const questionObject = await this.channel.send(questionEmbed);
		await questionObject.react('🇦');
		await questionObject.react('🇧');
		await questionObject.react('🇨');
		await questionObject.react('🇩');

		// Await a response
		try {
			const response = await questionObject.awaitReactions(filter, { max: 1, time: timeout, errors: ['time'] });
			const reaction = response.first();
			if (item.shuffled[emojiDict[reaction.emoji.name]] === item.correct_answer) {
				questionObject.edit(embedMcCorrect(item, player));
				return true;
			}
			else {

				questionObject.edit(embedMcIncorrect(item, player, item.shuffled[emojiDict[reaction.emoji.name]]));
				return false;
			}
		}
		catch(err) {
			questionObject.edit(embedMcIncorrect(item, player));
			return false;
		}
	}


	async getQuestions() {
		const url = 'https://opentdb.com/api.php?amount=20&type=multiple';
		const newQuestions = await getOpenTriviaDB(url);
		return newQuestions;
	}

}

module.exports.MultipleChoice = MultipleChoice;