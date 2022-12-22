//Helper functions
/**
 * document.getElementById shortcut
 * @param {string} el Element Id
 * @returns {object} element
 */
function did(el) {
    return document.getElementById(el);
}


/**
 * console.log shortcut
 * @param {string} txt Text to be printed to the console
 * @returns void
 */
function l(txt) {
    return console.log(txt)
}

/**
 * Escape special regex characters from string
 * @param {string} str string to escape
 * @returns 
 */
function escapeRegExp(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

/**
 * Replace all ocurences of [find] in [str] with [replace]
 * @param {string} str string in wich the search and replace will be performed
 * @param {string} find text to find
 * @param {string} replace text ro replace [find] ocurrences
 * @returns 
 */
function replaceAll(str, find, replace) {
    return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}




//Animate CSS
/**
 * Trigger a animate.css animation by code.
 * @param {object} element element to animate
 * @param {string} animation animate.css animation name
 * @param {string} prefix animation clasess prefix, default is animate__
 * @returns 
 */
const animateCSS = (element, animation, prefix = 'animate__') =>
    // We create a Promise and return it
    new Promise((resolve, reject) => {
        const animationName = `${prefix}${animation}`;
        const node = element;

        node.classList.add(`${prefix}animated`, animationName);

        // When the animation ends, we clean the classes and resolve the Promise
        function handleAnimationEnd(event) {
            event.stopPropagation();
            node.classList.remove(`${prefix}animated`, animationName);
            resolve('Animation ended');
        }

        node.addEventListener('animationend', handleAnimationEnd, { once: true });
    });