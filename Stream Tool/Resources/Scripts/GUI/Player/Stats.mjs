const catchesInput = document.getElementById("catchesInput");
const catchesIcon = document.getElementById("statsCatchesIcon");
const deathsInput = document.getElementById("deathsInput");
const deathsIcon = document.getElementById("statsDeathsIcon");

class PlayerStats {

    constructor() {

        // when clicking on stats icon, increase stat by 1, for convenience
        catchesIcon.addEventListener("click", () => {this.setCatches(this.getCatches()+1)});
        deathsIcon.addEventListener("click", () => {this.setDeaths(this.getDeaths()+1)});

    }

    getCatches() {
        return Number(catchesInput.value);
    }
    setCatches(value) {
        catchesInput.value = value;
    }

    getDeaths() {
        return Number(deathsInput.value);
    }
    setDeaths(value) {
        deathsInput.value = value;
    }

}

export const playerStats = new PlayerStats;