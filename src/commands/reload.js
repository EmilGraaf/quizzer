/**
 * @file Handles functionality for the 'reload' command, which is used to
 *       dynamically push new code while the bot is running.
 * @see {@link https://github.com/EmilGraaf/quizzer}
 */

module.exports = {
	name: 'reload',
	description: 'Reloads a command',
	aliases: ['rl'],
	args: true,
	usage: '[command]',
	cooldown: 5,
	guildsOnly: true,
	/**
	 * @desc This function is called by main to launch the command.
	 * @param {Message} message - The original message sent to initiate the command.
	 * @param {Array<String>} args - An array containing any supplied arguments to the command.
	 * @returns {Promise<(Message|Array<Message>)>} - A message containing a response to the request.
	 */
	execute(message, args) {
		// Only the developer may use this command
		if (message.author.id !== '227452921367887872') {
			return message.reply('this command is strictly used in development and may only be called by EmilG.');
		}
		// Retrieve object of supplied command name
		const commandName = args[0].toLowerCase();
		const command = message.client.commands.get(commandName)
			|| message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

		if (!command) return message.channel.send(`There is no command with name or alias \`${commandName}\`, ${message.author}!`);

		// Delete requirement from cache
		delete require.cache[require.resolve(`./${command.name}.js`)];

		try {
			// Make the new import
			const newCommand = require(`./${command.name}.js`);
			message.client.commands.set(newCommand.name, newCommand);
			message.channel.send(`Command \`${command.name}\` was reloaded!`);
		}
		catch (error) {
			console.log(error);
			message.channel.send(`There was an error while reloading a command \`${command.name}\`:\n\`${error.message}\``);
		}
	},
};