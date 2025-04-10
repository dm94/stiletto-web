![GitHub package.json version](https://img.shields.io/github/package-json/v/dm94/stiletto-web)
[![Discord](https://img.shields.io/discord/317737508064591874?color=7289DA&logo=Discord&logoColor=FFFFFF)](https://discord.gg/FcecRtZ)
[![Crowdin](https://badges.crowdin.net/stiletto/localized.svg)](https://crowdin.com/project/stiletto)
[![Website](https://img.shields.io/website?url=https%3A%2F%2Fstiletto.deeme.dev%2F)](https://stiletto.deeme.dev)

---

This project is currently up and running but the intention is to update the vast majority of the code. [More information about the changes](https://github.com/dm94/stiletto-web/issues/93)

---

## Stiletto Web

Web with different utilities for the game Last Oasis, but is not affiliated with [Donkey Crew](https://www.donkey.team/)
It is created with JS (react), HTML, CSS (bootstrap) and Fastify API
You can see this website in operation here: [https://stiletto.deeme.dev](https://stiletto.deeme.dev)

### Working

- Crafting Calculator: See the list of objects and calculate what it costs to do it in different amounts and share it
- Linking the web with discord
- Create clans, edit clans and link them to a discord server
- See the list of walkers of that clan, collected by the discord bot
- Managing clan people
- Sharing maps
- Trading system
- Auction Timers
- Section where to create a list of allies, enemies or NAP
- System to make the web multi-language

#### JSONs

The website uses several json files to read the game data so that it is always up to date. These files can also be used for other projects.

[items_min.json](https://github.com/dm94/stiletto-web/blob/master/public/json/items_min.json) : Here are all the recipes and items in the game including some information such as the cost of learning some recipes or the damage done by some ammunition. Over time I will add more information

[maps.min.json](https://github.com/dm94/stiletto-web/blob/master/public/json/maps.min.json) : List of current game maps

[colors.min.json](https://github.com/dm94/stiletto-web/blob/master/public/json/colors.min.json) : Cost of colours

[markers.min.json](https://github.com/dm94/stiletto-web/blob/master/public/json/markers.min.json) : All markers allowed on the interactive map

#### Environmental variables

- VITE_PUBLIC_URL=https://stiletto.deeme.dev
- VITE_RESOURCES_URL= URL API ADDRESS FOR ICONS AND MAPS
- VITE_API_URL= URL API
- VITE_DISCORD_CLIENT_ID= DISCORD CLIENT ID
- VITE_PLAUSIBLE_URL=PLAUSIBLE URL

#### Generate maps

Library: [gdal2tiles-leaflet](https://github.com/commenthol/gdal2tiles-leaflet)

Command to generate it:
`python gdal2tiles.py -l -p raster -z 0-5 -w none <image> <folder>`

#### API

[stiletto-node-api](https://github.com/dm94/stiletto-node-api)

Old API version:
[Stiletto-PHP-API](https://github.com/dm94/Stiletto-PHP-API)
