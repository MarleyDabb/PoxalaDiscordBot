# Poxnora Discord Bot
Created by lanu/chuckaboo/poxala, written in nodejs.
Message me on discord at lnu if you need assistance setting this up.


## Features
`/find [type] [input]` this command allows you to search for any champion, spell, relic, equipment or champion ability.

`/lookup [input]` this command lets you see what champions have the ability you input.

`/relocation [type]` this command will display a graphic related to the relocation type you input. (manic, knockback, beset/pounce).

`/help` provides helpful information.

## How to setup
To run this locally (which is recommended before purchasing a host) you will need to install nodejs and npm. Once this is done, clone this repo and open it up locally in your IDE. You will then need to get the env variables from the .env.example file and replace the properties with the appropriate values. You should then remove the .example at the end of this files name.

The Discord values can be retrieved by registering a discord bot at the discord developer portal [here](https://discord.com/developers/applications "here").

The other values can be retrieved from the Poxnora API. You will probably need to make modifications to the Poxnora API for this to work correctly.

Once that is done, run `npm install` in your IDEs command terminal. Once that is complete, run `node index.js` in the command terminal and if you have completed the steps above it should run fine.

## Hosting
Hosting this (or any) discord bot will cost money unless you manage to find a service that provides free discord hosting (unlikely from my research but worth looking into). The best discord bot hosting I ended up finding was [Sparked Hosting](https://sparkedhost.com/discord-bot-hosting "Sparked Hosting") which cost $1 per month on their cheapest tier, which should be fine since Poxnoras community is rather small.

Other options include Heroku, Google Cloud, AWS, and probably a lot more.

If the hosting is done directly through using SFTP, you will just need to move all of the files into the SFTP host file manager (filezilla is a good application for doing this). If not, which is usually when hosting through platforms like Google Cloud etc. you will need to pass through the .env variables manually.

## Other
Here is a picture of what this bot would look like in a Discord.
[![PoxalaDiscord](https://i.imgur.com/yby9Irp.png "PoxalaDiscord")](https://i.imgur.com/yby9Irp.png "PoxalaDiscord")



