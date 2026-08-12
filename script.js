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

const totalAnimationTime = 2000;
const stepTime = totalAnimationTime / word.length;


/*
    Creates the title.

    Example:

    B$%#&¥€
    BA%#&¥€
    BAC#&¥€
    BACO&¥€
    BACOT¥€
    BACOTH€
    BACOTHN
*/

function createScrambledText(resolvedCount) {

    let result = "";

    for (let i = 0; i < word.length; i++) {

        if (i < resolvedCount) {

            result += word[i];

        } else {

            result += glitchCharacters[
                Math.floor(
                    Math.random() * glitchCharacters.length
                )
            ];

        }

    }

    return result;
}


/*
    Animate the title ONCE.

    Every 0.2857 seconds another
    letter becomes permanent.

    7 letters × 0.2857 ≈ 2 seconds.
*/

async function animateTitle() {

    title.textContent = createScrambledText(0);

    for (
        let resolved = 0;
        resolved < word.length;
        resolved++
    ) {

        await new Promise(resolve => {

            setTimeout(
                resolve,
                stepTime
            );

        });


        title.textContent =
            createScrambledText(
                resolved + 1
            );


        title.classList.remove("glitch");

        void title.offsetWidth;

        title.classList.add("glitch");

    }


    title.textContent = word;

    title.classList.remove("glitch");
}


/*
    Start animation once.
*/

animateTitle();


/*
    Footer year.
*/

const yearElement = document.getElementById("year");

if (yearElement) {

    yearElement.textContent =
        new Date().getFullYear();

}