import { ActiveMainInfo } from "./Main Info.mjs";

const playerActiveDiv = document.getElementById("battleActiveBarPlayer");
const enemyActiveDiv = document.getElementById("battleActiveBarEnemy");

export class ActivePokemon {

    #inCombat = false;

    #fullEl;

    #mainInfo;

    /**
     * Manages active combat overlay elements for this pokemon
     * @param {Boolean} side - True if player, false if enemy
     */
    constructor(side) {

        const el = this.#createElement(side);
        this.#fullEl = el;

        this.#mainInfo = new ActiveMainInfo(side, el);

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
        this.#fullEl.style.display = "flex";
    }

    update(data) {

        // if pokemon is not in combat right now, hide it
        if (!data.inCombat) {

            // run only once
            if (this.#inCombat != data.incombat) {
                this.hidePoke();
                this.#inCombat = this.#inCombat;
            }

            return; // if ooc skip everything else

        }

        // first loop in combat, display show animation
        if (this.#inCombat != data.incombat) {
            this.showPoke();
        }

        // send the data to each class
        this.#mainInfo.update(data);

    }

}