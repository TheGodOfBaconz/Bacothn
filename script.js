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


/*
    BACOTHN has 7 letters.

    2000ms / 7 = approximately
    285.7ms per letter.
*/

const stepTime =
    totalAnimationTime / word.length;



/* ========================================
   BACOTHN TITLE GLITCH ANIMATION
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

            /*
                This letter is locked in.
            */

            result += word[i];


        } else {

            /*
                This position is still
                scrambling.

                IMPORTANT:

                Every unresolved position
                receives a character.

                Nothing disappears.

                Example:

                &%#¥£$€
                B%#¥£$€
                BA#¥£$€
                BAC¥£$€
                BACO£$€
                BACOT$€
                BACOTH€
                BACOTHN
            */

            result += randomCharacter();

        }

    }


    return result;

}



async function animateTitle() {


    /*
        Do nothing on pages without
        the BACOTHN title.
    */

    if (!title) {

        return;

    }



    /*
        Immediately display all 7
        scrambled positions.
    */

    title.textContent =
        createScrambledText(0);



    /*
        Resolve one character at
        each animation step.

        Total duration:
        approximately 2 seconds.
    */

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



        /*
            Resolve the next letter.

            All remaining letters
            stay scrambled.
        */

        title.textContent =
            createScrambledText(
                resolved + 1
            );



        /*
            Restart the CSS glitch
            effect.
        */

        title.classList.remove(
            "glitch"
        );


        /*
            Force browser reflow so
            the animation can restart.
        */

        void title.offsetWidth;


        title.classList.add(
            "glitch"
        );

    }



    /*
        Final state.

        The animation does NOT loop.
    */

    title.textContent =
        word;


    title.classList.remove(
        "glitch"
    );

}



/*
    Start the title animation.
*/

animateTitle();



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
                        () => {

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