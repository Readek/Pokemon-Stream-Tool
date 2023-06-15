class PlayerStats {

    #catchesInput = document.getElementById("catchesInput");
    #killsInput = document.getElementById("killsInput");
    #deathsInput = document.getElementById("deathsInput");

    getCatches() {
        return this.#catchesInput.value;
    }
    setCatches(value) {
        this.#catchesInput.value = value;
    }

    getKills() {
        return this.#killsInput.value;
    }
    setKills(value) {
        this.#killsInput.value = value;
    }

    getDeaths() {
        return this.#deathsInput.value;
    }
    setDeaths(value) {
        this.#deathsInput.value = value;
    }

}

export const playerStats = new PlayerStats;