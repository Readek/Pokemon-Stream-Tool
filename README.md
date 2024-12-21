<p align="center">

  <img src="https://github.com/user-attachments/assets/9d63c882-74e6-429e-8554-f4f5cf2a2451" alt="GUI Preview">

</p>

**This project is under active WIP!** Join our [Discord Server](https://discord.gg/Pjput49g42) to stay up to date!

<h1 align="center">Pokemon Stream Tool</h1>

Pokemon ST allows you to manage dynamic overlays with the help of a GUI, with features like:

- Manage your game's info.
  - **Player's party**, with info for nickname, lvl, health values...
  - Your **badges** and stats like Pokemon catched or allied Pokemon deaths.
  - **Enemy data** that gets revealed as the battle goes on.
  - Current **wild encounter** with its possible stats and abilities.
  - Store your **catches** to be displayed on a "Waiting to start" scene.
- **Gen 6/7 auto-update** for player party, badges and enemy data, reading directly from Citra (or Citra-likes).
- No auto for your game? Worry not, everything can be done manually within the GUI.
  - Manual mode supports up to Scarlet/Violet.
- You can use the **included overlays** for OBS with minimal setup, or make your own.
- **Remote GUI** so multiple people on different devices can manage the overlay info at the same time.
- Supports multiple languages!
  - Fully localized: **English**, **Spanish** (ES).
  - Pokemon, Items, Abilities and Move names: **French**, **German**, **Italian**, **Japanese**.
- **Crossplatform** GUI (Windows, Linux), built on Electron.
- Made to be customized! Dive into the folders and modify the entirety of the tool to your heart's content.
- Download it **[right here, right now](https://github.com/Readek/Pokemon-Stream-Tool/releases)**! *No need to join any Discord server.*

The tool comes with pre-made overlays for some games, like:

- X and Y (regular overlay):

![XY Overlay Preview](https://github.com/user-attachments/assets/d0884f72-e1f1-4dcc-bc9b-7d83912ede46)

- X and Y (trainer battle)
  - Enemy info is hidden until the move gets revealed in-game.

![XY Trainer Overlay Preview](https://github.com/user-attachments/assets/0e4f8a8f-b89a-4495-a522-382f0d27831b)

<details><summary>More Screenshots</summary>

- Black and White 2

![BW2 Overlay Preview](https://github.com/user-attachments/assets/a25a1e01-5b84-48d8-8f63-6ea524bf8ccd)


- Omega Ruby and Alpha Saphire

![image](https://github.com/user-attachments/assets/038632ad-a56c-48a6-8dde-d7e8877edb13)


- Stream intro (uses data from your previous catches) (background not included):

https://github.com/user-attachments/assets/43b7bdc7-dc29-482e-ba83-58c9390eeea8

- Trainer battle intro

https://github.com/user-attachments/assets/a936470f-e0ac-49a2-8a95-523d0b9c4a44

</details>


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
