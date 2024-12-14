import { ActiveMainInfo } from "./Main Info.mjs";
import { ActiveMoves } from "./Moves.mjs";
/** @import { PokemonSentData } from "../../../Utils/Type Definitions.mjs" */

const playerActiveDiv = document.getElementById("battleActiveBarPlayer");
const enemyActiveDiv = document.getElementById("battleActiveBarEnemy");

export class ActivePokemon {

    #inCombat = true;

    #fullEl;

    #mainInfo;
    #moveInfo;

    /**
     * Manages active combat overlay elements for this pokemon
     * @param {Boolean} side - True if player, false if enemy
     */
    constructor(side) {

        const el = this.#createElement(side);
        this.#fullEl = el;

        this.#mainInfo = new ActiveMainInfo(side, el, this);
        this.#moveInfo = new ActiveMoves(side, el);

    }

    /**
     * Creates element containing all active pokemon info
     * @param {Boolean} side - True if player, false if enemy
     * @returns {HTMLElement}
     */
    #createElement(side) {

        const element = document.createElement("div");
        element.classList.add("activePokemon");

        // add element to the battle overlay
        if (side) {
            playerActiveDiv.appendChild(element);
        } else {
            enemyActiveDiv.appendChild(element);
        }

        return element;

    }

    /** Hides this pokemon's div */
    hidePoke() {
        this.#fullEl.style.display = "none";
    }
    /** Shows this pokemon on the bar */
    showPoke() {
        this.#mainInfo.showIntro();
        this.#fullEl.style.display = "flex";
    }

    /** Sets intro animation for this poke */
    showIntro() {
        this.#mainInfo.showIntro();
        this.#moveInfo.showIntro();
    }

    /** Reveals all hidden enemy info */
    revealAll() {
        this.#moveInfo.revealAll();
    }

    /** Sets styles to elements when poke dies */
    ripPoke() {
        this.#moveInfo.setDed();
    }

    /** @param {PokemonSentData} data  */
    update(data) {

        // if pokemon is not in combat right now, hide it
        if (!data.inCombat) {

            // run only once
            if (this.#inCombat != data.inCombat) {
                this.hidePoke();
                this.#inCombat = data.inCombat;
            }

            return; // if ooc skip everything else

        }

        // first loop in combat, display element
        if (this.#inCombat != data.inCombat) {
            this.showPoke();
            this.#inCombat = data.inCombat;
        }

        // send the data to each class
        this.#mainInfo.update(data);
        this.#moveInfo.update(data.moves, data.reveals);

    }

    /**
     * Determines gamemode to display or hide some poke info
     * @param {Number} num - Number of active pokes on the field
     */
    setGamemode(num) {
        this.#mainInfo.setGamemode(num);
        this.#moveInfo.setGamemode(num);
    }

    /** Deletes the entirety of this pokemon */
    delet() {
        this.#fullEl.remove();
        this.#mainInfo.delet();
        this.#moveInfo.delet();
    }

}