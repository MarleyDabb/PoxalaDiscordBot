const Canvas = require("@napi-rs/canvas");
const { AttachmentBuilder } = require("discord.js");
const { getFactionNumber, getFrameRarity } = require("./getFactionNumber");
const { displayAbilities } = require("./displayAbilities");

module.exports = {
  createRune: async (rune) => {
    // Original: 1350 : 480
    const canvas = Canvas.createCanvas(1350, 545);
    const context = canvas.getContext("2d");

    const factionNum = getFactionNumber(rune.factions);

    console.log(factionNum);

    try {
      const runeImage = await Canvas.loadImage(
        `https://d2aao99y1mip6n.cloudfront.net/images/runes/lg/${rune.hash}.jpg`
      );
      const background = await Canvas.loadImage(
        `https://d2aao99y1mip6n.cloudfront.net/_themes/global/frames/large/front/${factionNum}.gif`
      );
      const rarityFrame = await Canvas.loadImage(
        `https://d2aao99y1mip6n.cloudfront.net/_themes/global/frames/large/lg_frame_rarity_${getFrameRarity(
          rune.rarity
        )}.gif`
      );
      const statIcons = await Canvas.loadImage(
        `https://d2aao99y1mip6n.cloudfront.net/_themes/global/frames/large/rune_stats.png`
      );

      const split = factionNum.split('_');

      const factionIconOne = await Canvas.loadImage(
        `https://d2aao99y1mip6n.cloudfront.net/_themes/global/frames/large/faction_${split[0]}_1.png`
      )
      const factionIconTwo = await Canvas.loadImage(
        `https://d2aao99y1mip6n.cloudfront.net/_themes/global/frames/large/faction_${split.length > 1 ? split[1] : split[0]}_2.png`
      )

      // Front images
      context.drawImage(runeImage, 25, 47, 280, 310);
      context.drawImage(rarityFrame, 0, 0, 332, 418);
      context.drawImage(background, 0, 0, 332, 418);
      context.drawImage(statIcons, 0, 346, 332, 35);
      context.drawImage(factionIconOne, 39, 36, 30, 22);
      context.drawImage(factionIconTwo, 39, 36, 30, 22);

      const getRng = () => {
        if (rune.minRng === rune.maxRng) return rune.minRng;
        else return `${rune.minRng} - ${rune.maxRng}`;
      };

      context.font = "12px Arial";
      context.fillStyle = "#ffffff";
      //62 add 53
      context.textAlign = "center";
      context.fillText(rune.damage.toString(), 62, 392);
      context.fillText(rune.speed.toString(), 115, 392);
      context.fillText(`${getRng()}`, 166, 392);
      context.fillText(rune.defense.toString(), 217, 392);
      context.fillText(rune.hitPoints.toString(), 267, 392);

      context.font = "bold 17px Arial";
      context.shadowColor = "rgba(0,0,0,0.3)";
      context.shadowBlur = 2;
      context.fillText(rune.name, 161, 50);

      context.font = "bold 20px Arial";
      context.fillText(rune.noraCost.toString(), 293, 50);

      // Rune Info ----
      context.font = 'bold 14px Arial';
      context.textAlign = 'center';
      context.fillStyle = '#c71515';
      context.fillText(`Deck Limit: ${rune.deckLimit}`, 166, 430);

      context.fillStyle = '#235bd5';
      context.fillText(`Races: ${rune.races.join(', ')}`, 166, 450)

      context.fillStyle = '#50c715';
      context.fillText(`Classes: ${rune.classes.join(', ')}`, 166, 470)

      context.fillStyle = '#ae20ce';
      context.fillText(`Size: ${rune.size}`, 166, 490)

      context.fillStyle = '#c78015';
      context.fillText(`Artist: ${rune.artist}`, 166, 510);

      context.fillStyle = '#15c7b2';
      context.fillText(`Rune set: ${rune.runeSet}`, 166, 530)

      // Abilities ----

      context.font = 'bold 16px Arial';
      context.textAlign = 'center';
      context.fillStyle = '#c71515';
      context.fillText('Ability Set 1', 575, 25);

      await displayAbilities(rune.abilitySets[0].abilities, 330, 40, context);

      const setZeroLength = rune.abilitySets[0].abilities.length;

      context.font = 'bold 16px Arial';
      context.textAlign = 'center';
      context.fillStyle = '#c71515';
      context.fillText('Ability Set 2', 575, 144 + (setZeroLength * 50) - 50);

      await displayAbilities(rune.abilitySets[1].abilities, 330, 158 + (setZeroLength * 50) - 50, context);

      context.font = 'bold 16px Arial';
      context.textAlign = 'center';
      context.fillStyle = '#c71515';
      context.fillText('Starting Abilities', 1100, 25);

      await displayAbilities(rune.startingAbilities, 840, 40, context);

      // Use the helpful Attachment class structure to process the file for you
      const attachment = new AttachmentBuilder(await canvas.encode("png"), {
        name: "poxrune.png",
      });

      return attachment;
    } catch (err) {
      console.log("ERROR!");
      console.log(err.message);
    }

    // This uses the canvas dimensions to stretch the image onto the entire canvas
  },
};
