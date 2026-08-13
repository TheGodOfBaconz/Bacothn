/* =========================================================
   BACOTHN SITE SCRIPT
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

const stepTime =
    totalAnimationTime / word.length;

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
   ========================================================= */

const pageMenuPages = [
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

    let current =
        window.location.pathname
            .split("/")
            .pop()
            .toLowerCase();

    if (!current) {
        current = "index.html";
    }

    return current;

}


function getPageButton() {

    /*
        First use the button already written
        inside the HTML.

        This prevents script.js from creating
        duplicate buttons.
    */

    const existing =
        document.getElementById(
            "pagesButton"
        );

    if (existing) {
        return existing;
    }


    /*
        Compatibility with older pages.
    */

    const oldButton =
        document.getElementById(
            "page-menu-button"
        );

    if (oldButton) {
        return oldButton;
    }


    return null;

}


function getPageDrawer() {

    const existing =
        document.getElementById(
            "pagesDrawer"
        );

    if (existing) {
        return existing;
    }


    const oldDrawer =
        document.getElementById(
            "page-menu"
        );

    if (oldDrawer) {
        return oldDrawer;
    }


    return null;

}


function setupPageMenu() {

    const button =
        getPageButton();

    const drawer =
        getPageDrawer();


    /*
        If this page doesn't have the menu,
        don't break the rest of the site.
    */

    if (
        !button ||
        !drawer
    ) {

        return;

    }


    const currentPage =
        getCurrentPage();


    const list =
        drawer.querySelector(
            "#pagesList, .page-menu-list"
        );


    if (!list) {
        return;
    }


    /*
        Clear dynamically-created links.

        This is safe because the navigation is
        controlled by this script.
    */

    list.innerHTML = "";


    pageMenuPages.forEach(
        function(page) {

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


            if (
                page.url.toLowerCase() ===
                currentPage
            ) {

                link.classList.add(
                    "current"
                );

            }


            list.appendChild(
                link
            );

        }
    );


    /*
        Remove old event handlers by cloning
        the button.

        This prevents multiple listeners if
        the script is loaded more than once.
    */

    const cleanButton =
        button.cloneNode(true);

    button.replaceWith(
        cleanButton
    );


    let menuOpen =
        false;


    function setButton(
        open
    ) {

        if (open) {

            cleanButton.innerHTML = `
                <span class="page-menu-button-icon">
                    ×
                </span>

                <span>
                    CLOSE
                </span>
            `;

        } else {

            cleanButton.innerHTML = `
                <span class="page-menu-button-icon">
                    ☰
                </span>

                <span>
                    PAGES
                </span>
            `;

        }

    }


    function openMenu() {

        menuOpen = true;

        drawer.classList.add(
            "open"
        );

        document.body.classList.add(
            "page-menu-open"
        );

        cleanButton.classList.add(
            "active"
        );

        setButton(true);

    }


    function closeMenu() {

        menuOpen = false;

        drawer.classList.remove(
            "open"
        );

        document.body.classList.remove(
            "page-menu-open"
        );

        cleanButton.classList.remove(
            "active"
        );

        setButton(false);

    }


    cleanButton.addEventListener(
        "click",
        function(event) {

            event.preventDefault();

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
        Clicking outside the drawer closes it.
    */

    document.addEventListener(
        "click",
        function(event) {

            if (!menuOpen) {
                return;
            }


            if (
                cleanButton.contains(
                    event.target
                )
            ) {

                return;

            }


            if (
                drawer.contains(
                    event.target
                )
            ) {

                return;

            }


            closeMenu();

        }
    );


    /*
        Drag scrolling for the menu.
    */

    const scrollArea =
        drawer.querySelector(
            ".page-menu-scroll"
        );


    if (scrollArea) {

        let dragging = false;

        let startX = 0;

        let startScroll = 0;


        scrollArea.addEventListener(
            "pointerdown",
            function(event) {

                dragging = true;

                startX =
                    event.clientX;

                startScroll =
                    scrollArea.scrollLeft;

                scrollArea.classList.add(
                    "dragging"
                );


                try {

                    scrollArea.setPointerCapture(
                        event.pointerId
                    );

                } catch (error) {}

            }
        );


        scrollArea.addEventListener(
            "pointermove",
            function(event) {

                if (!dragging) {
                    return;
                }


                const distance =
                    event.clientX -
                    startX;


                scrollArea.scrollLeft =
                    startScroll -
                    distance;

            }
        );


        function stopDragging() {

            dragging = false;

            scrollArea.classList.remove(
                "dragging"
            );

        }


        scrollArea.addEventListener(
            "pointerup",
            stopDragging
        );


        scrollArea.addEventListener(
            "pointercancel",
            stopDragging
        );

    }

}


setupPageMenu();



/* =========================================================
   COPY BUTTONS
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

                const text =
                    button.dataset.copy;


                if (!text) {
                    return;
                }


                const original =
                    button.textContent;


                try {

                    await navigator
                        .clipboard
                        .writeText(text);


                    button.textContent =
                        "Copied!";

                    button.classList.add(
                        "copied"
                    );


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


                } catch (error) {

                    button.textContent =
                        "Copy failed";


                    setTimeout(
                        function() {

                            button.textContent =
                                original;

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

    return fallingWords[
        Math.floor(
            Math.random() *
            fallingWords.length
        )
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


    element.style.left =
        (
            Math.random() * 100
        ) + "%";


    const duration =
        7 +
        Math.random() * 9;


    element.style.fontSize =
        (
            10 +
            Math.random() * 16
        ) + "px";


    element.style.animationDuration =
        duration + "s";


    element.style.animationDelay =
        (
            -(Math.random() * duration)
        ) + "s";


    element.style.setProperty(
        "--rotation",
        (
            -12 +
            Math.random() * 24
        ) + "deg"
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