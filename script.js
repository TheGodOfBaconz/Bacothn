/* =========================================================
   BACOTHN — SITE SCRIPT
   ========================================================= */


/* =========================================================
   BACOTHN TITLE GLITCH
   ========================================================= */

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
const stepTime = totalAnimationTime / word.length;

const title = document.getElementById("bacothn-title");


function randomCharacter() {

    return glitchCharacters[
        Math.floor(
            Math.random() * glitchCharacters.length
        )
    ];

}


function createScrambledText(resolvedCount) {

    let result = "";

    for (
        let i = 0;
        i < word.length;
        i++
    ) {

        if (i < resolvedCount) {

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
            function(resolve) {

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



/* =========================================================
   PAGE MENU
   Uses the HTML menu already present on the page.
   ========================================================= */

const pagesButton =
    document.getElementById(
        "pagesButton"
    );

const pagesDrawer =
    document.getElementById(
        "pagesDrawer"
    );

const pagesList =
    document.getElementById(
        "pagesList"
    );


const sitePages = [
    {
        name: "HOME",
        url: "index.html"
    },

    {
        name: "PROFILE",
        url: "profile.html"
    },

    {
        name: "ABOUT",
        url: "about.html"
    },

    {
        name: "PROJECTS",
        url: "projects.html"
    },

    {
        name: "LINKS",
        url: "links.html"
    },

    {
        name: "GIF CREATOR",
        url: "gif-creator.html"
    }
];


function getCurrentPage() {

    let page =
        window.location.pathname
            .split("/")
            .pop()
            .toLowerCase();

    if (
        !page ||
        page === "/"
    ) {

        page =
            "index.html";

    }

    return page;

}


function initializePageMenu() {

    if (
        !pagesButton ||
        !pagesDrawer
    ) {

        return;

    }


    /*
        Make sure the drawer starts closed.
    */

    pagesDrawer.classList.remove(
        "open"
    );


    pagesDrawer.setAttribute(
        "aria-hidden",
        "true"
    );


    pagesButton.setAttribute(
        "aria-expanded",
        "false"
    );


    /*
        Fill the page list if one exists.
    */

    if (pagesList) {

        const listContainer =
            pagesList.querySelector(
                ".page-menu-list"
            ) || pagesList;


        listContainer.innerHTML = "";


        const currentPage =
            getCurrentPage();


        sitePages.forEach(
            function(page) {

                /*
                    Don't add the current page.
                */

                if (
                    page.url.toLowerCase() ===
                    currentPage
                ) {

                    return;

                }


                const link =
                    document.createElement(
                        "a"
                    );


                link.href =
                    page.url;


                link.className =
                    "page-menu-link";


                link.textContent =
                    page.name;


                listContainer.appendChild(
                    link
                );

            }
        );

    }


    let menuOpen = false;


    function openMenu() {

        menuOpen = true;


        pagesDrawer.classList.add(
            "open"
        );


        pagesDrawer.classList.add(
            "active"
        );


        document.body.classList.add(
            "page-menu-open"
        );


        pagesButton.classList.add(
            "active"
        );


        pagesButton.setAttribute(
            "aria-expanded",
            "true"
        );


        pagesDrawer.setAttribute(
            "aria-hidden",
            "false"
        );


        pagesButton.innerHTML = `
            <span class="page-menu-button-icon">
                ×
            </span>

            <span>
                CLOSE
            </span>
        `;

    }


    function closeMenu() {

        menuOpen = false;


        pagesDrawer.classList.remove(
            "open"
        );


        pagesDrawer.classList.remove(
            "active"
        );


        document.body.classList.remove(
            "page-menu-open"
        );


        pagesButton.classList.remove(
            "active"
        );


        pagesButton.setAttribute(
            "aria-expanded",
            "false"
        );


        pagesDrawer.setAttribute(
            "aria-hidden",
            "true"
        );


        pagesButton.innerHTML = `
            <span class="page-menu-button-icon">
                ☰
            </span>

            <span>
                PAGES
            </span>
        `;

    }


    pagesButton.addEventListener(
        "click",
        function(event) {

            event.preventDefault();

            event.stopPropagation();


            if (menuOpen) {

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
        Don't close when clicking inside
        the actual drawer.
    */

    pagesDrawer.addEventListener(
        "click",
        function(event) {

            event.stopPropagation();

        }
    );


    /*
        Clicking a page closes the drawer.
    */

    pagesDrawer.addEventListener(
        "click",
        function(event) {

            const link =
                event.target.closest(
                    "a"
                );


            if (link) {

                closeMenu();

            }

        }
    );


    /*
        Horizontal drag scrolling.
    */

    const scrollContainer =
        pagesDrawer.querySelector(
            ".page-menu-scroll"
        );


    if (scrollContainer) {

        let dragging = false;
        let startX = 0;
        let startScrollLeft = 0;


        scrollContainer.addEventListener(
            "pointerdown",
            function(event) {

                dragging = true;

                startX =
                    event.clientX;

                startScrollLeft =
                    scrollContainer.scrollLeft;


                scrollContainer.classList.add(
                    "dragging"
                );


                try {

                    scrollContainer.setPointerCapture(
                        event.pointerId
                    );

                } catch (error) {
                    /* Ignore unsupported pointer capture. */
                }

            }
        );


        scrollContainer.addEventListener(
            "pointermove",
            function(event) {

                if (!dragging) {
                    return;
                }


                const distance =
                    event.clientX -
                    startX;


                scrollContainer.scrollLeft =
                    startScrollLeft -
                    distance;

            }
        );


        function stopDragging() {

            dragging = false;

            scrollContainer.classList.remove(
                "dragging"
            );

        }


        scrollContainer.addEventListener(
            "pointerup",
            stopDragging
        );


        scrollContainer.addEventListener(
            "pointercancel",
            stopDragging
        );

    }

}


initializePageMenu();



/* =========================================================
   COPY DISCORD USERNAME
   ========================================================= */

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


                if (!textToCopy) {
                    return;
                }


                try {

                    await navigator.clipboard.writeText(
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


                } catch (error) {

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


const totalFallingWords = 20;


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


if (fallingBackground) {

    for (
        let i = 0;
        i < totalFallingWords;
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
                            "check music file";

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