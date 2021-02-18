/**
 * @file Contains the functions used for interacting with API's
 *       for fetching questions.
 * @author EmilG <emildegraaf@gmail.com>
 * @see {@link https://github.com/EmilGraaf/quizzer}
 */

const he = require('he');
const fetch = require('node-fetch');

/**
 * @desc Fetches questions from OpenTriviaDataBase
 * @param {String} url - The URL of the API
 * @returns {Promise<(Array<Object>)>} - An array containing the question objects.
 */
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

/**
 * @desc Fetches questions from jService
 * @param {String} url - The URL of the API
 * @returns {Promise<(Array<Object>)>} - An array containing the question objects.
 */
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
 * @desc Shuffles array in place. (Fisher-Yates algorithm)
 * @param {Array} a - An array containing the items.
 * @returns {Array} - The shuffled array.
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
