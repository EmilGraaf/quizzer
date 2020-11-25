const { getQuestions } = require('../util/questions');
const { embedTfSingle } = require('../util/embeds');

module.exports = {
	name: 'trueFalse',
	description: 'Start a round of True/False',
	aliases: ['tf', 'true-false'],
	args: false,
	usage: '[command]',
	cooldown: 10,
	guildsOnly: true,
};

function execute(message, args) {
	// Fetch questions and start the game
	const url = 'https://opentdb.com/api.php?amount=5&difficulty=easy&type=boolean';
	getQuestions(url)
		.then(questions => startRound(message, questions, 0))
		.catch((e) => {
			console.error(e);
			return message.reply('sorry but I was unable to fetch your questions! Try again in a few moments.');
		});


}

async function startRound(message, questions, score) {

	const item = questions[0];
	// Correlation between emojis and boolean values
	const emojiDict = {
		'✅': 'True',
		'❌': 'False',
	};
	// Filter out invalid emojis and unauthorized users
	const filter = (reaction, user) => {
		return ['✅', '❌'].includes(reaction.emoji.name) && user.id === message.author.id;
	};
	// Embed question using correct formatting
	const replyEmbed = embedTfSingle(item);
	const reply = await message.channel.send(replyEmbed);
	await reply.react('✅');
	await reply.react('❌');

	reply.awaitReactions(filter, { max: 1, time: 15000, errors: ['time'] })
		.then(collected => {
			const reaction = collected.first();
			// Given correct answer, continue to the next question/round
			if (emojiDict[reaction.emoji.name] === item.correct_answer) {
				replyEmbed.setColor('#52AF52');
				reply.edit(replyEmbed);
				questions.shift();
				// Fetch new batch of questions if necessary
				if (questions.length === 0) {
					const url = 'https://opentdb.com/api.php?amount=5&difficulty=easy&type=boolean';
					getQuestions(url)
						.then(newBatch => startRound(message, newBatch, ++score))
						.catch((e) => {
							console.error(e);
							return message.reply('sorry but I was unable to fetch your questions! Try again in a few moments.');
						});
				}
				else {
					startRound(message, questions, ++score);
				}

			}
			// End the game on an incorrect answer
			else {
				replyEmbed.setColor('#FE2E2E');
				reply.edit(replyEmbed);
				return message.channel.send(`Ouch, incorrect! You answered \`${score}\` questions correctly. Your highscore is Y.`);
			}
		})
		.catch(collected => {
			return message.channel.send(`You failed to answer the question. You answered \`${score}\` questions correctly. Your highscore is Y.`);
		});

}

module.exports.execute = execute;