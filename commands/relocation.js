const { SlashCommandBuilder, AttachmentBuilder, bold } = require("discord.js");
const { requestErrMsg, noResultsMsg } = require("../util/messages");
const Canvas = require("@napi-rs/canvas");
const path = require("path");
const { capitalizeFirstLetter } = require("../util/helpers");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("relocation")
    .setDescription(
      "Provides graphics with information and examples on how relocation works."
    )
    .addStringOption((option) =>
      option
        .setName("type")
        .setDescription("Enter the type of relocation you need help with")
        .setRequired(true)
        .addChoices(
          { name: "Knockback", value: "knockback" },
          { name: "Pounce", value: "pounce" },
          { name: "Manic", value: "manic" }
        )
    ),
  async execute(interaction) {
    try {
      const type = interaction.options.getString("type");

      const canvas = Canvas.createCanvas(600, 455);
      const context = canvas.getContext("2d");

      //       else abilityBg = await Canvas.loadImage();

      const img = await Canvas.loadImage(
        path.join(__dirname, "..", `/images/${type}.png`)
      );

      if (img.complete) {
        context.drawImage(img, 0, 0, 600, 455);

        const attachment = new AttachmentBuilder(await canvas.encode("png"), {
          name: `${type}.png`,
        });

        await interaction.reply({
          content: `Here is the graphic for ${bold(
            capitalizeFirstLetter(type)
          )}, graphic created by GabrielQ.`,
          files: [attachment],
        });
      } else {
        await interaction.reply({ content: noResultsMsg, ephemeral: true });
      }
    } catch (err) {
      console.log(err);
      await interaction.reply({ content: requestErrMsg, ephemeral: true });
    }
  },
};
