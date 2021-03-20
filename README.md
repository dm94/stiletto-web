## Stiletto Web

Web with different utilities for the game Last Oasis, but is not affiliated with [Donkey Crew](https://www.donkey.team/)
It is created with JS (react), HTML, CSS (bootstrap) and PHP API
You can see this website in operation here: [www.stiletto.live](https://www.stiletto.live/)

### Working

- Crafting Calculator: See the list of objects and calculate what it costs to do it in different amounts and share it
- Linking the web with discord
- Create clans, edit clans and link them to a discord server
- See the list of walkers of that clan, collected by the discord bot
- Managing clan people
- Sharing maps
- Trading system
- Auction Timers
- Quality calculator
- Section where to create a list of allies, enemies or NAP
- System to make the web multi-language
- PWA: Now you can have the website as an application on your mobile phone.
- Light and dark design: Two different designs for you to choose the one you like best

#### JSONs

The website uses several json files to read the game data so that it is always up to date. These files can also be used for other projects.

[items.json](https://github.com/dm94/stiletto-web/blob/master/public/json/items.json) : Here are all the recipes and items in the game including some information such as the cost of learning some recipes or the damage done by some ammunition. Over time I will add more information

[items_min.json](https://github.com/dm94/stiletto-web/blob/master/public/json/items_min.json) : Same as above but minimised to take up less space.

[maps.json](https://github.com/dm94/stiletto-web/blob/master/public/json/maps.json) : List of current game maps

#### Environmental variables

- REACT_APP_API_URL= API ADDRESS
- REACT_APP_DISCORD_CLIENT_ID= DISCORD CLIENT ID
- REACT_APP_API_GENERAL_URL= URL API ADDRESS FOR ICONS AND MAPS
- REACT_APP_GA_ID= Google Analytics ID

#### Generate maps

Library: [gdal2tiles-leaflet](https://github.com/commenthol/gdal2tiles-leaflet)

Command to generate it:
`python gdal2tiles.py -l -p raster -z 0-5 -w none <image> <folder>`

#### API

For now the API will be kept private

#### Others

Everyone is allowed to make, publish & redistribute videos & content about the software.
