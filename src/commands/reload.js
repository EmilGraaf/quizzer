module.exports = {
	name: 'reload',
	description: 'Reloads a command',
	aliases: ['rl'],
	args: true,
	usage: '[command]',
	cooldown: 5,
	guildsOnly: true,
	execute(message, args) {
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