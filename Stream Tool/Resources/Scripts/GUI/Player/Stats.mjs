class PlayerStats {

    #catchesInput = document.getElementById("catchesInput");
    #deathsInput = document.getElementById("deathsInput");

    getCatches() {
        return this.#catchesInput.value;
    }
    setCatches(value) {
        this.#catchesInput.value = value;
    }

    getDeaths() {
        return this.#deathsInput.value;
    }
    setDeaths(value) {
        this.#deathsInput.value = value;
    }

}

export const playerStats = new PlayerStats;