module.exports = {
  getFactionNumber: (factions) => {
    const factionToSend = [];

    for (let i = 0; i < factions.length; i++) {
      switch (factions[i]) {
        case "Forsaken Wastes":
          factionToSend.push("1");
          break;
        case "Forglar Swamp":
          factionToSend.push("6");
          break;
        case "Underdepths":
          factionToSend.push("4");
          break;
        case "Savage Tundra":
          factionToSend.push("7");
          break;
        case "Shattered Peaks":
          factionToSend.push("8");
          break;
        case "Ironfist Stronghold":
          factionToSend.push("3");
          break;
        case "Sundered Lands":
          factionToSend.push("2");
          break;
        case "K'thir Forest":
          factionToSend.push("5");
          break;
      }
    }

    return factionToSend.length > 1
      ? factionToSend.join("_")
      : factionToSend[0];
  },
  getFrameRarity: (rarity) => {
    let val;

    switch (rarity.toLowerCase()) {
      case "uncommon":
        val = "uncom";
        break;
      case "common":
        val = "com";
        break;
      case "rare":
        val = "rare";
        break;
      case "exotic":
        val = "exotic";
        break;
      case "legendary":
        val = "pe";
        break;
      case "limited":
        val = "le";
        break;
      default:
        val = "com";
    }

    return val;
  },
};
