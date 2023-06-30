const { inlineCode } = require("discord.js");
module.exports = {
  errorAPIMsg:
    ":hedgehog: The poxnora API is currently having issues, please try again later.",
  noResultsMsg:
    ":otter: No results were found for your input :disappointed_relieved:",
  requestErrMsg: ":swan: There was an error completing this request.",
  fetchingDataMsg: ":snail: Completing your request...",
  buildingRune: ":squid: Building rune...",
  inputErrorMsg: (problem) => {
    return `:otter: There was an error with your input: ${problem}, please run ${inlineCode(
      "/create help"
    )} if you need assistance.`;
  },
};
