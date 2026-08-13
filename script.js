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



/* ========================================
   EXISTING PAGE MENU
========================================
   IMPORTANT:
   index.html ALREADY contains:
   #pagesButton
   #pagesDrawer
   #pagesList

   We DO NOT create another menu.
======================================== */

const pagesButton =
    document.getElementById(
        "pagesButton"
    );


const pagesDrawer =
    document.getElementById(
        "pagesDrawer"
    );


if (
    pagesButton &&
    pagesDrawer
) {

    let pagesOpen = false;


    function openPages() {

        pagesOpen = true;


        pagesDrawer.classList.add(
            "open"
        );


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


    function closePages() {

        pagesOpen = false;


        pagesDrawer.classList.remove(
            "open"
        );


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


    pagesButton.addEventListener(
        "click",
        function() {

            if (pagesOpen) {

                closePages();

            } else {

                openPages();

            }

        }
    );


    document.addEventListener(
        "keydown",
        function(event) {

            if (
                event.key === "Escape" &&
                pagesOpen
            ) {

                closePages();

            }

        }
    );


    /*
        Close the menu when clicking
        a page link.
    */

    pagesDrawer
        .querySelectorAll(
            ".page-menu-link"
        )
        .forEach(
            function(link) {

                link.addEventListener(
                    "click",
                    function() {

                        closePages();

                    }
                );

            }
        );


    /*
        Touch / mouse dragging
        for the horizontal page list.
    */

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

                    /* Ignore unsupported pointer capture */

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


        function stopDragging() {

            isDragging = false;


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


                if (!textToCopy) {
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



/* ========================================
   FOOTER YEAR
======================================== */

const yearElement =
    document.getElementById(
        "year"
    );


if (yearElement) {

    yearElement.textContent =
        new Date().getFullYear();

}