const { SlashCommandBuilder } = require("discord.js")

const data = new SlashCommandBuilder()
	.setName("inserisci")
	.setDescription("Inserisci Token nel Sacchetto")

const execute = async (interaction) => {
	// const user = interaction.user.username
	await interaction.reply("Pong!")
}

module.exports = { data, execute }
