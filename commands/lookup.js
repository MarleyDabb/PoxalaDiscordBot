const { SlashCommandBuilder, bold, userMention } = require("discord.js");
const axios = require("axios");
const {
  errorAPIMsg,
  noResultsMsg,
  requestErrMsg,
  fetchingDataMsg,
} = require("../util/messages");
const { capitalizeFirstLetter } = require("../util/helpers");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("lookup")
    .setDescription("Enter an ability name to see which champions have it.")
    .addStringOption((option) =>
      option
        .setName("ability")
        .setDescription("Enter the full name of an ability")
        .setRequired(true)
    ),
  async execute(interaction) {
    const abilityName = interaction.options.getString("ability");

    try {
      await interaction.reply({ content: fetchingDataMsg, ephemeral: true });

      const { data: abilityResponseBody, status: abilityStatus } =
        await axios.get(`${process.env.BASE_API_URL}/getChampionAbilities`);

      if (abilityStatus === 200) {
        const { data: abilityData } = abilityResponseBody;

        const abilityFound = abilityData.find(
          (ability) => ability.name.toLowerCase() === abilityName.toLowerCase()
        );

        if (abilityFound) {
          const { data: runeResponseBody, status: runeStatus } =
            await axios.get(`${process.env.BASE_API_URL}/getRunes`);

          if (runeStatus === 200) {
            const { data: runeData } = runeResponseBody;
            const { champs } = runeData;

            let filterOne = champs.filter((champ) => {
              for (let i = 0; i < champ.startingAbilities.length; i++) {
                if (
                  champ.startingAbilities[i].name.toLowerCase() ===
                  abilityName.toLowerCase()
                ) {
                  return champ;
                }
              }
            });

            let filterTwo = champs.filter((champ) => {
              for (let i = 0; i < champ.abilitySets.length; i++) {
                for (
                  let x = 0;
                  x < champ.abilitySets[i].abilities.length;
                  x++
                ) {
                  if (
                    champ.abilitySets[i].abilities[x].name.toLowerCase() ===
                    abilityName.toLowerCase()
                  ) {
                    return champ;
                  }
                }
              }
            });

            const result = filterOne.concat(filterTwo);

            if (result.length > 0) {
              const champList = result.map((rune) => rune.name);
              await interaction.deleteReply();
              const channel = interaction.channel
              console.log(channel);

              await interaction.followUp(
                `:hatching_chick: ${userMention(
                  interaction.user.id
                )} The following champions have the ability ${bold(
                  capitalizeFirstLetter(abilityName)
                )}:\n\n${champList.join(", ")}`
              );
            } else {
              return await interaction.followUp({ content: noResultsMsg, ephemeral: true });
            }
          } else {
            await interaction.followUp({
              content: errorAPIMsg,
              ephemeral: true,
            });
          }
        } else {
          await interaction.followUp({ content: noResultsMsg, ephemeral: true });
        }
      } else {
        await interaction.followUp({ content: errorAPIMsg, ephemeral: true });
      }
    } catch (err) {
      await interaction.followUp({ content: requestErrMsg, ephemeral: true });
      console.log(err.message);
    }
  },
};
