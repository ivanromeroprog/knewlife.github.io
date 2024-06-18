/**
 * function to be called when scrolling the page, one call for every object to animate.
 * @param {object} obj object to be animated
 * @param {object} refObj object wich position will be used as a reference to animate in/out obj
 * @param {string} animationIn animate.css animation name to use when the obj appears 
 * @param {string} animationOut animate.css animation name to use when the obj disappears  
 * @param {number} duration duration of animations in secconds 
 * @param {number} offsetIn offset in pixels from the bottom of the viewport to trigger animations
 * @param {number} offsetOut offset in pixels from the top of the viewport to trigger animations
 */
function animateOnScroll(obj, refObj, animationIn, animationOut, duration, offsetIn, offsetOut) {

    let currentPositionBottom = (document.documentElement.scrollTop + window.innerHeight) - offsetIn;
    let currentPositionTop = (document.documentElement.scrollTop) + offsetOut;
    let refObjRect = refObj.getBoundingClientRect();
    let bodyRect = document.body.getBoundingClientRect();
    let refPostionStart = refObjRect.top - bodyRect.top;
    //let refPostionEnd = refPostionStart + refObjRect.height;

    //Set Animation duration
    obj.style.setProperty('--animate-duration', duration + 's');

    //Animate in or out
    if (currentPositionBottom > refPostionStart && currentPositionTop < refPostionStart) {
        if (obj.animatedIn) {
            if (obj.animatedOut && !obj.setTimer) {
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
            if (obj.animateInOnEnd) {
                animateOnScroll(obj, refObj, animationIn, animationOut, duration, offsetIn, offsetOut);
            }
        }, { once: true });
    }
}

/**
 * Animate all objects using animateOnScroll function
 * @param {object} domObj objects to animate
 */
function animateAll(domObj) {
    animateOnScroll(domObj.profile, domObj.s1obj, 'fadeInLeft', 'fadeOutLeft', 1.5, 100, 50);
    animateOnScroll(domObj.card, domObj.s1obj, 'fadeInRight', 'fadeOutRight', 1.5, 100, 50);
    animateOnScroll(domObj.an1obj, domObj.s1obj, 'fadeInLeftBig', 'fadeOutLeft', 1, 100, 50);
    animateOnScroll(domObj.an2obj, domObj.s2obj, 'fadeInLeftBig', 'fadeOutLeft', 1, 100, 50);
    animateOnScroll(domObj.an3obj, domObj.s3obj, 'fadeInLeftBig', 'fadeOutLeft', 1, 100, 50);
    animateOnScroll(domObj.an4obj, domObj.s4obj, 'fadeInLeftBig', 'fadeOutLeft', 1, 100, 50);
    animateOnScroll(domObj.icon1, domObj.iconref, 'backInLeft', 'fadeOutLeft', 1.25, -100, 50);
    animateOnScroll(domObj.icon2, domObj.iconref, 'zoomIn', 'fadeOut', 0.75, -100, 50);
    animateOnScroll(domObj.icon3, domObj.iconref, 'backInRight', 'fadeOutRight', 1.25, -100, 50);
}

/**
 * Returns data necesary to animate objects in the webpage
 * @returns {object} animation data
 */
function getAnimationData(){
    return {
        "profile": did('profile'),
        "card": did('card'),
        "an1obj": did('an1'),
        "s1obj": did('s1'),
        "an2obj": did('an2'),
        "s2obj": did('s2'),
        "an3obj": did('an3'),
        "s3obj": did('s3'),
        "an4obj": did('an4'),
        "s4obj": did('s4'),
        "icon1": did('icon1'),
        "icon2": did('icon2'),
        "icon3": did('icon3'),
        "iconref": did('iconref')
    };
}

/**
 * Load data from json file
 * @param {string} url url of json data
 */
function loadData(url) {

    fetch(url)
        .then(response => response.json())
        .then(data => {
            dataLoadCompleted(data);
        })
        .catch((e) => {
            alert('Error cargando datos.');
        });
}

/**
 * Handler function called when json data is ready
 * @param {object} data json data
 */
function dataLoadCompleted(data) {

    ////////////////////
    //Personal information
    ////////////////////

    new Image().src = data.picture;
    document.title = data.name.last + ", " + data.name.first + ' - ' + 'Curriculum Vitae';
    did('data-name').innerText = did('data-title').innerText = data.name.last + ", " + data.name.first;
    did('data-ocupation').innerText = data.ocupation;
    did('data-description').innerHTML = newlineToParagraph(data.description);
    did('data-picture').src = data.picture;
    did('data-personal').innerHTML =

        'Teléfono: <a class="link-light" href="tel:' + data.cell + '">' + data.cell + '</a>'
        + '<br>' +
        'E-mail: <a class="link-light" href="mailto:' + data.email + '">' + data.email + '</a>'
        + '<br>' +
        data.location.city + ', ' + data.location.state + ', ' + data.location.country
        ;
    did('data-url').href = data.url;

    ////////////////////
    //Experience
    ////////////////////

    //Get template
    const templateExperience = did('data-experience-template').cloneNode(true);
    templateExperience.removeAttribute('id');

    //Get container object
    const dataExperience = did('data-experience');
    let newExp;

    //Clear container object
    let child = dataExperience.lastElementChild;
    while (child) {
        dataExperience.removeChild(child);
        child = dataExperience.lastElementChild;
    }

    //Add data
    data.experience.reverse().forEach(d => {
        newExp = templateExperience.cloneNode(true);
        newExp.getElementsByClassName('data-employer')[0].innerText = d.employer;
        newExp.getElementsByClassName('data-position')[0].innerText = d.position;
        newExp.getElementsByClassName('data-position-description')[0].innerHTML =

            '<strong>Sector</strong>: '
            + '<br>' +
            d.sector
            + '<br>' +
            '<strong>Actividades realizadas:</strong>'
            + '<br>' +
            d.activities
            + '<br>' +
            'Desde ' + d.date_from + ' hasta ' + d.date_to;

        dataExperience.appendChild(newExp);
    });

    ////////////////////
    //Abilities
    ////////////////////

    //Get template
    const templateAbilities = did('data-abilities-template').cloneNode(true);
    templateAbilities.removeAttribute('id');

    //Get container object
    const dataAbilities = did('data-abilities');

    //Clear container object
    child = dataAbilities.lastElementChild;
    while (child) {
        dataAbilities.removeChild(child);
        child = dataAbilities.lastElementChild;
    }

    //Add data
    data.abilities.forEach(d => {
        newExp = templateAbilities.cloneNode(true);
        newExp.getElementsByClassName('data-abilities-title')[0].innerText = d.title;

        let abilitiescontent = '';
        d.list.forEach(le => {
            abilitiescontent +=
                '<h6>' + le.title + '</h6>' +
                newlineToParagraph(le.content);
        });

        newExp.getElementsByClassName('data-abilities-description')[0].innerHTML = abilitiescontent;
        dataAbilities.appendChild(newExp);
    });

    ////////////////////
    //Animations
    ////////////////////
    let domObj = getAnimationData();
    document.addEventListener('scroll',
        (e) => {
            animateAll(domObj);
        }
    );
    animateAll(domObj);
}

//Events
window.addEventListener('load', (e) => {

    //Load data from json file
    loadData('data/data.json');

    //Close nav menu on clic
    const navLinks = document.querySelectorAll('.nav-item');
    const menuToggle = document.getElementById('navbarCollapse');
    const bsCollapse = new bootstrap.Collapse(menuToggle, { "toggle": false });
    navLinks.forEach((l) => {
        l.addEventListener('click', () => {
            if (window.innerWidth < 768)
                bsCollapse.toggle();
        })
    });

});

//Set first anchor immediately
if (window.location.href.indexOf('#') < 0) {
    window.location.href = "#sec1";
    did('sec1').scrollIntoView();
}
