class WildPokemon {

    #side = "Front";

    #wildPokeImg = document.getElementById("wildPokeImg");

    #typeDivs = document.getElementsByClassName("vsWildTypeDiv");

    #ratioMaleDiv = document.getElementById("vsWildGenderRatioM");
    #ratioFemaleDiv = document.getElementById("vsWildGenderRatioF");

    #ability0Div = document.getElementById("vsWildAbility0");
    #ability1Div = document.getElementById("vsWildAbility1");
    #abilityHiddenDiv = document.getElementById("vsWildAbilityH");

    #statTextHP = document.getElementById("vsWildStatNumberHP");
    #statTextAT = document.getElementById("vsWildStatNumberAT");
    #statTextDE = document.getElementById("vsWildStatNumberDE");
    #statTextSA = document.getElementById("vsWildStatNumberSA");
    #statTextSD = document.getElementById("vsWildStatNumberSD");
    #statTextSP = document.getElementById("vsWildStatNumberSP");
    #statTextTS = document.getElementById("vsWildStatNumberTS");

    #statMeterHP = document.getElementById("vsWildMeterHP");
    #statMeterAT = document.getElementById("vsWildMeterAT");
    #statMeterDE = document.getElementById("vsWildMeterDE");
    #statMeterSA = document.getElementById("vsWildMeterSA");
    #statMeterSD = document.getElementById("vsWildMeterSD");
    #statMeterSP = document.getElementById("vsWildMeterSP");
    #statMeterTS = document.getElementById("vsWildMeterTS");

    /**
     * Sets src path for the pokemon's image
     * @param {Object} img - Image object
     */
    setImg(img) {
        this.#wildPokeImg.src = img["gen5" + this.#side];
        // TODO offsets
    }

    /**
     * Changes shown type info
     * @param {Array} types - Array of the pokemon's types
     */
    setTypes(types) {
        this.#typeDivs[0].firstElementChild.src = `
            ../../Resources/Assets/Type Icons/${types[0]}.png`;
        this.#typeDivs[0].lastElementChild.innerHTML = types[0];
        if (types[1]) { // only if it has a second type
            this.#typeDivs[1].firstElementChild.src = `
                ../../Resources/Assets/Type Icons/${types[1]}.png`;
            this.#typeDivs[1].lastElementChild.innerHTML = types[1];
            this.#typeDivs[1].style.display = "flex";
        } else { // hide if not
            this.#typeDivs[1].style.display = "none";
        }
    }

    /**
     * Changes shown gender ratio info
     * @param {Number} ratioM - Male Ratio
     * @param {Number} ratioF - Female Ratio
     */
    setGenderRatio(ratioM, ratioF) {
        this.#ratioMaleDiv.innerHTML = `${ratioM * 100}%`;
        this.#ratioFemaleDiv.innerHTML = `${ratioF * 100}%`;
    }

    /**
     * Updates shown ability texts
     * @param {Object} abilities - Object of the pokemon's abilities
     */
    setAbilities(abilities) {

        // we assume a pokemon always has at least 1 ability
        this.#ability0Div.innerHTML = abilities[0];

        // second ability
        if (abilities[1]) {
            this.#ability1Div.innerHTML = abilities[1];
            this.#ability1Div.style.display = "flex";
        } else { // hide if non existant
            this.#ability1Div.style.display = "none";
        }

        // hidden ability
        if (abilities.H) {
            this.#abilityHiddenDiv.innerHTML = abilities.H;
            this.#abilityHiddenDiv.style.display = "flex";
        } else {
            this.#abilityHiddenDiv.style.display = "none";
        }

    }

    /**
     * Updates every stat meter
     * @param {Object} stats - Stats data
     */
    updateMeters(stats) {

        // base stats
        this.#statTextHP.innerHTML = stats.hp;
        this.#statTextAT.innerHTML = stats.atk;
        this.#statTextDE.innerHTML = stats.def;
        this.#statTextSA.innerHTML = stats.spa;
        this.#statTextSD.innerHTML = stats.spd;
        this.#statTextSP.innerHTML = stats.spe;
        this.#statTextTS.innerHTML = stats.bst;

        // we wait a tick so the animation plays when coming from display none
        setTimeout(() => {
            this.#statMeterHP.style.width = this.#calcStatMeter(stats.hp) + "%";
            this.#statMeterAT.style.width = this.#calcStatMeter(stats.atk) + "%";
            this.#statMeterDE.style.width = this.#calcStatMeter(stats.def) + "%";
            this.#statMeterSA.style.width = this.#calcStatMeter(stats.spa) + "%";
            this.#statMeterSD.style.width = this.#calcStatMeter(stats.spd) + "%";
            this.#statMeterSP.style.width = this.#calcStatMeter(stats.spe) + "%";
            this.#statMeterTS.style.width = this.#calcStatMeter(stats.bst, true) + "%";
        }, 0);

    }

    #calcStatMeter(value, total) {

        if (total) {
            return value * 100 / 720 // 680 being max total base stats a pokemon can have
        } else {
            return value * 100 / 230 // 230 being max base stat a pokemon can have
        }

    }

}

export const wildPokemon = new WildPokemon;