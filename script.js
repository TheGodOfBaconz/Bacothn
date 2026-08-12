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
    "*",
    "!"
];

const totalAnimationTime = 2000;

const stepTime =
    totalAnimationTime /
    word.length;


/* ========================================
   BACOTHN TITLE GLITCH
======================================== */

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
   PAGE SLIDE MENU
======================================== */

const pageMenuPages = [
    {
        name: "My Profile",
        url: "profile.html",
        file: "profile.html"
    },

    {
        name: "About",
        url: "about.html",
        file: "about.html"
    },

    {
        name: "Links",
        url: "links.html",
        file: "links.html"
    },

    {
        name: "Projects",
        url: "projects.html",
        file: "projects.html"
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


function createPageMenu() {

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
                EXPLORE
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
        (page) => {

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
        () => {

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
        (event) => {

            if (
                event.key ===
                "Escape" &&
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


    let isDragging =
        false;

    let startX =
        0;

    let startScrollLeft =
        0;


    menuScroll.addEventListener(
        "pointerdown",
        (event) => {

            isDragging =
                true;


            startX =
                event.clientX;


            startScrollLeft =
                menuScroll.scrollLeft;


            menuScroll.classList.add(
                "dragging"
            );


            menuScroll.setPointerCapture(
                event.pointerId
            );

        }
    );


    menuScroll.addEventListener(
        "pointermove",
        (event) => {

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


    menuScroll.addEventListener(
        "pointerleave",
        () => {

            if (
                isDragging
            ) {

                stopDragging();

            }

        }
    );

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
    (button) => {

        button.addEventListener(
            "click",
            async () => {

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
                        () => {

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
                        () => {

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
        () => {

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
        async () => {

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
        () => {

            musicButton.textContent =
                "▶ PLAY MUSIC";

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