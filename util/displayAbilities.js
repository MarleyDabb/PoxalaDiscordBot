const Canvas = require("@napi-rs/canvas");
const path = require("path");
const { wrapText } = require("./wrapText");
const { removeBrackets } = require("./helpers");

require("dotenv").config();

module.exports = {
  displayAbilities: async (abilityArray, startingX, startingY, context) => {
    const arr = abilityArray.sort((a, b) =>
      a.default === b.default ? 0 : a.default ? -1 : 1
    );
    for (let i = 0; i < arr.length; i++) {
      const ability = arr[i];

      const toAddY = 65;

      let abilityBg;
      if (ability.default)
        abilityBg = await Canvas.loadImage(
          path.join(__dirname, "..", "/images/abilityBg3.png")
        );
      else if (ability.default === undefined)
        abilityBg = await Canvas.loadImage(
          path.join(__dirname, "..", "/images/abilityBg3.png")
        );
      else
        abilityBg = await Canvas.loadImage(
          path.join(__dirname, "..", "/images/abilityBgSet.png")
        );

      context.drawImage(abilityBg, startingX, startingY + i * toAddY, 500, 50);

      let abilityIcon;

      const largeIcon = await Canvas.loadImage(
        `${process.env.POX_IMG_URL}/images/ability_icons/large/icon_${ability.iconName}.gif`
      ).catch((err) => {
        if (err) {
          console.log("Error finding large icon, will now check for small.");
          console.log(err.message);
        }
      });

      if (!largeIcon)
        abilityIcon = await Canvas.loadImage(
          `${process.env.POX_IMG_URL}/images/ability_icons/small/icon_${ability.iconName}.gif`
        );
      else abilityIcon = largeIcon;

      context.drawImage(
        abilityIcon,
        startingX + 3,
        startingY + 3 + i * toAddY,
        43,
        43
      );
      // 20
      context.font = "bold 11px Arial";
      context.fillStyle = "#a72b2b";
      context.textAlign = "left";
      context.fillText(
        ability.name,
        startingX + 50,
        startingY + 10 + i * toAddY
      );

      context.fillStyle = "#1d4597";
      context.textAlign = "right";
      context.fillText(
        `${ability.noraCost} Nora`,
        startingX + 496,
        startingY + 10 + i * toAddY
      );

      context.fillStyle = "#3c3c3c";
      context.fillText(
        `AP: ${ability.apCost}`,
        startingX + 441,
        startingY + 10 + i * toAddY
      );

      context.fillStyle = "#3c3c3c";
      context.fillText(
        `CD: ${ability.cooldown}`,
        startingX + 386,
        startingY + 10 + i * toAddY
      );

      context.font = "normal 10px Arial";
      context.textAlign = "left";
      context.fillStyle = "#262625";

      const str = removeBrackets(ability.shortDescription);
      wrapText(
        context,
        str,
        startingX + 50,
        startingY + 21 + i * toAddY,
        455,
        12
      );
    }
  },
};
