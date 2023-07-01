const Canvas = require("@napi-rs/canvas");
const { displayAbilities } = require("./displayAbilities");
const { AttachmentBuilder } = require("discord.js");
const { GlobalFonts } = require("@napi-rs/canvas");
const path = require("path");
module.exports = {
  createAbilityCanvas: async (ability) => {
    GlobalFonts.registerFromPath(path.join(__dirname, "..", "/fonts/ARIAL.TTF"), "Arial");
    const canvas = Canvas.createCanvas(500, 60);
    const context = canvas.getContext("2d");

    try {
      await displayAbilities([ability], 0, 6, context);

      const attachment = new AttachmentBuilder(await canvas.encode("png"), {
        name: "poxability.png",
      });

      return attachment;
    } catch (err) {
      console.log("ERROR!");
      console.log(err.message);
      return err;
    }
  },
};
