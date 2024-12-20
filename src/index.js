require("dotenv").config()
const { Client, Events, GatewayIntentBits } = require("discord.js")
const { getCommandsCollection } = require("./utils/commands")
const config = require("./utils/config")

const client = new Client({ intents: [GatewayIntentBits.Guilds] })

client.commands = getCommandsCollection()

client.once(Events.ClientReady, (readyCLient) => {
	console.log(`Client ready: ${readyCLient.user.tag}`)
})

client.on(Events.InteractionCreate, async (interaction) => {
	if (!interaction.isChatInputCommand()) return

	const command = interaction.client.commands.get(interaction.commandName)

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`)
		return
	}

	try {
		await command.execute(interaction)
	} catch (error) {
		console.error(error)
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({
				content: "There was an error while executing this command!",
				ephemeral: true,
			})
		} else {
			await interaction.reply({
				content: "There was an error while executing this command!",
				ephemeral: true,
			})
		}
	}
})

client.login(config.discord.token)
