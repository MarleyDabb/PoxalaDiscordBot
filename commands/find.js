const {
  SlashCommandBuilder,
  StringSelectMenuBuilder,
  ActionRowBuilder,
  ComponentType,
} = require("discord.js");
const axios = require("axios");
const { createRune } = require("../util/createRuneCanvas");
const { createAbilityCanvas } = require("../util/createAbilityCanvas");
const { errorAPIMsg, noResultsMsg } = require("../util/messages");

require("dotenv").config();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("find")
    .setDescription(
      "Find a rune by specifying the rune type and entering a search input."
    )
    .addStringOption((option) =>
      option
        .setName("type")
        .setDescription("Select the type of rune you are searching for")
        .setRequired(true)
        .addChoices(
          { name: "Champion", value: "champs" },
          { name: "Spell", value: "spells" },
          { name: "Equipment", value: "equips" },
          { name: "Relic", value: "relics" },
          { name: "Ability", value: "ability"}
        )
    )
    .addStringOption((option) =>
      option
        .setName("input")
        .setDescription("Search for a rune")
        .setRequired(true)
    ),
  async execute(interaction) {
    const type = interaction.options.getString("type");
    const input = interaction.options.getString("input");
    console.log(type, input);

    const isAbility = type === 'ability';

    const { data: responseBody, status } = await axios.get(`${process.env.BASE_API_URL}/${isAbility ? 'getChampionAbilities' : 'getRunes'}`);

    if (status === 200) {
      const { data } = responseBody;

      const results = isAbility ? data.filter((result) =>
        result.name.toLowerCase().includes(input.toLowerCase())
      ) : data[type].filter((result) =>
        result.name.toLowerCase().includes(input.toLowerCase())
      );
      console.log(results)

      if (results.length === 0) return await interaction.reply(noResultsMsg);

      const selector = new StringSelectMenuBuilder()
        .setCustomId("results")
        .setPlaceholder("Make a selection")
        .addOptions(
          results.map((result, index) => {
            if (isAbility) {
              return {
                label: result.name,
                value: index.toString(),
              };
            } else {
              return {
                label: result.name,
                description: `Faction: ${
                  result.factions.length > 1
                    ? result.factions.join(", ")
                    : result.factions[0]
                } | Rarity: ${result.rarity} | Nora: ${result.noraCost}`,
                value: index.toString(),
              };
            }
          })
        );

      const row = new ActionRowBuilder().addComponents(selector);

      const response = await interaction.reply({
        content: `Choose ${isAbility ? 'an ability' : 'a rune'} from the list`,
        components: [row],
        ephemeral: true
      });

      const collector = response.createMessageComponentCollector({
        componentType: ComponentType.StringSelect,
        time: 3_600_000,
      });

      collector.on("collect", async (i) => {
        const selection = i.values[0];
        const rune = results[selection];

        const attachment = isAbility ? await createAbilityCanvas(rune) : await createRune(rune);

        await i.reply({ content: `ID: ${rune.id}`, files: [attachment] });
      });


    } else {
      await interaction.reply(errorAPIMsg);
    }
  },
};
