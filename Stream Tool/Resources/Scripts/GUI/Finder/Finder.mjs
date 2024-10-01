import { current } from "../Globals.mjs";

export class Finder {

    /** @protected finderEl */
    _finderEl;
    #list;
    /** @type {HTMLCollection} finderEntries */
    #finderEntries;
    /** @type {HTMLElement} currentCaller */
    #currentCaller;

    /**
     * Popover list that helps you find something
     * @param {HTMLElement} el - Finder element
     */
    constructor(el) {

        this._finderEl = el;
        this.#list = el.getElementsByClassName("searchList")[0];

        // set a listener to clear selected state of last caller when pokeFinder hides
        this._finderEl.addEventListener("toggle", (event) => {
            if (event.newState === "closed") {
                this.#removeSelectorFeedback();
            }
        })

    }

    /**
     * Opens the finder below the element that invoked it
     * @param {HTMLElement} callEl - Element that calls the finder
     */
    open(callEl) {

        // display the finder element
        this._finderEl.showPopover();

        // just in case a selector was clicked but popower was never hidden
        if (this.isVisible()) {
            this.#removeSelectorFeedback();
        }

        // force add visual indicator to caller
        callEl.classList.add("selectorSelected");
        this.#currentCaller = callEl;

        // set up some global variables for other functions
        current.focus = -1;

        // get some data to calculate if it goes offscreen
        const finderPos = this._finderEl.getBoundingClientRect();
        const selectPos = callEl.getBoundingClientRect();

        // move it under the element that called it
        this._finderEl.style.top = selectPos.bottom + "px";
        this._finderEl.style.left = selectPos.left + "px";

        // vertical check
        if (selectPos.y + selectPos.height + finderPos.height > window.innerHeight) {

            // move it to the right side
            this._finderEl.style.left = selectPos.right + "px";
            // vertically adjust
            const offPixels = selectPos.y + finderPos.height - window.innerHeight;
            this._finderEl.style.top = selectPos.top - offPixels - 10 + "px";

        }

    }

    /**
     * Scans for all current entries, then returns them
     * @returns {HTMLCollection}
    */
    getFinderEntries() {
        return this.#finderEntries;
    }

    /**
     * Scans for each entry on this finder and stores them
     * @protected storeFinderEntries
     */
    _storeFinderEntries() {
        this.#finderEntries = this.#list.getElementsByClassName("finderEntry");
    }

    /**
     * Checks for the current finder's display status
     * @returns {Boolean} Visible (true) or not (false)
     */
    isVisible() {
        const displayValue = this._finderEl.matches(':popover-open');
        return (displayValue && this.getFinderEntries().length > 0);
    }

    /** Force hides this finder */
    hide() {
        this._finderEl.hidePopover(false);
    }

    /**
     * Adds a new entry at the end of the finder list
     * @param {HTMLElement} newEl - Element to append to the list
     */
    addEntry(newEl) {
        this.#list.appendChild(newEl);
    }

    /** 
     * Removes all entries on a finder list
     * @protected clearList
     */
    _clearList() {
        this.#list.innerHTML = "";
    }

    
    /**
     * Adds visual feedback to navigate finder lists with the keyboard
     * @param {Boolean} direction - Up (true) or down (false)
     */
    addActive(direction) {

        // this will make our code easier to read
        const entries = this.getFinderEntries();

        // clean up the current active element
        this._removeActiveClass(entries);

        // if true, were going up
        if (direction) {

            // increase that focus
            current.focus++;
            // if end of list, cicle
            if (current.focus >= entries.length) current.focus = 0;

            // search for the next visible entry
            while (current.focus <= entries.length-1) {
                if (entries[current.focus].style.display == "none") {
                    current.focus++;
                } else {
                    break;
                }
            }
            // if we didnt find any, start from 0
            if (current.focus == entries.length) {
                current.focus = 0;
                while (current.focus <= entries.length-1) {
                    if (entries[current.focus].style.display == "none") {
                        current.focus++;
                    } else {
                        break;
                    }
                }
            }
            // if even then we couldnt find a visible entry, set it to invalid
            if (current.focus == entries.length) {
                current.focus = -1;
            }

        } else { // same as above but inverted
            current.focus--;
            if (current.focus < 0) current.focus = (entries.length - 1);
            while (current.focus > -1) {
                if (entries[current.focus].style.display == "none") {
                    current.focus--;
                } else {
                    break;
                }
            }
            if (current.focus == -1) {
                current.focus = entries.length-1;
                while (current.focus > -1) {
                    if (entries[current.focus].style.display == "none") {
                        current.focus--;
                    } else {
                        break;
                    }
                }
            }
            if (current.focus == entries.length) {
                current.focus = -1;
            }
        }

        // if there is a valid entry
        if (current.focus > -1) {
            //add to the selected entry the active class
            entries[current.focus].classList.add("finderEntry-active");
            // make it scroll if it goes out of view
            entries[current.focus].scrollIntoView({block: "center"});
        }
        
    }

    /**
     * Removes visual feedback from a finder list
     * @param {HTMLCollectionOf} entries - All entries from a list
     * @protected removeActiveClass
     */
    _removeActiveClass(entries) {
        for (let i = 0; i < entries.length; i++) {
            entries[i].classList.remove("finderEntry-active");
        }
    }

    /** Removes visual feedback of last called selector */
    #removeSelectorFeedback() {
        if (this.#currentCaller) {
            this.#currentCaller.classList.remove("selectorSelected");
        }
    }

}