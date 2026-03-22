import { ActiveMove } from "./Move.mjs";
/** @import { Move, Moves } from "../../../Utils/Type Definitions.mjs" */

const elTemplate = document.getElementById("battlePokeMovesTemplate");

/** Manages movement overlay elements for this pokemon */
export class ActiveMoves extends HTMLElement {

    /** @type {ActiveMove} */
    #moves;

    #movesEl;
    #moveEl = [{}, {}, {}, {}];

    #reveals = [];

    constructor() {

        super();
        const shadow = this.attachShadow({ mode: "open" });
        shadow.appendChild(document.importNode(elTemplate.content, true));

        const el = shadow.getElementById("activeMoveInfo");
        this.#movesEl = el;

        this.#moves = el.querySelectorAll("active-poke-move");

    }

    /**
     * Sets player or enemy status to this element
     *  @param {Boolean} side - True if player, false if enemy
     */
    friendOrFoe(side) {
        for (const moveEl of this.#moves) {
            moveEl.friendOrFoe(side);
        }
    }

    /**
     * @param {Move[]} moves
     * @param {Boolean[]} reveals - Reveals info regardless of current state
     */
    setMoves(moves, reveals = []) {
        for (let i = 0; i < moves.length; i++) {
            this.#moves[i].update(moves[i], reveals[i] || false);
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

        this.setMoves([null, null, null, null], moveReveals);

    }


    /** Reveals all move info */
    revealAll() {
        this.setMoves([null, null, null, null], [true, true, true, true]);
    }


    /** Sets intro animation for this poke */
    showIntro() {

        let aniTime = .4;
        let delTime = .15;

        for (let i = 0; i < this.#moveEl.length; i++) {

            this.#moves[i].showIntro(aniTime, delTime);
            // add an extra delay for the next move
            delTime += .2;

        }

        // this will also fire every time pokemon swaps into combat

    }

    /** Styles movements when poke dies */
    setDed() {
        this.#movesEl.classList.add("pokeDed");
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
            this.style.display = "flex";
            this.#movesEl.classList.add("activeMoveDiv1v1");
            this.#movesEl.classList.remove("activeMoveDiv2v2");
        } else if (num == 2) {
            this.style.display = "flex";
            this.#movesEl.classList.add("activeMoveDiv2v2");
            this.#movesEl.classList.remove("activeMoveDiv1v1");
        } else {
            this.style.display = "none";
        }

    }

    /** Deletes the entirety of this pokemon */
    delet() {
        this.#movesEl.remove();
    }

}

customElements.define("active-poke-moves", ActiveMoves);