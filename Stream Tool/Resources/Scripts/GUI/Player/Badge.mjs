import { getLocalizedText } from "../../Utils/Language.mjs";
import { current, stPath } from "../Globals.mjs";

export class Badge {

    #value = false;
    #id;
    #badgeType;
    #badgeEl;
    #imgEl;

    /**
     * Creates a new badge button
     * @param {Number} id - Badge number
     * @param {HTMLElement} parentEl - Element to revceive badge button
     * @param {String} badgeType - Name of the badge type (gym by default)
     */
    constructor(id, parentEl, badgeType = "Gym") {

        this.#id = id;
        this.#badgeType = badgeType;

        this.#createElement(parentEl);

    }

    /**
     * Creates a badge button, adding it to the GUI
     * @param {HTMLElement} parentEl - Element to receive badge button
     */
    #createElement(parentEl) {

        // create that badge html
        this.#badgeEl = document.createElement("button");
        this.#badgeEl.classList.add("badgeButton", "badgeDisabled");
        this.#badgeEl.setAttribute("locTitle", `badge${this.#badgeType}Title`);
        this.#badgeEl.setAttribute("title", getLocalizedText(`badge${this.#badgeType}Title`));

        // do something when clicked
        this.#badgeEl.addEventListener("click", () => {this.#toggleBadge()});

        // create an image inside badge button
        this.#imgEl = document.createElement("img");
        if (this.#badgeType == "Gym") {
            this.#imgEl.src = `${stPath.assets}/Badges/${current.generation}/${current.game}`
                + `/${this.#id}.png`;
        } else {
            this.#imgEl.src = `${stPath.assets}/Badges/${current.generation}/${current.game}`
                + `/${this.#badgeType}/${this.#id}.png`;
        }
        this.#badgeEl.appendChild(this.#imgEl);        

        // add it to the GUI
        parentEl.appendChild(this.#badgeEl);

    }

    /** Trues or falses a badge button */
    #toggleBadge() {

        this.#badgeEl.classList.toggle("badgeDisabled");

        this.#value = this.#value ? false : true;

    }

    getValue() {
        return this.#value;
    }

    /** @param {Boolean} value  */
    setValue(value) {

        this.#value = value;

        if (value) {
            this.#badgeEl.classList.remove("badgeDisabled");
        } else {
            this.#badgeEl.classList.add("badgeDisabled");
        }

    }

}