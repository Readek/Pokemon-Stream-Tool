import { locAbilities } from "./Loc Pokemon Strings/Localized Abilites.mjs";
import { locItems } from "./Loc Pokemon Strings/Localized Items.mjs";
import { locMoves } from "./Loc Pokemon Strings/Localized Moves.mjs";

/** Localized strings from current language */
let lang;
/** Language code (EN, ES...) */
let langCode = "EN";

/** Language to use if current language has a missing text */
const fallbackLang = (await import("../../Texts/Lang/EN.mjs")).lang;

/**
 * Sets the language object for this view
 * @param {String} language - Language code (EN, ES...)
 * @param {Number} gen - Current generation
 */
export async function setLanguage(language, gen) {
    
    langCode = language;
    
    lang = (await import("../../Texts/Lang/"+language+".mjs")).lang;

    resetTexts();
    resetPokeLocTexts(gen);

}

/**
 * Gets a text based on currently selected language
 * @param {String} key - Locale text code
 * @param {Array} dyns - Dynamic strings
 * @returns {String} Localized text
 */
export function getLocalizedText(key, dyns = []) {
    
    if (lang && lang[key]) {

        // if we have both an actual lang and the string key matches
        let text = lang[key];
        // dynamically change some text if needed
        for (let i = 0; i < dyns.length; i++) {
            text = text.replace("{" + i + "}", dyns[i]);
        }

        return text;

    } else if (fallbackLang[key]) {

        // if current lang misses a text but fallback lang has it
        let text = fallbackLang[key];
        for (let i = 0; i < dyns.length; i++) {
            text = text.replace("{" + i + "}", dyns[i]);
        }

        return text;

    }

    // if the called string key just doesn't exist
    return "((MissingText))";

}

/**
 * Localizes a string from the pokemon database
 * @param {String} text - Text to localize
 * @param {"Ability" | "Item" | "Move" | "Pokemon"} type - Type of text to localize
 * @param {Number} gen - Current generation
 * @returns {String}
 */
export function getLocalizedPokeText(text, type, gen) {

    // if we're in english just dont bother lmao
    // if text is hidden in battle overlays, skip
    if (langCode == "EN" || !text || text == "???") return text;

    let locsOfType;
    if (type == "Ability") {
        locsOfType = locAbilities;
    } else if (type == "Item") {
        locsOfType = locItems;
    } else if (type == "Move") {
        locsOfType = locMoves;
    } else {
        
    }

    // find a string that matches in english
    for (let i = 0; i < locsOfType.length; i++) {

        if (text == locsOfType[i].EN.name) {

            // see if we got an old string from an old gen
            if (locsOfType[i][langCode].old) {
                const oldString = handleOldLoc(locsOfType[i][langCode].old, gen);
                if (oldString) return oldString;
            }

            // if no old, use localization from last released gen
            return locsOfType[i][langCode].name;

        }

    }

    // if no match, just return original text
    return text;

}

/**
 * Checks if the name has an older localization for current gen
 * @param {String} text - Usually "{name} (Generation III - V)"
 * @param {Number} gen - Current generation
 * @returns {String?}
 */
function handleOldLoc(text, gen) {

    const splitText = text.split(" (");

    // name to be possibly sent
    const oldName = splitText[0];
    // removes "Generation " and final ")", also splits roman nums
    const generationNums = splitText[1].slice(11, -1).split(" - ");

    const firstGen = romanToInt(generationNums[0]);
    const lastGen = romanToInt(generationNums[1]);

    if (gen <= lastGen || gen <= firstGen) {
        return oldName;
    }

}

/**
 * Converts a roman number into a regular number
 * (i just stole this from first google hit honestly)
 * @param {String} roman - Number in roman characters
 * @returns {Number?}
 */
function romanToInt(roman) {
    if (!roman) return;
    const romanNumerals = {I: 1, V: 5, X: 10};
    let result = 0;
    let prevValue = 0;
    for (let i = roman.length - 1; i >= 0; i--) {
        const currentValue = romanNumerals[roman[i]];
        if (currentValue >= prevValue) {
            result += currentValue;
        } else {
            result -= currentValue;
        }
        prevValue = currentValue;
    }
    return result;
}

/** Updates all texts to current language */
function resetTexts() {

    // regular inline text
    const texts = document.querySelectorAll("*[locText]");
    for (const el of texts) {
        el.innerHTML = getLocalizedText(el.getAttribute("locText"));
    }

    // title hover tooltips
    const titles = document.querySelectorAll("*[locTitle]");
    for (const el of titles) {
        el.title = getLocalizedText(el.getAttribute("locTitle"));
    }

    // placeholder texts for inputs
    const pHolders = document.querySelectorAll("*[locPHolder]");
    for (const el of pHolders) {
        el.placeholder = getLocalizedText(el.getAttribute("locPHolder"));
    }

}

/**
 * Updates all localized pokemon strings to current language
 * @param {Number} gen - Current generation
 */
export function resetPokeLocTexts(gen) {
    // localized poke strings
    const pokeKeys = ["Ability", "Item", "Move", "Pokemon"];
    pokeKeys.forEach(key => {
        const els = document.querySelectorAll(`*[loc${key}]`);
        for (const el of els) {
            const textToSet = getLocalizedPokeText(el.getAttribute(`loc${key}`), key, gen);
            el.value = textToSet; // some of them are inputs
            el.innerHTML = textToSet;
        }
    });
}
