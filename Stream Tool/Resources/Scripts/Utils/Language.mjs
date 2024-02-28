/** @type {String} Language code */
let lang;
/** @type {String} View identifier */
let type;

/**
 * Sets the language object for this view
 * @param {String} language - Language code (EN, ES...)
 * @param {String} textType - View that requested language (gui, xy...)
 */
export async function setLanguage(language, textType) {
    
    lang = (await import("../../Texts/Lang/"+language+".mjs")).lang;
    type = textType;

    resetTexts();

}

/**
 * Gets a text based on currently selected language
 * @param {String} key - Locale text code
 * @returns {String} Localized text
 */
export function getLocalizedText(key) {
    
    if (lang[type] && lang[type][key]) {
        return lang[type][key];
    } else {
        return "((MissingText))";
    }

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

}
