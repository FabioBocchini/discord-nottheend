require("dotenv").config()
const { REST, Routes } = require("discord.js")
const { getCommandsList } = require("../utils/commands")
const config = require("../utils/config")

const commands = getCommandsList()

const rest = new REST().setToken(config.discord.token)

async function run() {
	try {
		console.log(
			`Started refreshing ${commands.length} application (/) commands.`,
		)

		const data = await rest.put(
			Routes.applicationGuildCommands(
				config.discord.clientId,
				config.discord.guildId,
			),
			{ body: commands },
		)

		console.log(
			`Successfully reloaded ${data.length} application (/) commands.`,
		)
	} catch (error) {
		console.error(error)
	}
}

run()
