/* =========================================================
   BACOTHN TITLE GLITCH
   ========================================================= */

const word = "BACOTHN";
const glitchCharacters = ["$", "%", "#", "&", "¥", "£", "€", "@", "!", "?"];
const title = document.getElementById("bacothn-title");

function randomCharacter() {
    return glitchCharacters[Math.floor(Math.random() * glitchCharacters.length)];
}

function createScrambledText(resolvedCount) {
    let result = "";

    for (let i = 0; i < word.length; i++) {
        result += i < resolvedCount ? word[i] : randomCharacter();
    }

    return result;
}

async function animateTitle() {
    if (!title) return;

    const stepTime = 2000 / word.length;
    title.textContent = createScrambledText(0);

    for (let resolved = 0; resolved < word.length; resolved++) {
        await new Promise(resolve => setTimeout(resolve, stepTime));

        title.textContent = createScrambledText(resolved + 1);

        title.classList.remove("glitch");
        void title.offsetWidth;
        title.classList.add("glitch");
    }

    title.textContent = word;
    title.classList.remove("glitch");
}

animateTitle();


/* =========================================================
   PAGES MENU
   ========================================================= */

const pages = [
    { name: "HOME", file: "index.html" },
    { name: "PROFILE", file: "profile.html" },
    { name: "ABOUT", file: "about.html" },
    { name: "PROJECTS", file: "projects.html" },
    { name: "LINKS", file: "links.html" },
    { name: "ERROR", file: "error.html" }
];

function getCurrentPage() {
    let page = window.location.pathname.split("/").pop().toLowerCase();

    // GitHub Pages root = index.html
    if (!page || page === "") {
        page = "index.html";
    }

    return page;
}

function setupPagesMenu() {
    /*
     * Create the button if it doesn't already exist.
     * This makes it appear on index.html and every other page.
     */
    let button = document.getElementById("pagesButton");

    if (!button) {
        button = document.createElement("button");

        button.id = "pagesButton";
        button.className = "page-menu-button";
        button.type = "button";

        button.innerHTML = `
            <span class="page-menu-button-icon">☰</span>
            <span>PAGES</span>
        `;

        document.body.appendChild(button);
    }

    /*
     * Create the menu if it doesn't already exist.
     */
    let menu = document.getElementById("pagesDrawer");

    if (!menu) {
        menu = document.createElement("div");

        menu.id = "pagesDrawer";
        menu.className = "page-menu";

        menu.innerHTML = `
            <div class="page-menu-inner">
                <div class="page-menu-label">PAGES</div>
                <div class="page-menu-scroll">
                    <div class="page-menu-list"></div>
                </div>
            </div>
        `;

        document.body.appendChild(menu);
    }

    const list = menu.querySelector(".page-menu-list");
    const currentPage = getCurrentPage();

    /*
     * IMPORTANT:
     * Clear the menu before rebuilding it.
     * This prevents duplicate pages.
     */
    list.innerHTML = "";

    /*
     * Add every HTML page EXCEPT the one currently open.
     */
    pages.forEach(page => {
        if (page.file.toLowerCase() === currentPage) {
            return;
        }

        const link = document.createElement("a");

        link.className = "page-menu-link";
        link.href = page.file;
        link.textContent = page.name;

        list.appendChild(link);
    });

    let menuOpen = false;

    function openMenu() {
        menuOpen = true;

        menu.classList.add("open");
        button.classList.add("active");

        button.setAttribute("aria-expanded", "true");
        menu.setAttribute("aria-hidden", "false");

        button.innerHTML = `
            <span class="page-menu-button-icon">×</span>
            <span>CLOSE</span>
        `;
    }

    function closeMenu() {
        menuOpen = false;

        menu.classList.remove("open");
        button.classList.remove("active");

        button.setAttribute("aria-expanded", "false");
        menu.setAttribute("aria-hidden", "true");

        button.innerHTML = `
            <span class="page-menu-button-icon">☰</span>
            <span>PAGES</span>
        `;
    }

    /*
     * Prevent multiple click handlers from being added.
     */
    button.onclick = function(event) {
        event.preventDefault();
        event.stopPropagation();

        if (menuOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    };

    /*
     * Don't let clicking inside the menu immediately close it.
     */
    menu.onclick = function(event) {
        event.stopPropagation();
    };

    /*
     * Close when clicking outside.
     */
    document.addEventListener("click", function(event) {
        if (!menuOpen) return;

        if (
            !button.contains(event.target) &&
            !menu.contains(event.target)
        ) {
            closeMenu();
        }
    });

    /*
     * ESC closes the menu.
     */
    document.addEventListener("keydown", function(event) {
        if (event.key === "Escape" && menuOpen) {
            closeMenu();
        }
    });
}

setupPagesMenu();


/* =========================================================
   COPY BUTTONS
   ========================================================= */

document.querySelectorAll(".copy-button").forEach(button => {
    button.addEventListener("click", async () => {
        const text = button.dataset.copy;

        if (!text) return;

        const original = button.textContent;

        try {
            await navigator.clipboard.writeText(text);

            button.textContent = "Copied!";
            button.classList.add("copied");
        } catch (error) {
            button.textContent = "Copy failed";
        }

        setTimeout(() => {
            button.textContent = original;
            button.classList.remove("copied");
        }, 1500);
    });
});


/* =========================================================
   FALLING PROFILE WORDS
   ========================================================= */

const fallingBackground = document.getElementById("falling-background");

const fallingWords = [
    "Bacothn",
    "Bacon",
    "GOD"
];

function createFallingWord() {
    if (!fallingBackground) return;

    const element = document.createElement("span");

    element.className = "falling-word";
    element.textContent =
        fallingWords[Math.floor(Math.random() * fallingWords.length)];

    element.style.left = Math.random() * 100 + "%";

    const duration = 7 + Math.random() * 9;

    element.style.fontSize =
        10 + Math.random() * 16 + "px";

    element.style.animationDuration =
        duration + "s";

    element.style.animationDelay =
        -(Math.random() * duration) + "s";

    element.style.setProperty(
        "--rotation",
        -12 + Math.random() * 24 + "deg"
    );

    fallingBackground.appendChild(element);

    element.addEventListener("animationend", () => {
        element.remove();
        createFallingWord();
    });
}

if (fallingBackground) {
    for (let i = 0; i < 20; i++) {
        createFallingWord();
    }
}


/* =========================================================
   PROFILE MUSIC
   ========================================================= */

const music = document.getElementById("profile-music");
const musicButton = document.getElementById("music-button");
const musicStatus = document.getElementById("music-status");

if (music && musicButton) {

    musicButton.addEventListener("click", async () => {

        if (music.paused) {

            try {
                await music.play();

                musicButton.textContent = "Ⅱ PAUSE MUSIC";

                if (musicStatus) {
                    musicStatus.textContent = "playing...";
                }

            } catch (error) {

                musicButton.textContent = "MUSIC UNAVAILABLE";

                if (musicStatus) {
                    musicStatus.textContent = "check the music file";
                }
            }

        } else {

            music.pause();

            musicButton.textContent = "▶ PLAY MUSIC";

            if (musicStatus) {
                musicStatus.textContent = "paused";
            }
        }
    });

    music.addEventListener("ended", () => {
        musicButton.textContent = "▶ PLAY MUSIC";
    });
}


/* =========================================================
   FOOTER YEAR
   ========================================================= */

const yearElement = document.getElementById("year");

if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
}