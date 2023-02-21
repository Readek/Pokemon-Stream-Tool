import { pokeFinder } from './Finder/Pokemon Finder.mjs';
import { current, inside } from './Globals.mjs';
import { viewport } from './Viewport.mjs';
import { writeScoreboard } from './Write Scoreboard.mjs';

export function loadKeybinds() {

    // enter
    Mousetrap.bind('enter', () => {

        // if a dropdown menu is open, click on the current focus
        if (current.focus > -1) {
            if (pokeFinder.isVisible()) {
                pokeFinder.getFinderEntries()[current.focus].click();
            }
        } else {
            // update scoreboard info (updates botBar color for visual feedback)
            writeScoreboard();
            document.getElementById('botBar').style.backgroundColor = "var(--bg3)";
        }

    }, 'keydown');
    // when releasing enter, change bottom bar's color back to normal
    Mousetrap.bind('enter', () => {
        document.getElementById('botBar').style.backgroundColor = "var(--bg5)";
    }, 'keyup');

    // esc
    Mousetrap.bind('esc', () => {
        if (inside.settings) {
            viewport.toCenter();
        } else if (pokeFinder.isVisible()) {
            document.activeElement.blur();
        }
    });

    // up/down, to navigate the finders (only when one is shown)
    Mousetrap.bind('down', () => {
        if (pokeFinder.isVisible()) {
            pokeFinder.addActive(true);
        }
    });
    Mousetrap.bind('up', () => {
        if (pokeFinder.isVisible()) {
            pokeFinder.addActive(false);
        }
    });
    
}