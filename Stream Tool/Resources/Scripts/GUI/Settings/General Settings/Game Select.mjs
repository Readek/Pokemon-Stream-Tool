import { changeBadges } from "../../Player/Gym Badges.mjs";
import { Setting } from "../Setting.mjs";

const gameSelectSelect = document.getElementById("gameSelect");

const genGameData = {
    5 : [
        {value : "BW", name : "Black & White"},
        {value : "BW2", name : "Black & White 2"}
    ],
    6 : [
        {value : "XY", name : "X & Y"},
        {value : "ORAS", name : "Omega Ruby & Alpha Saphire"}
    ]
}

export class SettingGameSelect extends Setting {

    constructor() {

        super();
        this.#setListener();

    }

    #setListener() {
        gameSelectSelect.addEventListener("change", () => {
            this.setGame(gameSelectSelect.value);
        });
    }

    /**
     * Changes game data to desired generation
     * @param {String} value - Game acronym
     */
    setGame(value) {

        // in case function wasn't triggered by the change event
        gameSelectSelect.value = value;

        // change player badges
        changeBadges(value);

    }

    /**
     * Clears the game list and adds games from provided generation
     * @param {Number} gen - Generation number
     */
    addGames(gen) {

        // clear current game select state
        gameSelectSelect.innerHTML = "";

        // check if gen requested has data
        if (genGameData[gen]) {
        
            // add a new select entry for each game found
            for (let i = 0; i < genGameData[gen].length; i++) {
                this.#addGameEntry(genGameData[gen][i].value, genGameData[gen][i].name);                
            }
            
        }

        // auto-select the first game on the list
        this.setGame(gameSelectSelect.value);

    }

    /**
     * Adds a new entry on the game select combo
     * @param {String} value - Game acronym
     * @param {String} name - Game name
     */
    #addGameEntry(value, name) {

        const entry = document.createElement("option");
        entry.value = value;
        entry.text = name;
        gameSelectSelect.add(entry);

    }

}