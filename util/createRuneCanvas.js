const Canvas = require("@napi-rs/canvas");
const { AttachmentBuilder } = require("discord.js");
const { getFactionNumber, getFrameRarity } = require("./getFactionNumber");
const { displayAbilities } = require("./displayAbilities");
const { wrapText } = require("./wrapText");
const { removeBrackets } = require("./helpers");
const path = require("path");
const { GlobalFonts } = require("@napi-rs/canvas");

require("dotenv").config();

module.exports = {
  createRune: async (rune, type) => {
    GlobalFonts.registerFromPath(path.join(__dirname, "..", "/fonts/ARIAL.TTF"), "Arial");
    // path.join(__dirname, "..", `/images/${type}.png`)
    // Original: 1350 : 480
    const width = type === "champs" ? 1350 : 730;
    const height = type === "champs" ? 545 : 440;

    const canvas = Canvas.createCanvas(width, height);
    const context = canvas.getContext("2d");



    const factionNum = getFactionNumber(rune.factions);

    console.log(factionNum);

    try {
      const runeImage = await Canvas.loadImage(
        `${process.env.POX_IMG_URL}/images/runes/lg/${rune.hash}.jpg`
      );
      const background = await Canvas.loadImage(
        `${process.env.POX_IMG_URL}/_themes/global/frames/large/front/${factionNum}.gif`
      );
      const rarityFrame = await Canvas.loadImage(
        `${
          process.env.POX_IMG_URL
        }/_themes/global/frames/large/lg_frame_rarity_${getFrameRarity(
          rune.rarity
        )}.gif`
      );
      const statIcons = await Canvas.loadImage(
        `${process.env.POX_IMG_URL}/_themes/global/frames/large/rune_stats.png`
      );

      const split = factionNum.split("_");

      const factionIconOne = await Canvas.loadImage(
        `${process.env.POX_IMG_URL}/_themes/global/frames/large/faction_${split[0]}_1.png`
      );
      const factionIconTwo = await Canvas.loadImage(
        `${process.env.POX_IMG_URL}/_themes/global/frames/large/faction_${
          split.length > 1 ? split[1] : split[0]
        }_2.png`
      );

      // Front images
      context.drawImage(runeImage, 25, 47, 280, 310);
      context.drawImage(rarityFrame, 0, 0, 332, 418);
      context.drawImage(background, 0, 0, 332, 418);
      context.drawImage(factionIconOne, 39, 36, 30, 22);
      context.drawImage(factionIconTwo, 39, 36, 30, 22);

      const getRng = () => {
        if (rune.minRng === rune.maxRng) return rune.minRng;
        else return `${rune.minRng} - ${rune.maxRng}`;
      };

      context.textAlign = "center";
      context.font = "bold 17px Arial";
      context.fillStyle = "#ffffff";
      context.shadowColor = "rgba(0,0,0,0.3)";
      context.shadowBlur = 2;
      context.fillText(rune.name, 161, 50);

      context.font = "bold 20px Arial";
      context.fillText(rune.noraCost.toString(), 293, 50);

      console.log("TYPE", type);

      if (type === "champs") {
        // Champ stats

        context.drawImage(statIcons, 0, 346, 332, 35);
        context.font = "12px Arial";
        context.fillStyle = "#ffffff";
        //62 add 53
        context.textAlign = "center";
        context.fillText(rune.damage.toString(), 62, 392);
        context.fillText(rune.speed.toString(), 115, 392);
        context.fillText(`${getRng()}`, 166, 392);
        context.fillText(rune.defense.toString(), 217, 392);
        context.fillText(rune.hitPoints.toString(), 267, 392);

        // Abilities ----

        context.font = "bold 16px Arial";
        context.textAlign = "center";
        context.fillStyle = "#c71515";
        context.fillText("Ability Set 1", 575, 25);

        await displayAbilities(rune.abilitySets[0].abilities, 330, 40, context);

        const setZeroLength = rune.abilitySets[0].abilities.length;

        context.font = "bold 16px Arial";
        context.textAlign = "center";
        context.fillStyle = "#c71515";
        context.fillText("Ability Set 2", 575, 144 + setZeroLength * 50 - 50);

        await displayAbilities(
          rune.abilitySets[1].abilities,
          330,
          158 + setZeroLength * 50 - 50,
          context
        );

        context.font = "bold 16px Arial";
        context.textAlign = "center";
        context.fillStyle = "#c71515";
        context.fillText("Starting Abilities", 1100, 25);

        await displayAbilities(rune.startingAbilities, 840, 40, context);

        // Rune Info ----
        context.font = "bold 14px Arial";
        context.textAlign = "center";
        context.fillStyle = "#c71515";
        context.fillText(`Deck Limit: ${rune.deckLimit}`, 166, 430);

        context.fillStyle = "#235bd5";
        context.fillText(`Races: ${rune.races.join(", ")}`, 166, 450);

        context.fillStyle = "#50c715";
        context.fillText(`Classes: ${rune.classes.join(", ")}`, 166, 470);

        context.fillStyle = "#ae20ce";
        context.fillText(`Size: ${rune.size}`, 166, 490);

        context.fillStyle = "#c78015";
        context.fillText(`Artist: ${rune.artist}`, 166, 510);

        context.fillStyle = "#15c7b2";
        context.fillText(`Rune set: ${rune.runeSet}`, 166, 530);
      } else {
        const backBg = await Canvas.loadImage(
          `${process.env.POX_IMG_URL}/_themes/global/frames/large/back/${factionNum}.gif`
        );

        context.drawImage(backBg, 350, 0, 332, 418);

        context.textAlign = "center";
        context.font = "bold 17px Arial";
        context.fillStyle = "#ffffff";
        context.fillText("Rune Information", 511, 50);

        context.font = "normal 11px Arial";

        wrapText(context, rune.flavorText, 511, 73, 270, 12);

        const str = removeBrackets(rune.description);
        wrapText(context, str, 511, 146, 270, 12);

        context.textAlign = "left";
        context.font = "normal 12px Arial";

        context.fillText(`Deck Limit: ${rune.deckLimit}`, 390, 300);
        context.fillText(`Artist: ${rune.artist}`, 390, 315);
        context.fillText(`Rune Set: ${rune.runeSet}`, 390, 330);
      }

      // Use the helpful Attachment class structure to process the file for you
      const attachment = new AttachmentBuilder(await canvas.encode("png"), {
        name: "poxrune.png",
      });

      return attachment;
    } catch (err) {
      console.log("ERROR!");
      console.log(err.message);
      return err;
    }

    // This uses the canvas dimensions to stretch the image onto the entire canvas
  },
};
