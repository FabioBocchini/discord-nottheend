const { Collection } = require("discord.js")
const inserisci = require("../commands/inserisci")

const commands = [inserisci]

function getCommandsCollection() {
	const collection = new Collection()
	for (const c of commands) {
		collection.set(c.data.name, c)
	}
	return collection
}

function getCommandsList() {
	return commands.map((c) => c.data.toJSON())
}

module.exports = {
	getCommandsCollection,
	getCommandsList,
}
