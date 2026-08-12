const title = document.getElementById("bacothn-title");

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

const stepTime = 100;

function randomCharacter() {
    return glitchCharacters[
        Math.floor(Math.random() * glitchCharacters.length)
    ];
}


async function glitchTitle() {

    // Start with exactly 7 characters.
    title.textContent = "";

    for (let i = 0; i < word.length; i++) {

        // Show everything resolved so far + ONE scrambling character.
        title.textContent =
            word.substring(0, i) +
            randomCharacter();

        title.classList.remove("glitch");

        // Force the animation to restart.
        void title.offsetWidth;

        title.classList.add("glitch");

        await new Promise(resolve => {
            setTimeout(resolve, stepTime);
        });
    }

    // Final completed word.
    title.textContent = word;

    title.classList.remove("glitch");

    // Stay completed before restarting.
    await new Promise(resolve => {
        setTimeout(resolve, 1800);
    });

    glitchTitle();
}


/* START */

glitchTitle();


/* FOOTER YEAR */

document.getElementById("year").textContent =
    new Date().getFullYear();