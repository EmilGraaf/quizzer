const he = require('he');
const fetch = require('node-fetch');
const { embedTf, embedTfCorrect, embedTfIncorrect } = require('./embeds');

async function getQuestions(url) {

	// Fetch questions and convert to json format
	const response = await fetch(url);
	const json = await response.json();

	// Decode strings to readable format
	const singlequote = JSON.stringify(json.results)
		.replace(/&quot;/g, '\'');
	const decoded = JSON.parse(he.decode(singlequote));

	return Object.values(decoded);
}

class TrueFalse {
	constructor(item) {
		this.category = item.category;
		this.question = item.question;
		this.correctAnswer = item.correct_answer;
		this.questionObject = null;
	}
	async post(channel, player, timeout) {
		// Filter out invalid emojis and unauthorized users
		const filter = (reaction, author) => {
			return ['✅', '❌'].includes(reaction.emoji.name) && player.getID() === author.id;
		};

		const emojiDict = {
			'✅': 'True',
			'❌': 'False',
		};

		// Send message and apply reactions
		const questionEmbed = embedTf(this, player);
		this.questionObject = await channel.send(questionEmbed);
		await this.questionObject.react('✅');
		await this.questionObject.react('❌');

		// Await a response
		try {
			const response = await this.questionObject.awaitReactions(filter, { max: 1, time: timeout, errors: ['time'] });
			const reaction = response.first();
			if (emojiDict[reaction.emoji.name] === this.correctAnswer) {
				return true;
			}
			else {
				return false;
			}
		}
		catch(err) {
			return false;
		}
	}
	setCorrect(player) {
		if (this.questionObject != null) {
			this.questionObject.edit(embedTfCorrect(this, player));
		}
	}
	setIncorrect(player) {
		if (this.questionObject != null) {
			this.questionObject.edit(embedTfIncorrect(this, player));
		}
	}
}


module.exports.getQuestions = getQuestions;
module.exports.TrueFalse = TrueFalse;