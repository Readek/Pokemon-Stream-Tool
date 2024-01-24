<p align="center">

  <img src="https://github.com/Readek/Pokemon-Stream-Tool/blob/main/Github%20Resources/Preview%20GUI.png" alt="GUI Preview">
  
</p>

<h1 align="center">Pokemon Stream Tool</h1>

This repo is under active WIP! Things are usable, although not consumer friendly. But for now, feature list:

- Electron, **crossplatform** GUI (Windows, Linux).
- Fully **open-source**! Download it [right here, right now](https://github.com/Readek/Pokemon-Stream-Tool/archive/refs/heads/master.zip) and modify the tool to your heart's content.
- Manage your active pokemon party (species, nickname, lvl...)
- Manage your player's stats (badges, useless stats...)
- Store your catches to be displayed on a "Waiting to start" scene.
- Display stats for current wild encounter.
- **Gen 6 auto-update** for your current player party, reading directly from Citra.
- All info can be changed manually, with future plans to automate more things.
- **Remote GUI** so multiple people on different devices can manage the overlay info at the same time.
- All scripts can be found outside of executable, so modifying stuff to your liking is ez.

For the moment, the tool has overlays for:

- Black and White 2:

<p align="center">

  <img src="https://github.com/Readek/Pokemon-Stream-Tool/blob/main/Github%20Resources/Preview%20Overlay%20BnW2.jpg" alt="BW2 Overlay Preview">
  
</p>

- X and Y:

<p align="center">

  <img src="https://github.com/Readek/Pokemon-Stream-Tool/blob/main/Github%20Resources/Preview%20Overlay%20XY.jpg" alt="XY Overlay Preview">
  
</p>

## Getting the Pokémon sprites

The overlay needs the gen 5 sprites from Pokémon Showdown, which aren't included in this repo. **The project won't work without these.** You can download them from its [own repository](https://gitlab.com/pokemon-stream-tool/pokemon-stream-tool-assets). More info about assets can be found there.

The directory structure after unzipping or `wget`ting should be:
```text
Stream Tool/Resources/Assets
├── Gender F.png
├── Gender M.png
├── Gender N.png
├── Gym Badges
│   ├── [files]
├── None.png
├── Pokemon
│   ├── sprites
│   │   ├── gen5
│   │   │   ├── [files]
│   │   ├── gen5ani
│   │   │   ├── [files]
│   │   ├── gen5ani-shiny
│   │   │   ├── [files]
│   │   ├── gen5-shiny
│   │   │   ├── [files]
│   │   ├── pokemonicons-sheet.png
├── Shiny Icon.png
├── Type Icons
│   ├── [files]
└── wget_url_list.txt
```
It's fine if there's more files or folders.
