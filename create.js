const { SlashCommandBuilder, userMention } = require("discord.js");
const {
  requestErrMsg,
  fetchingDataMsg,
  noResultsMsg,
  inputErrorMsg,
} = require("./util/messages");
const axios = require("axios");
const { isNumeric } = require("./util/helpers");
const { createRune } = require("./util/createRuneCanvas");

const abilityStrToArray = (str, maxNum) => {
  return str
    .split(", ")
    .map((id) => {
      if (isNumeric(id)) return Number(id);
      else console.log("bad input");
    })
    .slice(0, maxNum);
};

const fetchAbilities = (idArray, abilitySet) => {
  return idArray.map((id) => {
    const ability = abilitySet.find((abil) => abil.id === id);
    if (ability) return ability;
    else console.log("ABILITY DOES NOT EXIST !!");
  });
};

const fixDefaults = (aArray, starting) => {
  return aArray.map((ability, index) => {
    if (starting) {
      return { ...ability, default: true };
    } else {
      if (index === 0) {
        return { ...ability, default: true };
      } else {
        return { ...ability, default: false };
      }
    }
  });
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName("create")
    .setDescription("Modify an existing champion rune")
    .addIntegerOption((option) =>
      option
        .setName("champion_id")
        .setDescription("Enter the ID of the champion you wish to modify")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("ability_set_1")
        .setDescription("Enter the ability IDs for your first set (max 3)")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("ability_set_2")
        .setDescription("Enter the ability IDs for your second set (max 3)")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("starting_abilities")
        .setDescription(
          "Enter the ability IDs for your starting abilities (max 6)"
        )
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName("nora_mod")
        .setDescription("A nora modifier to apply to your rune")
        .setMinValue(-50)
        .setMaxValue(50)
    )
    .addIntegerOption((option) =>
      option
        .setName("damage")
        .setDescription("The damage value of your rune")
        .setMinValue(0)
        .setMaxValue(25)
    )
    .addIntegerOption((option) =>
      option
        .setName("health")
        .setDescription("The HP value of your rune")
        .setMinValue(1)
        .setMaxValue(99)
    )
    .addStringOption((option) =>
      option
        .setName("range")
        .setMaxLength(5)
        .setDescription(
          "The range value of your rune (e.g 1, 2 - would give you 1-2 range)"
        )
    ),
  async execute(interaction) {
    try {
      await interaction.reply({ content: fetchingDataMsg, ephemeral: true });

      const { data: runeResponseBody, status: runeStatus } = await axios.get(
        `${process.env.BASE_API_URL}/getRunes`
      );
      const { data: abilityResponseBody, status: abilityStatus } =
        await axios.get(`${process.env.BASE_API_URL}/getChampionAbilities`);

      if (runeStatus === 200 && abilityStatus === 200) {
        const champId = interaction.options.getInteger("champion_id");
        const aSetOneIds = interaction.options.getString("ability_set_1");
        const aSetTwoIds = interaction.options.getString("ability_set_2");
        const startingAbilityIds =
          interaction.options.getString("starting_abilities");

        console.log("test");

        const { data: runeData } = runeResponseBody;
        const { data: abilityData } = abilityResponseBody;

        const chosenRune = runeData.champs.find((rune) => rune.id === champId);
        const setOne = abilityStrToArray(aSetOneIds, 3);
        const setTwo = abilityStrToArray(aSetTwoIds, 3);
        const startingAbils = abilityStrToArray(startingAbilityIds, 6);

        console.log(setOne);
        console.log(setTwo);
        console.log(startingAbils);

        if (!chosenRune)
          await interaction.followUp({
            content: inputErrorMsg("champion id"),
            ephemeral: true,
          });
        else if (setOne.includes(undefined))
          await interaction.followUp({
            content: inputErrorMsg("ability set 1"),
            ephemeral: true,
          });
        else if (setTwo.includes(undefined))
          await interaction.followUp({
            content: inputErrorMsg("ability set 2"),
            ephemeral: true,
          });
        else if (startingAbils.includes(undefined))
          await interaction.followUp({
            content: inputErrorMsg("starting ability set"),
            ephemeral: true,
          });
        else {
          console.log("Building rune abilities...");
          const startersToUse = fetchAbilities(startingAbils, abilityData);
          const setOneToUse = fetchAbilities(setOne, abilityData);
          const setTwoToUse = fetchAbilities(setTwo, abilityData);

          if (startersToUse.includes(undefined))
            await interaction.followUp({
              content: inputErrorMsg("a starting ability ID did not match"),
              ephemeral: true,
            });
          else if (setOneToUse.includes(undefined))
            await interaction.followUp({
              content: inputErrorMsg("an ability ID for set one did not match"),
              ephemeral: true,
            });
          else if (setTwoToUse.includes(undefined))
            await interaction.followUp({
              content: inputErrorMsg("an ability ID for set two did not match"),
              ephemeral: true,
            });
          else {
            console.log("Building rune...");

            const sets = [
              { abilities: fixDefaults(setOneToUse, false) },
              { abilities: fixDefaults(setTwoToUse, false) },
            ];
            let rune = {
              ...chosenRune,
              startingAbilities: fixDefaults(startersToUse, true),
              abilitySets: sets,
            };

            const applyNoraCost = (runeToGet) => {
              const starterCost = runeToGet.startingAbilities
                .map((ability) => ability.noraCost)
                .reduce((partialSum, a) => partialSum + a, 0);
              const setOneCost = runeToGet.abilitySets[0].abilities
                .map((ability) => {
                  if (ability.default === true) return ability.noraCost;
                })
                .filter((ability) => {
                  if (ability) return ability;
                })
                .reduce((partialSum, a) => partialSum + a, 0);

              const setTwoCost = runeToGet.abilitySets[0].abilities
                .map((ability) => {
                  if (ability.default === true) return ability.noraCost;
                })
                .filter((ability) => {
                  if (ability) return ability;
                })
                .reduce((partialSum, a) => partialSum + a, 0);

              return starterCost + setOneCost + setTwoCost;
            };

            const oldCost = applyNoraCost(chosenRune);
            const newCost = applyNoraCost(rune);

            rune = { ...rune, noraCost: rune.noraCost - oldCost + newCost };

            const attachment = await createRune(rune, "champs");

            await interaction.followUp({
              content: `Here is the rune you have created ${userMention(
                interaction.user.id
              )}`,
              files: [attachment],
            });
          }
        }
      } else {
        await interaction.followUp({ content: requestErrMsg, ephemeral: true });
      }
    } catch (err) {
      console.log(err);
      await interaction.followUp({ content: requestErrMsg, ephemeral: true });
    }
  },
};
