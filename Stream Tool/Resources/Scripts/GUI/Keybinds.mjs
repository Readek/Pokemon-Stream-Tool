import { pokeFinder } from './Finder/Pokemon Finder.mjs';
import { current } from './Globals.mjs';
import { randomizeAllPokemon } from './Pokemon/TeamPokemons.mjs';

export function loadKeybinds() {

    // enter
    Mousetrap.bind('enter', () => {

        // if a dropdown menu is open, click on the current focus
        if (current.focus > -1) {
            if (pokeFinder.isVisible()) {
                pokeFinder.getFinderEntries()[current.focus].click();
            }
        }

    }, 'keydown');

    // esc
    Mousetrap.bind('esc', () => {
        if (pokeFinder.isVisible()) {
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

    Mousetrap.bind('f6', () => {
        randomizeAllPokemon(); //Useful for testing.
    });
    
}