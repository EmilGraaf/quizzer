const he = require('he');
const fetch = require('node-fetch');

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

module.exports.getQuestions = getQuestions;