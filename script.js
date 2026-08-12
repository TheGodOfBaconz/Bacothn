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


    /*
        Start with all 7 positions
        scrambled.
    */

    title.textContent =
        createScrambledText(0);



    /*
        Resolve one letter at a time.

        Total:
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



    /*
        Final state.

        Does not loop.
    */

    title.textContent =
        word;


    title.classList.remove(
        "glitch"
    );

}


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
        document.createElement("span");


    element.className =
        "falling-word";


    element.textContent =
        randomFallingWord();



    /*
        Random horizontal position.
    */

    const left =
        Math.random() * 100;


    /*
        Random fall duration.

        This prevents all 20 words
        from moving together.
    */

    const duration =
        7 +
        Math.random() * 9;


    /*
        Random starting delay.

        Negative delay means the word
        appears already somewhere
        in its falling journey.

        This lets all 20 exist on-screen
        immediately.
    */

    const delay =
        -(Math.random() * duration);


    /*
        Random rotation.
    */

    const rotation =
        -12 +
        Math.random() * 24;


    /*
        Random size.
    */

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


    /*
        When the animation finishes,
        delete this word and create a
        completely new random word.

        This creates the recycling effect.
    */

    element.addEventListener(
        "animationend",
        () => {

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
        async () => {


            if (
                music.paused
            ) {


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
                            "add music/profile.mp3";

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


if (yearElement) {

    yearElement.textContent =
        new Date().getFullYear();

}