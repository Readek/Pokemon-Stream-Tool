import { getLocalizedPokeText, getLocalizedText } from "../../../Utils/Language.mjs";
import { current } from "../../Globals.mjs";
import { typeToColor } from "../../Type to Color.mjs";
/** @import { Move, PokeType } from "../../../Utils/Type Definitions.mjs" */

const elTemplate = document.getElementById("battlePokeMoveTemplate");

/** Manages this movement's data */
export class ActiveMove extends HTMLElement {

    #player;

    #name = "";
    #pp = -1;
    /** @type {PokeType} */
    #type = "";

    #nameEl;
    #ppEl;

    #mainEl;

    constructor() {

        super();
        const shadow = this.attachShadow({ mode: "open" });
        shadow.appendChild(document.importNode(elTemplate.content, true));

        const el = shadow.getElementById("activeMoveDiv");
        this.#mainEl = el;

        this.#nameEl = el.getElementsByClassName("activeMoveName")[0];
        this.#ppEl = el.getElementsByClassName("activeMovePPNum")[0];

        // initial localized text set
        for (const ppEl of el.getElementsByClassName("activeMovePPText")) {
            ppEl.textContent = getLocalizedText("pokePP");
        }
        
    }

    /**
     * Sets player or enemy status to this element
     *  @param {Boolean} side - True if player, false if enemy
     */
    friendOrFoe(side) {
        this.#player = side;
    }

    showIntro(aniTime, delTime) {
        this.#mainEl.style.animation = `slideIn ${aniTime}s ${delTime}s both`;
    }

    /**
     * @param {Move} move
     * @param {Boolean} reveal - Reveals info regardless of current state
     */
    update(move, reveal) {

        // this is for when we just want to reveal something
        if (!move) move = {name: this.#name, pp: this.#pp, type: this.#type};

        // movement PPs
        if (this.#pp != move.pp || reveal) {
            
            // if enemy and pp were updated, reveal this move
            if (!this.#player && this.#pp > move.pp) {
                reveal = true;
            }

            this.#pp = move.pp;
            this.#ppEl.textContent = move.pp;

            // for enemies, if the move wasn't revealed, hide pps
            // if no move, also hide pps
            if (!this.#player && !reveal || !move.name) {
                this.#mainEl.classList.add("activeMoveHidePP");
            } else {
                this.#mainEl.classList.remove("activeMoveHidePP");
            }

        }
        
        // movement name
        if (move.name != this.#name || reveal) {

            // for enemies, if the move wasn't revealed, display ???
            this.#name = move.name || "???";
            // if no move
            if (move.name == "") move.name = "-";

            const textToDisplay = !this.#player && !reveal ? "???" : move.name;
            this.#nameEl.textContent = getLocalizedPokeText(textToDisplay, "Move", current.generation);
            this.#nameEl.setAttribute("locMove", textToDisplay);

            // for enemies, if the move wasn't revealed, just display Normal colors
            this.#type = move.type;
            const typeCol = !this.#player && !reveal ? "Normal" : move.type;
            const bacCol = `${typeToColor(typeCol)}80`;
            this.#mainEl.style.backgroundColor = bacCol;

        }

    }

}

customElements.define("active-poke-move", ActiveMove);