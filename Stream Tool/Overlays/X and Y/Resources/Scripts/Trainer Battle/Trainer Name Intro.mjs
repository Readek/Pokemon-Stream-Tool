const trainerIntroDiv = document.getElementById("enemyNameIntroDiv");
const titleText = document.getElementById("enemyNameIntroTitle");
const nameText = document.getElementById("enemyNameIntroName");
const countText = document.getElementById("enemyNameIntroPokeCount");

let name = "";
let pokeCount = 0;

/**
 * Changes enemy trainer's name for the battle intro
 * @param {{title: String, name: String}} nameData 
 */
export function setTrainerName(nameData) {

    if (nameData.name == name) return;

    titleText.innerHTML = nameData.title;
    nameText.innerHTML = nameData.name;

}

/** Sets enemy trainer's intro pokemon count */
export function setTrainerPokeCount(num) {
    if (pokeCount == num) return;
    countText.innerHTML = num;
}

/** Display enemy trainer name intro, hides it when done */
export async function showTrainerNameIntro() {

    trainerIntroDiv.style.display = "flex";

    setTimeout(() => {
        trainerIntroDiv.style.display = "none";
    }, 4000);

    await new Promise(resolve => setTimeout(resolve, 3500));

    return;

}
