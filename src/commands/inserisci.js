const {
	ActionRowBuilder,
	SlashCommandBuilder,
	ButtonBuilder,
	ButtonStyle,
} = require("discord.js")
const { tokenEmoji } = require("../utils/constants")

const data = new SlashCommandBuilder()
	.setName("inserisci")
	.setDescription("Inserisci Token nel Sacchetto")
	.addIntegerOption((option) =>
		option
			.setName("positivi")
			.setDescription("Token Positivi")
			.setRequired(true)
			.setMinValue(0)
			.setMaxValue(20),
	)
	.addIntegerOption((option) =>
		option
			.setName("negativi")
			.setDescription("Token Negativi")
			.setRequired(true)
			.setMinValue(0)
			.setMaxValue(20),
	)
	.addIntegerOption((option) =>
		option
			.setName("random")
			.setDescription("Token Random")
			.setRequired(true)
			.setMinValue(0)
			.setMaxValue(20),
	)
	.addIntegerOption((option) =>
		option
			.setName("estrai")
			.setDescription("Numero di Token da Estrarre")
			.setRequired(true)
			.setMinValue(1)
			.setMaxValue(5),
	)

const execute = async (interaction) => {
	const user = interaction.user.username
	const positive = interaction.options.getInteger("positivi") ?? 0
	const negative = interaction.options.getInteger("negativi") ?? 0
	const random = interaction.options.getInteger("random") ?? 0
	const extracted = interaction.options.getInteger("estrai") ?? 1

	let randomPositive = 0
	for (let i = 0; i <= random; i++) {
		if (Math.random() < 0.5) randomPositive++
	}

	const actualPosisitive = positive + randomPositive
	const total = positive + negative + random

	if (extracted > total) {
		await interaction.reply({
			content: "Non puoi estrarre più token di quelli che hai inserito",
		})
		return
	}

	const { currentInBag, extractedPositive, extractedNegative } = extract(
		total,
		extracted,
		actualPosisitive,
	)

	const responseContent = `${user} ha inserito ${total} Token (${positive}${
		tokenEmoji.positive
	}${negative}${tokenEmoji.negative}${random}${tokenEmoji.random})

Ha estratto ${extracted} Token: ${tokenEmoji.positive.repeat(
		extractedPositive,
	)}${tokenEmoji.negative.repeat(extractedNegative)}`

	if (total === extracted) {
		await interaction.reply({ content: responseContent })
		return
	}

	const continueButton = new ButtonBuilder()
		.setCustomId("continue")
		.setLabel("Continua")
		.setStyle(ButtonStyle.Secondary)
	const riskButton = new ButtonBuilder()
		.setCustomId("risk")
		.setLabel("Rischia")
		.setStyle(ButtonStyle.Danger)
	const dareButton = new ButtonBuilder()
		.setCustomId("dare")
		.setLabel("Osa")
		.setStyle(ButtonStyle.Danger)

	const actionRow = new ActionRowBuilder().addComponents(
		continueButton,
		riskButton,
		dareButton,
	)

	const response = await interaction.reply({
		content: responseContent,
		components: [actionRow],
	})

	const collectorFilter = (i) => i.user.id === interaction.user.id
	try {
		const confirmation = await response.awaitMessageComponent({
			filter: collectorFilter,
			time: 60_000,
		})

		if (["risk", "dare"].includes(confirmation.customId)) {
			const riskNumber = confirmation.customId === "risk" ? 5 : 6

			const {
				extractedPositive: riskExtractedPositive,
				extractedNegative: riskExtractedNegative,
			} = extract(
				currentInBag,
				riskNumber - extracted,
				actualPosisitive - extractedPositive,
			)

			await confirmation.update({
				content: `${responseContent} + Rischio ${tokenEmoji.positive.repeat(
					riskExtractedPositive,
				)}${tokenEmoji.negative.repeat(riskExtractedNegative)}`,
				components: [],
			})
		} else if (confirmation.customId === "cancel") {
			await confirmation.update({ content: responseContent, components: [] })
		}
	} catch (e) {
		console.error(e)
		await interaction.editReply({
			content: responseContent,
			components: [],
		})
	}
}

function extract(inBag, extractNumber, positive) {
	let currentInBag = inBag
	let extractedPositive = 0
	let currentPositive = positive

	for (let i = 0; i < extractNumber; i++) {
		if (Math.random() * currentInBag <= currentPositive) {
			extractedPositive++
			currentPositive--
		}
		currentInBag--
	}

	return {
		currentInBag,
		extractedPositive,
		extractedNegative: extractNumber - extractedPositive,
	}
}

module.exports = { data, execute }
