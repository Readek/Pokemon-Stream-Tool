/** @typedef {[{name: String, type: String, pp: Number}]} Moves */

import { getLocalizedText } from "../../../../../../Resources/Scripts/Utils/Language.mjs";
import { typeToColor } from "../../Type to Color.mjs";

export class ActiveMoves {

    #player;

    #move = [{}, {}, {}, {}];

    #movesEl;
    #moveEl = [{}, {}, {}, {}];

    #reveals = [];

    /**
     * Manages movement overlay elements for this pokemon
     * @param {Boolean} side - True if player, false if enemy
     * @param {HTMLElement} fullEl - Element to append to
     */
    constructor(side, fullEl) {

        this.#player = side;

        const el = this.#createElement(fullEl);

        this.#movesEl = el;

        const moveNames = el.getElementsByClassName("activeMoveName");
        const moveNums = el.getElementsByClassName("activeMovePPNum");
        const movePPText = el.getElementsByClassName("activeMovePPText");
        for (let i = 0; i < 4; i++) {
            this.#moveEl[i].name = moveNames[i];
            this.#moveEl[i].pp = moveNums[i];
            movePPText[i].innerHTML = getLocalizedText("pokePP");            
        }

    }

    /**
     * Creates element containing main active pokemon info
     * @param {HTMLElement} fullEl - Element to append to
     * @returns {HTMLElement}
     */
    #createElement(fullEl) {

        const element = document.createElement("div");
        element.classList.add("activeMoveInfo");

        // if enemy, the entire element is mirrored
        // this is to flip back things like text so it can be read
        const flipBack = this.#player ? "" : "flipBack";

        // create an element for each move and add it to the main element
        for (let i = 0; i < 4; i++) {
           const moveEl = this.#createMoveElement(flipBack);
           element.appendChild(moveEl);
        }

        // add element to the battle overlay
        fullEl.appendChild(element);

        return element;

    }

    /**
     * Generates a movement HTML element
     * @param {String} flipBack - To flip back an element so it can be read
     * @returns {HTMLElement}
     */
    #createMoveElement(flipBack) {

        const element = document.createElement("div");
        element.classList.add("activeMoveDiv");
        element.innerHTML = `

            <div class="activeMoveName ${flipBack}"></div>
            <div class="activeMoveRight ${flipBack}">
                <div class="activeMovePPNum"></div>
                <div class="activeMovePPText" locText="pokePP"></div>
            </div>

        `

        return element;

    }


    /**
     * @param {Moves} moves
     * @param {Boolean[]} reveals - Reveals info regardless of current state
     */
    setMoves(moves, reveals = []) {

        for (let i = 0; i < moves.length; i++) {

            let reveal = reveals[i] || false;

            // movement pp
            if (this.#move[i].pp != moves[i].pp || reveal) {

                // if enemy and pp were updated, reveal this move
                if (!this.#player && this.#move[i].pp > moves[i].pp) {
                    reveal = true;
                }

                // for enemies, if the move wasn't revealed, display ??
                this.#move[i].pp = moves[i].pp;
                this.#moveEl[i].pp.innerHTML = !this.#player && !reveal ? "??" : moves[i].pp;

            }

            // movement name
            if (moves[i].name != this.#move[i].name || reveal) {

                // for enemies, if the move wasn't revealed, display ???
                this.#move[i].name = moves[i].name;
                this.#moveEl[i].name.innerHTML = !this.#player && !reveal ? "???" : moves[i].name;

                // for enemies, if the move wasn't revealed, just display Normal colors
                this.#move[i].type = moves[i].type;
                const typeCol = !this.#player && !reveal ? "Normal" : moves[i].type;
                const bacCol = `${typeToColor(typeCol)}80`;
                this.#moveEl[i].name.parentElement.style.backgroundColor = bacCol;

            }

        }

    }

    /** @param {String[]} reveals */
    #setReveals(reveals) {

        // no reveals? skip
        if (!reveals) return;

        let diff = false;
        for (let i = 0; i < reveals.length; i++) {
            if (this.#reveals[i] != reveals[i]) {
                diff = true;
            }
        }
        if (!diff) return; // save reveals as last time? skip

        const moveReveals = [false, false, false, false];

        for (let i = 0; i < reveals.length; i++) {
            if (reveals[i].includes("Move")) {
                const moveNum = reveals[i].substring(4);
                moveReveals[moveNum] = true;
            }
        }

        this.setMoves(this.#move, moveReveals);

    }


    /** Reveals all move info */
    revealAll() {
        this.setMoves(this.#move, [true, true, true, true]);
    }

    /**
     * Shows or hides the entire moves element
     * @param {Boolean} show - True to show, false to hide
     */
    displayMoves(show) {

        if (show) {
            this.#movesEl.style.display = "flex";
        } else {
            this.#movesEl.style.display = "none";
        }

    }

    /**
     * @param {Moves} moves
     * @param {String[]} reveals
     */
    update(moves, reveals) {

        this.setMoves(moves);
        this.#setReveals(reveals);

    }

    /**
     * Determines gamemode to shrink or hide movement info
     * @param {Number} num - Number of active pokes on the field
     */
    setGamemode(num) {

        if (num == 1) {
            this.#movesEl.classList.add("activeMoveDiv1v1");
            this.#movesEl.classList.remove("activeMoveDiv2v2", "activeMoveDiv3v3");
        } else if (num == 2) {
            this.#movesEl.classList.add("activeMoveDiv2v2");
            this.#movesEl.classList.remove("activeMoveDiv1v1", "activeMoveDiv3v3");
        } else {
            this.#movesEl.classList.add("activeMoveDiv3v3");
        }



    }

    /** Deletes the entirety of this pokemon */
    delet() {
        this.#movesEl.remove();
    }

}