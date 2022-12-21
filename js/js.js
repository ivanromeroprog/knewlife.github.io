let data = {
    "results": [
        {
            "gender": "female",
            "name": {
                "title": "Miss",
                "first": "Jennie",
                "last": "Nichols"
            },
            "location": {
                "street": {
                    "number": 8929,
                    "name": "Valwood Pkwy"
                },
                "city": "Billings",
                "state": "Michigan",
                "country": "United States",
                "postcode": "63104",
                "coordinates": {
                    "latitude": "-69.8246",
                    "longitude": "134.8719"
                },
                "timezone": {
                    "offset": "+9:30",
                    "description": "Adelaide, Darwin"
                }
            },
            "email": "jennie.nichols@example.com",
            "login": {
                "uuid": "7a0eed16-9430-4d68-901f-c0d4c1c3bf00",
                "username": "yellowpeacock117",
                "password": "addison",
                "salt": "sld1yGtd",
                "md5": "ab54ac4c0be9480ae8fa5e9e2a5196a3",
                "sha1": "edcf2ce613cbdea349133c52dc2f3b83168dc51b",
                "sha256": "48df5229235ada28389b91e60a935e4f9b73eb4bdb855ef9258a1751f10bdc5d"
            },
            "dob": {
                "date": "1992-03-08T15:13:16.688Z",
                "age": 30
            },
            "registered": {
                "date": "2007-07-09T05:51:59.390Z",
                "age": 14
            },
            "phone": "(272) 790-0888",
            "cell": "(489) 330-2385",
            "id": {
                "name": "SSN",
                "value": "405-88-3636"
            },
            "picture": {
                "large": "https://randomuser.me/api/portraits/men/75.jpg",
                "medium": "https://randomuser.me/api/portraits/med/men/75.jpg",
                "thumbnail": "https://randomuser.me/api/portraits/thumb/men/75.jpg"
            },
            "nat": "US"
        }
    ],
    "info": {
        "seed": "56d27f4a53bd5441",
        "results": 1,
        "page": 1,
        "version": "1.4"
    }
};

//Helper functions
//document.getElementById shortcut
function did(el) {
    return document.getElementById(el);
}

//document.getElementsByClassName shortcut
function dc(el) {
    return document.getElementsByClassName(el);
}

//console.log shortcut
function l(txt) {
    return console.log(txt)
}

//Animate CSS
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


//Functions and events
//TODO: offsets
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

window.addEventListener('load', (e) => {

    //Objects to animate and references
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

    document.addEventListener('scroll',
        (e) => {
            animateOnScroll(domObj.profile, domObj.s1obj, 'fadeInLeft', 'fadeOutLeft',1.5, 100, 50);
            animateOnScroll(domObj.card, domObj.s1obj, 'fadeInRight', 'fadeOutRight',1.5, 100, 50);
            animateOnScroll(domObj.an1obj, domObj.s1obj, 'fadeInLeftBig', 'fadeOutLeft',1, 100, 50);
            animateOnScroll(domObj.an2obj, domObj.s2obj, 'fadeInLeftBig', 'fadeOutLeft', 1, 100, 50);
            animateOnScroll(domObj.an3obj, domObj.s3obj, 'fadeInLeftBig', 'fadeOutLeft',1, 100, 50);
        }
    );
    
    window.location = '#sec1'
})