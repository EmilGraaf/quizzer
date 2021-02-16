const he = require('he');
const fetch = require('node-fetch');


async function getOpenTriviaDB(url) {

	// Fetch questions and convert to json format
	const response = await fetch(url);
	const json = await response.json();
	console.log(json);
	// Decode strings to readable format
	const singlequote = JSON.stringify(json.results)
		.replace(/&quot;/g, '\'');
	const decoded = JSON.parse(he.decode(singlequote));

	return Object.values(decoded);
}

async function getjService(url) {

	// Fetch questions and convert to json format
	const response = await fetch(url);
	const json = await response.json();
	// Decode strings to readable format
	const singlequote = JSON.stringify(json)
		.replace('<i>', '')
		.replace('</i>', '');
	const decoded = JSON.parse(he.decode(singlequote));

	// const decoded = JSON.parse(he.decode(JSON.stringify(json)));
	return Object.values(decoded);
}

/**
 * Shuffles array in place. (Fisher-Yates algorithm)
 * @param {Array} a items An array containing the items.
 */
function shuffle(a) {
	for (let i = a.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[a[i], a[j]] = [a[j], a[i]];
	}
	return a;
}

module.exports.getOpenTriviaDB = getOpenTriviaDB;
module.exports.getjService = getjService;
module.exports.shuffle = shuffle;
