const { Collection } = require("discord.js")
const ping = require("../commands/ping")

const commands = [ping]

function getCommandsCollection() {
	const collection = new Collection()
	commands.forEach((command) => collection.set(command.data.name, command))
	return collection
}

function getCommandsList() {
	return commands.map((c) => c.command.data.toJSON())
}

module.exports = {
	getCommandsCollection,
	getCommandsList,
}
