/* =========================================================
   BACOTHN TITLE GLITCH
========================================================= */

const word = "BACOTHN";

const glitchCharacters = [
    "$", "%", "#", "&", "¥",
    "£", "€", "@", "!", "?"
];

const title =
    document.getElementById("bacothn-title");


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

        result +=
            i < resolvedCount
                ? word[i]
                : randomCharacter();

    }

    return result;

}


async function animateTitle() {

    if (!title) return;

    const stepTime =
        2000 / word.length;

    title.textContent =
        createScrambledText(0);


    for (
        let resolved = 0;
        resolved < word.length;
        resolved++
    ) {

        await new Promise(
            resolve =>
                setTimeout(
                    resolve,
                    stepTime
                )
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


/* =========================================================
   PAGES MENU
========================================================= */

/*
    These are the site's actual pages.

    The current page is automatically removed
    from the menu.
*/

const pages = [

    {
        name: "HOME",
        file: "index.html"
    },

    {
        name: "PROFILE",
        file: "profile.html"
    },

    {
        name: "ABOUT",
        file: "about.html"
    },

    {
        name: "PROJECTS",
        file: "projects.html"
    },

    {
        name: "LINKS",
        file: "links.html"
    },

    {
        name: "ERROR",
        file: "error.html"
    }

];


/* =========================================================
   CURRENT PAGE
========================================================= */

function getCurrentPage() {

    let path =
        window.location.pathname
            .split("/")
            .pop()
            .toLowerCase();


    /*
        GitHub Pages root:

        /Bacothn/

        has no filename, so it is index.html.
    */

    if (
        !path ||
        path === ""
    ) {

        return "index.html";

    }


    return path;

}


/* =========================================================
   CREATE PAGES BUTTON
========================================================= */

function createPagesButton() {

    let button =
        document.getElementById(
            "pagesButton"
        );


    if (button) {

        return button;

    }


    button =
        document.createElement(
            "button"
        );


    button.id =
        "pagesButton";

    button.className =
        "page-menu-button";

    button.type =
        "button";


    button.setAttribute(
        "aria-label",
        "Open pages menu"
    );


    button.setAttribute(
        "aria-expanded",
        "false"
    );


    button.innerHTML = `
        <span class="page-menu-button-icon">
            +
        </span>

        <span>
            PAGES
        </span>
    `;


    document.body.appendChild(
        button
    );


    return button;

}


/* =========================================================
   CREATE PAGES MENU
========================================================= */

function createPagesMenu() {

    let menu =
        document.getElementById(
            "pagesDrawer"
        );


    if (menu) {

        return menu;

    }


    menu =
        document.createElement(
            "div"
        );


    menu.id =
        "pagesDrawer";

    menu.className =
        "page-menu";


    menu.setAttribute(
        "aria-hidden",
        "true"
    );


    menu.innerHTML = `

        <div class="page-menu-inner">

            <div class="page-menu-label">
                PAGES
            </div>

            <div class="page-menu-list">
            </div>

        </div>

    `;


    document.body.appendChild(
        menu
    );


    return menu;

}


/* =========================================================
   BUILD PAGES
========================================================= */

function buildPagesList(menu) {

    const list =
        menu.querySelector(
            ".page-menu-list"
        );


    if (!list) return;


    list.innerHTML = "";


    const currentPage =
        getCurrentPage();


    pages.forEach(
        function(page) {

            /*
                NEVER show the page
                we're currently on.
            */

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
                page.file;


            link.textContent =
                page.name;


            list.appendChild(
                link
            );

        }
    );

}


/* =========================================================
   SET BUTTON STATE
========================================================= */

function setPagesButtonState(
    button,
    open
) {

    button.classList.toggle(
        "active",
        open
    );


    button.setAttribute(
        "aria-expanded",
        String(open)
    );


    if (open) {

        button.innerHTML = `

            <span class="page-menu-button-icon">
                ×
            </span>

            <span>
                CLOSE
            </span>

        `;

    } else {

        button.innerHTML = `

            <span class="page-menu-button-icon">
                +
            </span>

            <span>
                PAGES
            </span>

        `;

    }

}


/* =========================================================
   PAGE MENU SETUP
========================================================= */

function setupPagesMenu() {

    const button =
        createPagesButton();


    const menu =
        createPagesMenu();


    buildPagesList(
        menu
    );


    let open =
        false;


    function openMenu() {

        open = true;


        menu.classList.add(
            "open"
        );


        button.classList.add(
            "active"
        );


        menu.setAttribute(
            "aria-hidden",
            "false"
        );


        setPagesButtonState(
            button,
            true
        );

    }


    function closeMenu() {

        open = false;


        menu.classList.remove(
            "open"
        );


        button.classList.remove(
            "active"
        );


        menu.setAttribute(
            "aria-hidden",
            "true"
        );


        setPagesButtonState(
            button,
            false
        );

    }


    button.addEventListener(
        "click",
        function(event) {

            event.preventDefault();

            event.stopPropagation();


            if (open) {

                closeMenu();

            } else {

                openMenu();

            }

        }
    );


    menu.addEventListener(
        "click",
        function(event) {

            event.stopPropagation();

        }
    );


    document.addEventListener(
        "click",
        function(event) {

            if (!open) return;


            if (
                button.contains(
                    event.target
                )
            ) {

                return;

            }


            if (
                menu.contains(
                    event.target
                )
            ) {

                return;

            }


            closeMenu();

        }
    );


    document.addEventListener(
        "keydown",
        function(event) {

            if (
                event.key === "Escape" &&
                open
            ) {

                closeMenu();

            }

        }
    );

}


/*
    Run after the page exists.
*/

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        setupPagesMenu
    );

} else {

    setupPagesMenu();

}


/* =========================================================
   COPY BUTTONS
========================================================= */

document
    .querySelectorAll(
        ".copy-button"
    )
    .forEach(
        function(button) {

            button.addEventListener(
                "click",
                async function() {

                    const text =
                        button.dataset.copy;


                    if (!text) return;


                    const original =
                        button.textContent;


                    try {

                        await navigator
                            .clipboard
                            .writeText(
                                text
                            );


                        button.textContent =
                            "Copied!";


                        button.classList.add(
                            "copied"
                        );


                    } catch (error) {

                        button.textContent =
                            "Copy failed";

                    }


                    setTimeout(
                        function() {

                            button.textContent =
                                original;


                            button.classList.remove(
                                "copied"
                            );

                        },
                        1500
                    );

                }
            );

        }
    );


/* =========================================================
   FALLING PROFILE WORDS
========================================================= */

const fallingBackground =
    document.getElementById(
        "falling-background"
    );


const fallingWords = [
    "Bacothn",
    "Bacon",
    "GOD"
];


function createFallingWord() {

    if (!fallingBackground) {
        return;
    }


    const element =
        document.createElement(
            "span"
        );


    element.className =
        "falling-word";


    element.textContent =
        fallingWords[
            Math.floor(
                Math.random() *
                fallingWords.length
            )
        ];


    element.style.left =
        Math.random() * 100 +
        "%";


    const duration =
        7 +
        Math.random() * 9;


    element.style.fontSize =
        10 +
        Math.random() * 16 +
        "px";


    element.style.animationDuration =
        duration +
        "s";


    element.style.animationDelay =
        -(Math.random() * duration) +
        "s";


    element.style.setProperty(
        "--rotation",
        -12 +
        Math.random() * 24 +
        "deg"
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


if (fallingBackground) {

    for (
        let i = 0;
        i < 20;
        i++
    ) {

        createFallingWord();

    }

}


/* =========================================================
   PROFILE MUSIC
========================================================= */

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

            if (music.paused) {

                try {

                    await music.play();


                    musicButton.textContent =
                        "Ⅱ PAUSE MUSIC";


                    if (musicStatus) {

                        musicStatus.textContent =
                            "playing...";

                    }


                } catch (error) {

                    musicButton.textContent =
                        "MUSIC UNAVAILABLE";


                    if (musicStatus) {

                        musicStatus.textContent =
                            "check the music file";

                    }

                }


            } else {

                music.pause();


                musicButton.textContent =
                    "▶ PLAY MUSIC";


                if (musicStatus) {

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

        }
    );

}


/* =========================================================
   FOOTER YEAR
========================================================= */

const yearElement =
    document.getElementById(
        "year"
    );


if (yearElement) {

    yearElement.textContent =
        new Date().getFullYear();

}