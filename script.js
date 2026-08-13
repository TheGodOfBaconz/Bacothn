/* =========================================================
   BACOTHN WEBSITE SCRIPT
   =========================================================

   This file is shared by:
   - index.html
   - profile.html
   - about.html
   - projects.html
   - links.html

   IMPORTANT:
   The page menu already exists in the HTML.
   We DO NOT create another menu here.
========================================================= */


/* =========================================================
   BACOTHN TITLE GLITCH
========================================================= */

const BACOTHN_WORD = "BACOTHN";

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

const titleAnimationTime = 2000;

const titleElement =
    document.getElementById(
        "bacothn-title"
    );


function getRandomGlitchCharacter() {

    const index =
        Math.floor(
            Math.random() *
            glitchCharacters.length
        );

    return glitchCharacters[index];

}


function createScrambledTitle(
    resolvedCharacters
) {

    let result = "";

    for (
        let i = 0;
        i < BACOTHN_WORD.length;
        i++
    ) {

        if (
            i < resolvedCharacters
        ) {

            result +=
                BACOTHN_WORD[i];

        } else {

            result +=
                getRandomGlitchCharacter();

        }

    }

    return result;

}


async function animateBacothnTitle() {

    if (!titleElement) {
        return;
    }


    const stepTime =
        titleAnimationTime /
        BACOTHN_WORD.length;


    titleElement.textContent =
        createScrambledTitle(0);


    for (
        let resolved = 0;
        resolved < BACOTHN_WORD.length;
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


        titleElement.textContent =
            createScrambledTitle(
                resolved + 1
            );


        /*
            Restart the CSS glitch animation.
        */

        titleElement.classList.remove(
            "glitch"
        );


        void titleElement.offsetWidth;


        titleElement.classList.add(
            "glitch"
        );

    }


    titleElement.textContent =
        BACOTHN_WORD;


    titleElement.classList.remove(
        "glitch"
    );

}


animateBacothnTitle();



/* =========================================================
   PAGE MENU
=========================================================

   Your index.html already contains:

   <button id="pagesButton">
   <div id="pagesDrawer">

   The CSS is controlled by:

   body.page-menu-open

   Therefore we use THAT class instead of inventing
   a new ".open" class.
========================================================= */

const pagesButton =
    document.getElementById(
        "pagesButton"
    );


const pagesDrawer =
    document.getElementById(
        "pagesDrawer"
    );


function setPagesButtonClosed() {

    if (!pagesButton) {
        return;
    }


    pagesButton.classList.remove(
        "active"
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


function setPagesButtonOpen() {

    if (!pagesButton) {
        return;
    }


    pagesButton.classList.add(
        "active"
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


function openPageMenu() {

    if (
        !pagesButton ||
        !pagesDrawer
    ) {

        return;

    }


    document.body.classList.add(
        "page-menu-open"
    );


    setPagesButtonOpen();

}


function closePageMenu() {

    if (
        !pagesButton ||
        !pagesDrawer
    ) {

        return;

    }


    document.body.classList.remove(
        "page-menu-open"
    );


    setPagesButtonClosed();

}


function togglePageMenu() {

    if (
        document.body.classList.contains(
            "page-menu-open"
        )
    ) {

        closePageMenu();

    } else {

        openPageMenu();

    }

}


/*
    Only run menu code if the page actually
    contains the menu.
*/

if (
    pagesButton &&
    pagesDrawer
) {

    /*
        Make sure the menu starts closed.
    */

    closePageMenu();


    /*
        Main button.
    */

    pagesButton.addEventListener(
        "click",
        function(event) {

            event.preventDefault();

            event.stopPropagation();

            togglePageMenu();

        }
    );


    /*
        Escape closes the menu.
    */

    document.addEventListener(
        "keydown",
        function(event) {

            if (
                event.key === "Escape"
            ) {

                if (
                    document.body.classList.contains(
                        "page-menu-open"
                    )
                ) {

                    closePageMenu();

                }

            }

        }
    );


    /*
        Close after selecting a page.
    */

    const pageLinks =
        pagesDrawer.querySelectorAll(
            ".page-menu-link"
        );


    pageLinks.forEach(
        function(link) {

            link.addEventListener(
                "click",
                function() {

                    closePageMenu();

                }
            );

        }
    );


    /*
        Optional:
        Clicking outside the drawer closes it.

        We deliberately ignore the page button
        itself because it has its own click handler.
    */

    document.addEventListener(
        "click",
        function(event) {

            if (
                !document.body.classList.contains(
                    "page-menu-open"
                )
            ) {

                return;

            }


            const clickedInsideDrawer =
                pagesDrawer.contains(
                    event.target
                );


            const clickedButton =
                pagesButton.contains(
                    event.target
                );


            if (
                !clickedInsideDrawer &&
                !clickedButton
            ) {

                closePageMenu();

            }

        }
    );


    /* =====================================================
       HORIZONTAL PAGE LIST DRAGGING
    ===================================================== */

    const menuScroll =
        pagesDrawer.querySelector(
            ".page-menu-scroll"
        );


    if (menuScroll) {

        let isDragging = false;

        let startX = 0;

        let startScrollLeft = 0;


        menuScroll.addEventListener(
            "pointerdown",
            function(event) {

                /*
                    Only left mouse button for mouse input.
                    Touch and pen are allowed.
                */

                if (
                    event.pointerType === "mouse" &&
                    event.button !== 0
                ) {

                    return;

                }


                isDragging = true;


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

                } catch (error) {

                    /*
                        Some browsers may not support
                        pointer capture.
                    */

                }

            }
        );


        menuScroll.addEventListener(
            "pointermove",
            function(event) {

                if (!isDragging) {
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


        function stopMenuDragging() {

            if (!isDragging) {
                return;
            }


            isDragging = false;


            menuScroll.classList.remove(
                "dragging"
            );

        }


        menuScroll.addEventListener(
            "pointerup",
            stopMenuDragging
        );


        menuScroll.addEventListener(
            "pointercancel",
            stopMenuDragging
        );


        menuScroll.addEventListener(
            "lostpointercapture",
            stopMenuDragging
        );

    }

}



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


                const originalText =
                    button.textContent;


                try {

                    /*
                        Modern clipboard API.
                    */

                    if (
                        navigator.clipboard &&
                        navigator.clipboard.writeText
                    ) {

                        await navigator.clipboard.writeText(
                            textToCopy
                        );

                    } else {

                        /*
                            Fallback for browsers where
                            navigator.clipboard isn't available.
                        */

                        const temporaryInput =
                            document.createElement(
                                "textarea"
                            );


                        temporaryInput.value =
                            textToCopy;


                        temporaryInput.style.position =
                            "fixed";

                        temporaryInput.style.opacity =
                            "0";

                        temporaryInput.style.pointerEvents =
                            "none";


                        document.body.appendChild(
                            temporaryInput
                        );


                        temporaryInput.focus();

                        temporaryInput.select();


                        document.execCommand(
                            "copy"
                        );


                        temporaryInput.remove();

                    }


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

                    console.error(
                        "Clipboard error:",
                        error
                    );


                    button.textContent =
                        "Copy failed";


                    setTimeout(
                        function() {

                            button.textContent =
                                originalText;

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


function getRandomFallingWord() {

    const index =
        Math.floor(
            Math.random() *
            fallingWords.length
        );


    return fallingWords[index];

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
        getRandomFallingWord();


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

                    console.error(
                        "Music playback error:",
                        error
                    );


                    musicButton.textContent =
                        "MUSIC UNAVAILABLE";


                    if (musicStatus) {

                        musicStatus.textContent =
                            "check music/Var var Bradar.mp3";

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


            if (musicStatus) {

                musicStatus.textContent =
                    "ended";

            }

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