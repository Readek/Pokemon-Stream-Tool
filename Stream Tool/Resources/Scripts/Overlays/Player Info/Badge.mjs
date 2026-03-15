const badgeTemplate = document.getElementById("badgeTemplate");

class Badge extends HTMLElement {

    #badgeImg;
    #badgeBg;

    constructor() {

        super();
        const template = badgeTemplate.content;
        const shadow = this.attachShadow({ mode: "open" });
        shadow.appendChild(document.importNode(template, true));

        this.#badgeImg = shadow.getElementById("badgeImg");
        this.#badgeBg = shadow.getElementById("badgeBg");

    }

    /**
     * Sets initial image paths for badges
     * @param {Number} badgeNum
     * @param {String} badgeType
     */
    setSrc(badgeNum, badgeType) {
        
        this.#badgeImg.src = this.#badgeImg.src
            .replaceAll("((badgeNum))", badgeNum+1)
            .replaceAll("((badgeType))", badgeType+"/");

        this.#badgeBg.src = this.#badgeBg.src
            .replaceAll("((badgeNum))", badgeNum+1)
            .replaceAll("((badgeType))", badgeType+"/");

        // this is just for manual control by css, like with BW2 overlay
        this.#badgeImg.classList.add("badge" + (badgeNum+1));

    }

    /**
     * Shows or hides badge in overlay
     * @param {Boolean} value - True if the trainer has it
     */
    showHide(value) {
        this.#badgeImg.style.display = value ? "block" : "none";
    }

}

customElements.define("badge-overlay", Badge);