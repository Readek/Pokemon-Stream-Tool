<p align="center">

  <img src="https://github.com/Readek/Pokemon-Stream-Tool/blob/main/Github%20Resources/Preview%20GUI.png" alt="GUI Preview">
  
</p>

**This project is under active WIP! Things are usable, although not consumer friendly.** Join our [Discord Server](https://discord.gg/EX22CTBNrM) to stay up to date!

<h1 align="center">Pokemon Stream Tool</h1>

Pokemon ST is a tool that manages dynamic overlays with the help of a GUI. But what can it really do? Let me show you a feature list:

- Manage your active pokemon party (species, nickname, lvl, health...).
- Manage your player's stats (badges, stats...).
- Display stats for current wild encounter.
- Store your catches to be displayed on a "Waiting to start" scene.
- **Gen 6 auto-update** for your current player party, reading directly from Citra (or Citra-likes).
- **Remote GUI** so multiple people on different devices can manage the overlay info at the same time.
- Download it [right here, right now](https://github.com/Readek/Pokemon-Stream-Tool/archive/refs/heads/master.zip)! No need to join any Discord server.
- **Crossplatform** GUI (Windows, Linux), built on Electron.
- Made to be customized! Just dive into the folders and modify the tool to your heart's content.

For the moment, the tool comes with overlays included for:

- X and Y:

<p align="center">

  <img src="https://github.com/Readek/Pokemon-Stream-Tool/blob/main/Github%20Resources/Preview%20Overlay%20XY.jpg" alt="XY Overlay Preview">
  
</p>

- Black and White 2:

<p align="center">

  <img src="https://github.com/Readek/Pokemon-Stream-Tool/blob/main/Github%20Resources/Preview%20Overlay%20BnW2.jpg" alt="BW2 Overlay Preview">
  
</p>

- Stream intro (uses data from your previous catches):

<p align="center">

  <img src="https://github.com/Readek/Pokemon-Stream-Tool/blob/main/Github%20Resources/Preview%20Overlay%20Intro.jpg" alt="Intro Overlay Preview">
  
</p>

## How to

There are no public official releases yet, but if you really want to try this out, you can start by getting the [latest dev build](https://github.com/Readek/Pokemon-Stream-Tool/archive/refs/heads/master.zip).

Once you got the thing downloaded, open the `Stream Tool` folder and simply start the executable (`.exe` for Windows and `.AppImage` for Linux), and play around!

To add overlays to your stream, go into the `Stream Tool/Overlays/` folder and select the one you want, then simply drag and drop the `.html` file found on that folder onto OBS. As long as the GUI is open, everything should be already connected!

Check here to learn how to use the [Remote GUI](https://github.com/Readek/RoA-Stream-Tool/wiki/8.-Remote-GUI).

## Pokémon sprites repo

The overlay uses sprites from Pokémon Showdown, which aren't included in this repo. Instead of depending on Showdown, these are fetched from another repository entirely. The tool will automatically download sprites to be used locally, but if for any reason that fails, you can head over to the resources' [own repository](https://gitlab.com/pokemon-stream-tool/pokemon-stream-tool-assets). More info about assets can be found there.
