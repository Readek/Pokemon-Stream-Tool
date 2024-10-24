<p align="center">

  <img src="https://github.com/Readek/Pokemon-Stream-Tool/blob/main/Github%20Resources/Preview%20GUI.png" alt="GUI Preview">
  
</p>

**This project is under active WIP! Things are usable, but there will be bugs!** Join our [Discord Server](https://discord.gg/Pjput49g42) to stay up to date!

<h1 align="center">Pokemon Stream Tool</h1>

Pokemon ST is a tool that manages dynamic overlays with the help of a GUI, with features like:

- Manage your game's info
  - **Player's party**, with info for nickname, lvl, health values...
  - Your **badges** and stats like Pokemon catched or allied Pokemon deaths.
  - **Enemy data** that gets revealed as the battle goes on.
  - Current **wild encounter** with its possible stats and abilities.
  - Store your **catches** to be displayed on a "Waiting to start" scene.
- **Gen 6 auto-update** for player party and enemy data, reading directly from Citra (or Citra-likes).
  - **Gen 7** is also supported, though it hasn't been tested as much.
- No auto for your game? Worry not, everything can be done manually within the GUI.
- You can use the **included overlays** for OBS with minimal setup, or make your own.
  - Screenshots included below.
- **Remote GUI** so multiple people on different devices can manage the overlay info at the same time.
- Download it [right here, right now](https://github.com/Readek/Pokemon-Stream-Tool/releases)! *No need to join any Discord server.*
- **Crossplatform** GUI (Windows, Linux), built on Electron.
- Made to be customized! Just dive into the folders and modify the entirety of the tool to your heart's content.

For the moment, the tool comes with overlays included for:

- X and Y (regular overlay):

<p align="center">

  <img src="https://github.com/Readek/Pokemon-Stream-Tool/blob/main/Github%20Resources/Preview%20Overlay%20XY.jpg" alt="XY Overlay Preview">
  
</p>

- X and Y (trainer battle)
  - Enemy info is hidden until the move gets revealed in-game.

<p align="center">

  <img src="https://github.com/Readek/Pokemon-Stream-Tool/blob/main/Github%20Resources/Preview%20Overlay%20XY%20Trainer.jpg" alt="XY Trainer Overlay Preview">
  
</p>

- Black and White 2:

<p align="center">

  <img src="https://github.com/Readek/Pokemon-Stream-Tool/blob/main/Github%20Resources/Preview%20Overlay%20BnW2.jpg" alt="BW2 Overlay Preview">
  
</p>

- Stream intro (uses data from your previous catches):

<p align="center">

  <img src="https://github.com/Readek/Pokemon-Stream-Tool/blob/main/Github%20Resources/Preview%20Overlay%20Intro.gif" alt="Intro Overlay Preview">
  
</p>

## How to

There are no public official releases yet, but if you really want to try this out, you can start by getting the [latest dev build](https://github.com/Readek/Pokemon-Stream-Tool/releases).

Once you got the thing downloaded, open the `Stream Tool` folder and simply start the executable, and play around!

To add overlays to your stream, go into the `Stream Tool/Overlays/` folder and select the one you want, then simply drag the `.html` file found on that folder and drop it onto OBS. As long as the GUI is open, everything should be already connected!

Check here to learn how to use the [Remote GUI](https://github.com/Readek/RoA-Stream-Tool/wiki/8.-Remote-GUI).

## Pokémon sprites repo

The overlay uses sprites from Pokémon Showdown, which aren't included in this repo. Instead of depending on Showdown, these are fetched from another repository entirely. The tool will automatically download sprites to be used locally, but if for any reason that fails, you can head over to the resources' [own repository](https://gitlab.com/pokemon-stream-tool/pokemon-stream-tool-assets). More info about assets can be found there.

---

### Used libraries

- [@pkmn](https://github.com/pkmn/ps), main Pokemon data library used.
- [encoding.js](https://github.com/polygonplanet/encoding.js), to translate Unicode to regular text.
- [Mousetrap](https://github.com/ccampbell/mousetrap), to handle some hotkeys.
- [Electron](https://www.electronjs.org/), duh.

### References

- [PokeStreamer Tools](https://github.com/EverOddish/PokeStreamer-Tools) for being the spark that initiated the hard and arduous journey of gen6/7 memory reading.
- [PKM Structure](https://projectpokemon.org/home/docs/gen-6/pkm-structure-xy-r66/) for providing most of gen6 party memory data.
- [Pokelink](https://www.patreon.com/pokelink)'s `Nimbus Fox` for helping me with some gen 6/7 memory addresses making that journey a hell of a lot easier.
- [Bulbapedia](https://bulbapedia.bulbagarden.net/) for providing a list of Pokemon's names, moves, items and abilities in different languages.