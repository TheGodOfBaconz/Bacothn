/* =========================================================
   BACOTHN — MAIN SITE SCRIPT
   ========================================================= */

(() => {
    "use strict";

    /* =====================================================
       CONFIGURATION
    ===================================================== */

    const CONFIG = {
        title: {
            word: "BACOTHN",
            duration: 2000,
            characters: [
                "$",
                "%",
                "#",
                "&",
                "¥",
                "£",
                "€",
                "@",
                "!",
                "?"
            ]
        },

        pages: [
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
        ],

        fallingWords: [
            "Bacothn",
            "Bacon",
            "GOD"
        ],

        fallingWordCount: 20
    };


    /* =====================================================
       UTILITIES
    ===================================================== */

    const $ = (selector, parent = document) =>
        parent.querySelector(selector);


    const $$ = (selector, parent = document) =>
        Array.from(parent.querySelectorAll(selector));


    const sleep = (milliseconds) =>
        new Promise(resolve =>
            setTimeout(resolve, milliseconds)
        );


    const random = (min, max) =>
        Math.random() * (max - min) + min;


    const randomItem = (array) =>
        array[Math.floor(Math.random() * array.length)];


    /* =====================================================
       BACOTHN TITLE GLITCH
    ===================================================== */

    function setupTitleGlitch() {

        const title = $("#bacothn-title");

        if (!title) {
            return;
        }


        const {
            word,
            duration,
            characters
        } = CONFIG.title;


        const randomCharacter = () =>
            randomItem(characters);


        const createScrambledText = (resolvedCount) => {

            let result = "";

            for (
                let index = 0;
                index < word.length;
                index++
            ) {

                result +=
                    index < resolvedCount
                        ? word[index]
                        : randomCharacter();

            }

            return result;

        };


        const animateTitle = async () => {

            title.textContent =
                createScrambledText(0);


            const stepTime =
                duration / word.length;


            for (
                let resolved = 0;
                resolved < word.length;
                resolved++
            ) {

                await sleep(stepTime);


                title.textContent =
                    createScrambledText(
                        resolved + 1
                    );


                title.classList.remove("glitch");


                /*
                    Force a reflow so the glitch
                    animation can restart correctly.
                */

                void title.offsetWidth;


                title.classList.add("glitch");

            }


            title.textContent = word;

            title.classList.remove("glitch");

        };


        animateTitle();

    }


    /* =====================================================
       PAGE DETECTION
    ===================================================== */

    function getCurrentPage() {

        const path =
            window.location.pathname
                .split("/")
                .filter(Boolean)
                .pop()
                ?.toLowerCase();


        if (!path) {
            return "index.html";
        }


        /*
            GitHub Pages can sometimes expose
            paths without the .html extension.
        */

        if (
            path.endsWith(".html")
        ) {
            return path;
        }


        if (
            path === "bacothn"
        ) {
            return "index.html";
        }


        return path;

    }


    /* =====================================================
       PAGES BUTTON
    ===================================================== */

    function createPagesButton() {

        let button =
            $("#pagesButton");


        if (button) {
            return button;
        }


        button =
            document.createElement("button");


        button.id = "pagesButton";

        button.className =
            "page-menu-button";


        button.type = "button";


        button.setAttribute(
            "aria-label",
            "Open pages menu"
        );


        button.setAttribute(
            "aria-expanded",
            "false"
        );


        button.innerHTML = `
            <span
                class="page-menu-button-icon"
                aria-hidden="true"
            >+</span>

            <span>PAGES</span>
        `;


        document.body.appendChild(button);


        return button;

    }


    /* =====================================================
       PAGES DRAWER
    ===================================================== */

    function createPagesMenu() {

        let menu =
            $("#pagesDrawer");


        if (menu) {

            /*
                Ensure the expected class exists
                even when HTML already supplied it.
            */

            menu.classList.add("page-menu");

            return menu;

        }


        menu =
            document.createElement("div");


        menu.id = "pagesDrawer";

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

                <div
                    class="page-menu-scroll"
                    role="region"
                    aria-label="Site pages"
                    tabindex="0"
                >
                    <div class="page-menu-list"></div>
                </div>

            </div>
        `;


        document.body.appendChild(menu);


        return menu;

    }


    /* =====================================================
       BUILD PAGE LINKS
    ===================================================== */

    function buildPagesList(menu) {

        const list =
            $(".page-menu-list", menu);


        if (!list) {
            return;
        }


        list.replaceChildren();


        const currentPage =
            getCurrentPage();


        CONFIG.pages.forEach(page => {

            if (
                page.file.toLowerCase() ===
                currentPage
            ) {
                return;
            }


            const link =
                document.createElement("a");


            link.className =
                "page-menu-link";


            link.href =
                page.file;


            link.textContent =
                page.name;


            list.appendChild(link);

        });

    }


    /* =====================================================
       PAGE MENU STATE
    ===================================================== */

    function setupPagesMenu() {

        const button =
            createPagesButton();


        const menu =
            createPagesMenu();


        buildPagesList(menu);


        let open = false;


        const setButtonState = (isOpen) => {

            button.classList.toggle(
                "active",
                isOpen
            );


            button.setAttribute(
                "aria-expanded",
                String(isOpen)
            );


            button.setAttribute(
                "aria-label",
                isOpen
                    ? "Close pages menu"
                    : "Open pages menu"
            );


            button.innerHTML = isOpen
                ? `
                    <span
                        class="page-menu-button-icon"
                        aria-hidden="true"
                    >×</span>

                    <span>CLOSE</span>
                `
                : `
                    <span
                        class="page-menu-button-icon"
                        aria-hidden="true"
                    >+</span>

                    <span>PAGES</span>
                `;

        };


        const updateState = (isOpen) => {

            open = isOpen;


            menu.classList.toggle(
                "open",
                isOpen
            );


            document.body.classList.toggle(
                "page-menu-open",
                isOpen
            );


            menu.setAttribute(
                "aria-hidden",
                String(!isOpen)
            );


            setButtonState(isOpen);

        };


        const openMenu = () =>
            updateState(true);


        const closeMenu = () =>
            updateState(false);


        const toggleMenu = () =>
            updateState(!open);


        button.addEventListener(
            "click",
            event => {

                event.preventDefault();

                event.stopPropagation();

                toggleMenu();

            }
        );


        menu.addEventListener(
            "click",
            event => {

                /*
                    Allow actual page links to navigate.
                */

                if (
                    event.target.closest(
                        ".page-menu-link"
                    )
                ) {
                    return;
                }


                event.stopPropagation();

            }
        );


        document.addEventListener(
            "click",
            event => {

                if (!open) {
                    return;
                }


                if (
                    button.contains(event.target) ||
                    menu.contains(event.target)
                ) {
                    return;
                }


                closeMenu();

            }
        );


        document.addEventListener(
            "keydown",
            event => {

                if (
                    event.key === "Escape" &&
                    open
                ) {

                    closeMenu();

                    button.focus();

                }

            }
        );


        /*
            Close the drawer after navigation begins.
        */

        $$(".page-menu-link", menu)
            .forEach(link => {

                link.addEventListener(
                    "click",
                    () => closeMenu()
                );

            });


        /*
            Correct initial state.
        */

        updateState(false);

    }


    /* =====================================================
       COPY BUTTONS
    ===================================================== */

    async function copyText(text) {

        if (!text) {
            throw new Error(
                "Nothing to copy."
            );
        }


        /*
            Modern Clipboard API.
        */

        if (
            navigator.clipboard &&
            window.isSecureContext
        ) {

            await navigator.clipboard.writeText(text);

            return;

        }


        /*
            Fallback for browsers/environments
            where Clipboard API isn't available.
        */

        const textarea =
            document.createElement("textarea");


        textarea.value = text;

        textarea.setAttribute(
            "readonly",
            ""
        );


        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        textarea.style.pointerEvents = "none";


        document.body.appendChild(textarea);


        textarea.select();


        const successful =
            document.execCommand("copy");


        textarea.remove();


        if (!successful) {

            throw new Error(
                "Copy operation failed."
            );

        }

    }


    function setupCopyButtons() {

        $$(".copy-button")
            .forEach(button => {

                if (
                    button.dataset.copyInitialized ===
                    "true"
                ) {
                    return;
                }


                button.dataset.copyInitialized =
                    "true";


                button.addEventListener(
                    "click",
                    async () => {

                        const text =
                            button.dataset.copy;


                        if (!text) {
                            return;
                        }


                        if (
                            button.dataset.copyBusy ===
                            "true"
                        ) {
                            return;
                        }


                        button.dataset.copyBusy =
                            "true";


                        const original =
                            button.textContent;


                        try {

                            await copyText(text);


                            button.textContent =
                                "Copied!";


                            button.classList.add(
                                "copied"
                            );


                        } catch (error) {

                            console.error(
                                "BACOTHN copy error:",
                                error
                            );


                            button.textContent =
                                "Copy failed";

                        }


                        window.setTimeout(
                            () => {

                                button.textContent =
                                    original;


                                button.classList.remove(
                                    "copied"
                                );


                                button.dataset.copyBusy =
                                    "false";

                            },
                            1500
                        );

                    }
                );

            });

    }


    /* =====================================================
       FALLING PROFILE WORDS
    ===================================================== */

    function setupFallingBackground() {

        const background =
            $("#falling-background");


        if (!background) {
            return;
        }


        /*
            Respect reduced-motion preferences.
        */

        const reducedMotion =
            window.matchMedia(
                "(prefers-reduced-motion: reduce)"
            ).matches;


        if (reducedMotion) {

            background.replaceChildren();

            return;

        }


        let active = true;


        const createFallingWord = () => {

            if (!active) {
                return;
            }


            const element =
                document.createElement("span");


            element.className =
                "falling-word";


            element.textContent =
                randomItem(
                    CONFIG.fallingWords
                );


            element.style.left =
                `${random(0, 100)}%`;


            const duration =
                random(7, 16);


            element.style.fontSize =
                `${random(10, 26)}px`;


            element.style.animationDuration =
                `${duration}s`;


            element.style.animationDelay =
                `${-random(0, duration)}s`;


            element.style.setProperty(
                "--rotation",
                `${random(-12, 12)}deg`
            );


            background.appendChild(
                element
            );


            element.addEventListener(
                "animationend",
                () => {

                    element.remove();

                    if (active) {
                        createFallingWord();
                    }

                },
                {
                    once: true
                }
            );

        };


        for (
            let index = 0;
            index < CONFIG.fallingWordCount;
            index++
        ) {

            createFallingWord();

        }


        /*
            Stop creating new words if the page
            is being unloaded.
        */

        window.addEventListener(
            "pagehide",
            () => {
                active = false;
            },
            {
                once: true
            }
        );

    }


    /* =====================================================
       PROFILE MUSIC
    ===================================================== */

    function setupProfileMusic() {

        const music =
            $("#profile-music");


        const button =
            $("#music-button");


        const status =
            $("#music-status");


        if (
            !music ||
            !button
        ) {
            return;
        }


        const setMusicUI = (
            label,
            statusText = ""
        ) => {

            button.textContent =
                label;


            if (status) {

                status.textContent =
                    statusText;

            }

        };


        button.addEventListener(
            "click",
            async () => {

                if (music.paused) {

                    try {

                        await music.play();


                        setMusicUI(
                            "Ⅱ PAUSE MUSIC",
                            "playing..."
                        );

                    } catch (error) {

                        console.error(
                            "BACOTHN music error:",
                            error
                        );


                        setMusicUI(
                            "MUSIC UNAVAILABLE",
                            "check the music file"
                        );

                    }

                    return;

                }


                music.pause();


                setMusicUI(
                    "▶ PLAY MUSIC",
                    "paused"
                );

            }
        );


        music.addEventListener(
            "play",
            () => {

                setMusicUI(
                    "Ⅱ PAUSE MUSIC",
                    "playing..."
                );

            }
        );


        music.addEventListener(
            "pause",
            () => {

                if (
                    !music.ended
                ) {

                    setMusicUI(
                        "▶ PLAY MUSIC",
                        "paused"
                    );

                }

            }
        );


        music.addEventListener(
            "ended",
            () => {

                setMusicUI(
                    "▶ PLAY MUSIC",
                    "finished"
                );

            }
        );


        music.addEventListener(
            "error",
            () => {

                setMusicUI(
                    "MUSIC UNAVAILABLE",
                    "check the music file"
                );

            }
        );

    }


    /* =====================================================
       FOOTER YEAR
    ===================================================== */

    function setupFooterYear() {

        const yearElement =
            $("#year");


        if (!yearElement) {
            return;
        }


        yearElement.textContent =
            String(
                new Date().getFullYear()
            );

    }


    /* =====================================================
       INITIALIZATION
    ===================================================== */

    function init() {

        setupTitleGlitch();

        setupPagesMenu();

        setupCopyButtons();

        setupFallingBackground();

        setupProfileMusic();

        setupFooterYear();

    }


    /* =====================================================
       START
    ===================================================== */

    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            init,
            {
                once: true
            }
        );

    } else {

        init();

    }

})();