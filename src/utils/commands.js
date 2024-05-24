const inserisci = require("../commands/inserisci")
const { Collection } = require("discord.js")

const commands = [{ name: "inserisci", command: inserisci }]

function getCommandsCollection() {
	const collection = new Collection()

	for (const cmd in commands) {
		collection.set(cmd.name, cmd.command)
	}

	return collection
}

function getCommandsList() {
	return commands.map((c) => c.command.data.toJSON())
}

module.exports = {
	getCommandsCollection,
	getCommandsList,
}
