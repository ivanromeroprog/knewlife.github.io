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
 * document.getElementsByClassName shortcut
 * @param {string} el Elements class name
 * @returns {HTMLCollection} elements
 */
function dc(el) {
    return document.getElementsByClassName(el);
}

/**
 * console.log shortcut
 * @param {string} txt Text to be printed to the console
 * @returns void
 */
function l(txt) {
    return console.log(txt)
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


//This project functions
/**
 * function to be called when scrolling the page, one call for every object to animate.
 * @param {*object} obj object to be animated
 * @param {object} refObj object wich position will be used as a reference to animate in/out obj
 * @param {string} animationIn animate.css animation name to use when the obj appears 
 * @param {string} animationOut animate.css animation name to use when the obj disappears  
 * @param {number} duration duration of animations in secconds 
 * @param {number} offsetIn offset in pixels from the bottom of the viewport to trigger animations
 * @param {number} offsetOut offset in pixels from the top of the viewport to trigger animations
 * @returns 
 */
function animateOnScroll(obj, refObj, animationIn, animationOut, duration, offsetIn, offsetOut) {

    let currentPositionBottom = (document.documentElement.scrollTop + window.innerHeight)-offsetIn;
    let currentPositionTop = (document.documentElement.scrollTop)+offsetOut;
    let refObjRect = refObj.getBoundingClientRect();
    let bodyRect = document.body.getBoundingClientRect();
    let refPostionStart = refObjRect.top - bodyRect.top;
    //let refPostionEnd = refPostionStart + refObjRect.height;

    //Set Animation duration
    obj.style.setProperty('--animate-duration', duration + 's');

    //Animate in or out
    if (currentPositionBottom > refPostionStart && currentPositionTop < refPostionStart) {
        if (obj.animatedIn){
            if(obj.animatedOut && !obj.setTimer){
                obj.animateInOnEnd = true;
            }
            return;
        }

        obj.animatedIn = true;
        animateCSS(obj, animationIn);
        obj.style.visibility = 'visible';
    } else {

        if (!obj.animatedIn || obj.animatedOut)
            return;

        obj.animatedOut = true;
        animateCSS(obj, animationOut);
        obj.addEventListener('animationend', () => {
            obj.animatedOut = false;
            obj.animatedIn = false;
            obj.style.visibility = 'hidden';
            if(obj.animateInOnEnd){
                animateOnScroll(obj, refObj, animationIn, animationOut, duration, offsetIn, offsetOut);
            }
        }, { once: true });
    }
}

function animateAll(domObj){
    animateOnScroll(domObj.profile, domObj.s1obj, 'fadeInLeft', 'fadeOutLeft',1.5, 100, 50);
    animateOnScroll(domObj.card, domObj.s1obj, 'fadeInRight', 'fadeOutRight',1.5, 100, 50);
    animateOnScroll(domObj.an1obj, domObj.s1obj, 'fadeInLeftBig', 'fadeOutLeft',1, 100, 50);
    animateOnScroll(domObj.an2obj, domObj.s2obj, 'fadeInLeftBig', 'fadeOutLeft', 1, 100, 50);
    animateOnScroll(domObj.an3obj, domObj.s3obj, 'fadeInLeftBig', 'fadeOutLeft',1, 100, 50);
}

//Events
window.addEventListener('load', (e) => {

    // asd Objects to animate and references
    let domObj = {
        "profile": did('profile'),
        "card": did('card'),
        "an1obj": did('an1'),
        "s1obj": did('s1'),
        "an2obj": did('an2'),
        "s2obj": did('s2'),
        "an3obj": did('an3'),
        "s3obj": did('s3')
    }

    //Call animation on scroll
    document.addEventListener('scroll',
        (e) => {
            animateAll(domObj);
        }
    );

    animateAll(domObj);
})