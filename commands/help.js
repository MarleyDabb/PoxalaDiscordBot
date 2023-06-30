const { SlashCommandBuilder, bold, hyperlink, quote, inlineCode, userMention } = require("discord.js");


module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Find a list of commands and other helpful information here"),
  async execute(interaction) {
    const str =
      `
:scream_cat: ${bold('WEBSITE')}\nVisit my website ${hyperlink('here', 'https://poxala-fa4ce.web.app/runes')} to get more advanced filtering and more features.\n
:joy_cat: ${bold('COMMANDS')}
${inlineCode('/find')} ${inlineCode('type')} ${inlineCode('input')} - Lets you search for a rune or ability by entering the 'type' (champion, spell, equip, relic, ability) and then your search text.
${inlineCode('/lookup')} ${inlineCode('input')} - Lets you search for all champions that match the ability name you have input. The ability name must match exactly.
${inlineCode('/relocation')} ${inlineCode('type')} - This command will display a graphic which shows how certain interactions will happen with relocation depending on the type (manic, pounce, knockback) you entered.

:joy: :smiling_imp: Discord bot created by ${userMention('264954140713549824')} feel free to give feedback and suggest new ideas :smiling_imp: :joy:
      `

    await interaction.reply({content: str, ephemeral: true})
  }
}