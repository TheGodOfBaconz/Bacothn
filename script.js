/* ========================================
   BACOTHN WEBSITE SCRIPT
======================================== */


/* ========================================
   BACOTHN TITLE GLITCH
======================================== */

const word = "BACOTHN";

const glitchCharacters = [
    "$",
    "%",
    "#",
    "&",
    "¥",
    "£",
    "€",
    "@",
    "⃁",
    "!"
];

const totalAnimationTime = 2000;

const stepTime =
    totalAnimationTime /
    word.length;


const title =
    document.getElementById(
        "bacothn-title"
    );


function randomCharacter() {

    return glitchCharacters[
        Math.floor(
            Math.random() *
            glitchCharacters.length
        )
    ];

}


function createScrambledText(
    resolvedCount
) {

    let result = "";


    for (
        let i = 0;
        i < word.length;
        i++
    ) {

        if (
            i < resolvedCount
        ) {

            result += word[i];

        } else {

            result += randomCharacter();

        }

    }


    return result;

}


async function animateTitle() {

    if (!title) {

        return;

    }


    title.textContent =
        createScrambledText(0);


    for (
        let resolved = 0;
        resolved < word.length;
        resolved++
    ) {

        await new Promise(
            (resolve) => {

                setTimeout(
                    resolve,
                    stepTime
                );

            }
        );


        title.textContent =
            createScrambledText(
                resolved + 1
            );


        title.classList.remove(
            "glitch"
        );


        void title.offsetWidth;


        title.classList.add(
            "glitch"
        );

    }


    title.textContent =
        word;


    title.classList.remove(
        "glitch"
    );

}


animateTitle();



/* ========================================
   PAGE MENU
======================================== */

/*
    IMPORTANT:

    index.html already contains its own
    page menu:

        #pagesButton
        #pagesDrawer
        #pagesList

    Older versions of this script tried to
    create another menu, which caused the
    menu to duplicate/disappear/break.

    This version first looks for the existing
    menu and uses it.

    If a page doesn't have the existing menu,
    it creates the original dynamic menu.
*/


const pageMenuPages = [

    {
        name: "HOME",
        url: "index.html",
        file: "index.html"
    },

    {
        name: "PROFILE",
        url: "profile.html",
        file: "profile.html"
    },

    {
        name: "ABOUT",
        url: "about.html",
        file: "about.html"
    },

    {
        name: "PROJECTS",
        url: "projects.html",
        file: "projects.html"
    },

    {
        name: "LINKS",
        url: "links.html",
        file: "links.html"
    }

];


function getCurrentPage() {

    let currentPage =
        window.location.pathname
            .split("/")
            .pop()
            .toLowerCase();


    if (
        currentPage === ""
    ) {

        currentPage =
            "index.html";

    }


    return currentPage;

}



/* ========================================
   EXISTING HTML MENU
======================================== */

function setupExistingPageMenu() {

    const menuButton =
        document.getElementById(
            "pagesButton"
        );


    const menu =
        document.getElementById(
            "pagesDrawer"
        );


    if (
        !menuButton ||
        !menu
    ) {

        return false;

    }


    let menuOpen =
        false;


    function openMenu() {

        menuOpen =
            true;


        document.body.classList.add(
            "page-menu-open"
        );


        menuButton.classList.add(
            "active"
        );


        menuButton.innerHTML = `
            <span class="page-menu-button-icon">
                ×
            </span>

            <span>
                CLOSE
            </span>
        `;

    }


    function closeMenu() {

        menuOpen =
            false;


        document.body.classList.remove(
            "page-menu-open"
        );


        menuButton.classList.remove(
            "active"
        );


        menuButton.innerHTML = `
            <span class="page-menu-button-icon">
                ☰
            </span>

            <span>
                PAGES
            </span>
        `;

    }


    menuButton.addEventListener(
        "click",
        function() {

            if (
                menuOpen
            ) {

                closeMenu();

            } else {

                openMenu();

            }

        }
    );


    document.addEventListener(
        "keydown",
        function(event) {

            if (
                event.key === "Escape" &&
                menuOpen
            ) {

                closeMenu();

            }

        }
    );


    /*
        Close menu when clicking a page link.
    */

    menu.querySelectorAll(
        "a"
    ).forEach(
        function(link) {

            link.addEventListener(
                "click",
                function() {

                    closeMenu();

                }
            );

        }
    );


    /*
        Drag-to-scroll support.
    */

    const menuScroll =
        menu.querySelector(
            ".page-menu-scroll"
        );


    if (
        !menuScroll
    ) {

        return true;

    }


    let isDragging =
        false;

    let startX =
        0;

    let startScrollLeft =
        0;


    menuScroll.addEventListener(
        "pointerdown",
        function(event) {

            isDragging =
                true;


            startX =
                event.clientX;


            startScrollLeft =
                menuScroll.scrollLeft;


            menuScroll.classList.add(
                "dragging"
            );


            try {

                menuScroll.setPointerCapture(
                    event.pointerId
                );

            } catch (
                error
            ) {

                /*
                    Some browsers/devices may
                    reject pointer capture.
                    It isn't required for the
                    menu to function.
                */

            }

        }
    );


    menuScroll.addEventListener(
        "pointermove",
        function(event) {

            if (
                !isDragging
            ) {

                return;

            }


            const distance =
                event.clientX -
                startX;


            menuScroll.scrollLeft =
                startScrollLeft -
                distance;

        }
    );


    function stopDragging() {

        if (
            !isDragging
        ) {

            return;

        }


        isDragging =
            false;


        menuScroll.classList.remove(
            "dragging"
        );

    }


    menuScroll.addEventListener(
        "pointerup",
        stopDragging
    );


    menuScroll.addEventListener(
        "pointercancel",
        stopDragging
    );


    menuScroll.addEventListener(
        "pointerleave",
        function() {

            /*
                Don't stop dragging just because
                the pointer temporarily leaves.
                Pointer capture normally handles
                this on supported browsers.
            */

        }
    );


    return true;

}



/* ========================================
   CREATE MENU FOR PAGES WITHOUT ONE
======================================== */

function createPageMenu() {

    /*
        If the current page already has the
        HTML menu, use that instead.
    */

    if (
        setupExistingPageMenu()
    ) {

        return;

    }


    /*
        Don't create a second dynamic menu.
    */

    if (
        document.getElementById(
            "page-menu"
        )
    ) {

        return;

    }


    const currentPage =
        getCurrentPage();


    const menuButton =
        document.createElement(
            "button"
        );


    menuButton.id =
        "page-menu-button";


    menuButton.type =
        "button";


    menuButton.className =
        "page-menu-button";


    menuButton.innerHTML = `
        <span class="page-menu-button-icon">
            ☰
        </span>

        <span class="page-menu-button-text">
            PAGES
        </span>
    `;


    const menu =
        document.createElement(
            "div"
        );


    menu.id =
        "page-menu";


    menu.className =
        "page-menu";


    menu.innerHTML = `
        <div class="page-menu-inner">

            <div class="page-menu-label">
                PAGES
            </div>

            <div
                class="page-menu-scroll"
                id="page-menu-scroll"
            >

                <div
                    class="page-menu-list"
                    id="page-menu-list"
                ></div>

            </div>

        </div>
    `;


    document.body.prepend(
        menuButton
    );


    document.body.prepend(
        menu
    );


    const pageList =
        document.getElementById(
            "page-menu-list"
        );


    pageMenuPages.forEach(
        function(page) {

            if (
                page.file.toLowerCase() ===
                currentPage
            ) {

                return;

            }


            const link =
                document.createElement(
                    "a"
                );


            link.className =
                "page-menu-link";


            link.href =
                page.url;


            link.textContent =
                page.name;


            pageList.appendChild(
                link
            );

        }
    );


    let menuOpen =
        false;


    function openMenu() {

        menuOpen =
            true;


        document.body.classList.add(
            "page-menu-open"
        );


        menuButton.classList.add(
            "active"
        );


        menuButton.innerHTML = `
            <span class="page-menu-button-icon">
                ×
            </span>

            <span class="page-menu-button-text">
                CLOSE
            </span>
        `;

    }


    function closeMenu() {

        menuOpen =
            false;


        document.body.classList.remove(
            "page-menu-open"
        );


        menuButton.classList.remove(
            "active"
        );


        menuButton.innerHTML = `
            <span class="page-menu-button-icon">
                ☰
            </span>

            <span class="page-menu-button-text">
                PAGES
            </span>
        `;

    }


    menuButton.addEventListener(
        "click",
        function() {

            if (
                menuOpen
            ) {

                closeMenu();

            } else {

                openMenu();

            }

        }
    );


    document.addEventListener(
        "keydown",
        function(event) {

            if (
                event.key === "Escape" &&
                menuOpen
            ) {

                closeMenu();

            }

        }
    );


    const menuScroll =
        document.getElementById(
            "page-menu-scroll"
        );


    if (
        menuScroll
    ) {

        let isDragging =
            false;

        let startX =
            0;

        let startScrollLeft =
            0;


        menuScroll.addEventListener(
            "pointerdown",
            function(event) {

                isDragging =
                    true;


                startX =
                    event.clientX;


                startScrollLeft =
                    menuScroll.scrollLeft;


                menuScroll.classList.add(
                    "dragging"
                );


                try {

                    menuScroll.setPointerCapture(
                        event.pointerId
                    );

                } catch (
                    error
                ) {}

            }
        );


        menuScroll.addEventListener(
            "pointermove",
            function(event) {

                if (
                    !isDragging
                ) {

                    return;

                }


                const distance =
                    event.clientX -
                    startX;


                menuScroll.scrollLeft =
                    startScrollLeft -
                    distance;

            }
        );


        function stopDragging() {

            isDragging =
                false;


            menuScroll.classList.remove(
                "dragging"
            );

        }


        menuScroll.addEventListener(
            "pointerup",
            stopDragging
        );


        menuScroll.addEventListener(
            "pointercancel",
            stopDragging
        );

    }

}


createPageMenu();



/* ========================================
   COPY DISCORD USERNAME
======================================== */

const copyButtons =
    document.querySelectorAll(
        ".copy-button"
    );


copyButtons.forEach(
    function(button) {

        button.addEventListener(
            "click",
            async function() {

                const textToCopy =
                    button.dataset.copy;


                if (
                    !textToCopy
                ) {

                    return;

                }


                try {

                    await navigator
                        .clipboard
                        .writeText(
                            textToCopy
                        );


                    const originalText =
                        button.textContent;


                    button.textContent =
                        "Copied!";


                    button.classList.add(
                        "copied"
                    );


                    setTimeout(
                        function() {

                            button.textContent =
                                originalText;


                            button.classList.remove(
                                "copied"
                            );

                        },
                        1500
                    );


                } catch (
                    error
                ) {

                    button.textContent =
                        "Copy failed";


                    setTimeout(
                        function() {

                            button.textContent =
                                "Copy Discord Username";

                        },
                        1500
                    );

                }

            }
        );

    }
);



/* ========================================
   FALLING PROFILE WORDS
======================================== */

const fallingBackground =
    document.getElementById(
        "falling-background"
    );


const fallingWords = [
    "Bacothn",
    "Bacon",
    "GOD"
];


const totalFallingWords =
    20;


function randomFallingWord() {

    const randomIndex =
        Math.floor(
            Math.random() *
            fallingWords.length
        );


    return fallingWords[
        randomIndex
    ];

}


function createFallingWord() {

    if (
        !fallingBackground
    ) {

        return;

    }


    const element =
        document.createElement(
            "span"
        );


    element.className =
        "falling-word";


    element.textContent =
        randomFallingWord();


    const left =
        Math.random() * 100;


    const duration =
        7 +
        Math.random() * 9;


    const delay =
        -(Math.random() * duration);


    const rotation =
        -12 +
        Math.random() * 24;


    const size =
        10 +
        Math.random() * 16;


    element.style.left =
        `${left}%`;


    element.style.fontSize =
        `${size}px`;


    element.style.animationDuration =
        `${duration}s`;


    element.style.animationDelay =
        `${delay}s`;


    element.style.setProperty(
        "--rotation",
        `${rotation}deg`
    );


    fallingBackground.appendChild(
        element
    );


    element.addEventListener(
        "animationend",
        function() {

            element.remove();

            createFallingWord();

        }
    );

}


if (
    fallingBackground
) {

    for (
        let i = 0;
        i < totalFallingWords;
        i++
    ) {

        createFallingWord();

    }

}



/* ========================================
   PROFILE MUSIC
======================================== */

const music =
    document.getElementById(
        "profile-music"
    );


const musicButton =
    document.getElementById(
        "music-button"
    );


const musicStatus =
    document.getElementById(
        "music-status"
    );


if (
    music &&
    musicButton
) {

    musicButton.addEventListener(
        "click",
        async function() {

            if (
                music.paused
            ) {

                try {

                    await music.play();


                    musicButton.textContent =
                        "Ⅱ PAUSE MUSIC";


                    if (
                        musicStatus
                    ) {

                        musicStatus.textContent =
                            "playing...";

                    }


                } catch (
                    error
                ) {

                    musicButton.textContent =
                        "MUSIC UNAVAILABLE";


                    if (
                        musicStatus
                    ) {

                        musicStatus.textContent =
                            "check music/Var var Bradar.mp3";

                    }

                }


            } else {

                music.pause();


                musicButton.textContent =
                    "▶ PLAY MUSIC";


                if (
                    musicStatus
                ) {

                    musicStatus.textContent =
                        "paused";

                }

            }

        }
    );


    music.addEventListener(
        "ended",
        function() {

            musicButton.textContent =
                "▶ PLAY MUSIC";


            if (
                musicStatus
            ) {

                musicStatus.textContent =
                    "ended";

            }

        }
    );

}



/* ========================================
   FOOTER YEAR
======================================== */

const yearElement =
    document.getElementById(
        "year"
    );


if (
    yearElement
) {

    yearElement.textContent =
        new Date().getFullYear();

}