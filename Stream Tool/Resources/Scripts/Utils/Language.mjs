/** @type {String} Language code */
let lang;

/** Language to use if current language has a missing text */
const fallbackLang = (await import("../../Texts/Lang/EN.mjs")).lang;

/**
 * Sets the language object for this view
 * @param {String} language - Language code (EN, ES...)
 */
export async function setLanguage(language) {
    
    lang = (await import("../../Texts/Lang/"+language+".mjs")).lang;

    resetTexts();

}

/**
 * Gets a text based on currently selected language
 * @param {String} key - Locale text code
 * @param {Array} dyns - Dynamic strings
 * @returns {String} Localized text
 */
export function getLocalizedText(key, dyns = []) {
    
    if (lang && lang[key]) {

        let text = lang[key];
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

    return "((MissingText))";

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
