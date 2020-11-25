const { getQuestions } = require('../util/questions');

module.exports = {
	name: 'quiz',
	description: 'Start a new quiz',
	aliases: ['quizzer', 'qz'],
	args: false,
	usage: '[command]',
	cooldown: 10,
	guildsOnly: true,
};

function execute(message, args) {

	getQuestions('https://opentdb.com/api.php?amount=3')
		.then(questions => initQuiz(message, questions))
		.catch((e) => {
			console.error(e);
			return message.reply('sorry but I was unable to fetch your questions! Try again in a few moments.');
		});


}

// {
// 	category: 'Entertainment: Music',
// 	type: 'multiple',
// 	difficulty: 'hard',
// 	question: "Who sings the rap song 'Secret Wars Part 1'?",
// 	correct_answer: 'The Last Emperor',
// 	incorrect_answers: [ 'MC Frontalot', 'Busdriver', 'Masta Killa' ]
//   }

function initQuiz(message, questions) {

	let answered = false;

	if (questions.length === 0) {
		return message.channel.send('No more questions. Quiz is over!');
	}

	const item = questions[0];

	const filter = response => {
		return (item.correct_answer.toLowerCase() === response.content.toLowerCase());
	};

	message.channel.send(`${item.question} \n ${item.correct_answer}`);

	const collector = message.channel.createMessageCollector(filter, { time: 15000 });
	collector.on('collect', m => {
		answered = true;
		console.log(`Collected ${m.content}`);
		questions.shift();
		initQuiz(message, questions);

	});

	collector.on('end', collected => {
		if (!answered) {
			console.log(`Collected ${collected.size} items`);
			questions.shift();
			initQuiz(message, questions);
		}

	});

}

module.exports.execute = execute;