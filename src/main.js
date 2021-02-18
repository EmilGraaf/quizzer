/**
 * @file The main file responsible for initializing the
 *       discord client and handling incoming messages.
 * @author EmilG <emildegraaf@gmail.com>
 * @see {@link https://github.com/EmilGraaf/quizzer}
 */

// Import dependencies
const Discord = require('discord.js');
const fs = require('fs');
const { prefix, token } = require('./config.json');

// Initialize client and collections
const client = new Discord.Client();
module.exports.client = client;

client.commands = new Discord.Collection();
const cooldowns = new Discord.Collection();
const lockedChannels = new Discord.Collection();

// Get command file names and load each command object into collection
const commandFiles = fs.readdirSync(__dirname + '/commands/').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

// Log console on successful deployment
client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
	client.user.setPresence({ activity: { name: `${prefix}quiz` } });
});

// Listen for incoming messages
client.on('message', message => {
	// Ignore non-commands and bot messages
	if (!message.content.startsWith(prefix) || message.author.bot) {
		return;
	}

	// Extract arguments from message
	const args = message.content.slice(prefix.length).split(/ +/);
	const commandName = args.shift().toLocaleLowerCase();

	// Get command object associated with arg
	const command = client.commands.get(commandName)
		|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

	if (!command) return;

	if (command.guildOnly && message.channel.type === 'dm') {
		return message.reply('I can\'t execute that command inside DMs!');
	}

	if (command.args && !args.length) {
		let reply = `You didn't provide any arguments, ${message.author}!`;

		if (command.usage) {
			reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
		}

		return message.channel.send(reply);
	}

	// Init collection of cooldowns for each command
	if (!cooldowns.has(command.name)) {
		cooldowns.set(command.name, new Discord.Collection());
	}

	const now = Date.now();
	const timestamps = cooldowns.get(command.name);
	const cooldownAmount = (command.cooldown || 5) * 1000;

	if (timestamps.has(message.author.id)) {
		// Compute remaining cooldown time
		const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

		if (now < expirationTime) {
			const timeLeft = (expirationTime - now) / 1000;
			return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
		}
	}

	// Set cooldown and remove ID on expiration
	timestamps.set(message.author.id, now);
	setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

	// Prevent users from initiating a game in a channel with an ongoing game
	if (command.lockChannel) {
		if (lockedChannels.has(message.channel)) {
			return message.reply(`a game has already been initiated in this channel by ${lockedChannels.get(message.channel)}`);
		}
		else {
			lockedChannels.set(message.channel, message.author);
		}

		command.execute(message, args)
			.then(() => {
				if (lockedChannels.has(message.channel)) {
					lockedChannels.delete(message.channel);
				}
			})
			.catch((error) => {
				if (lockedChannels.has(message.channel)) {
					lockedChannels.delete(message.channel);
				}
				console.error(error);
				message.reply('there was an error trying to execute that command!');
			});
	}
	else {
		try {
			command.execute(message, args);
		}
		catch (error) {
			console.error(error);
			message.reply('there was an error trying to execute that command!');
		}
	}


},
);

// Catch unhandled errors
process.on('unhandledRejection', error => {
	console.error('Unhandled promise rejection:', error);
});


client.login(token);