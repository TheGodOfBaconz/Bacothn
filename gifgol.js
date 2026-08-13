/* ========================================
   BACOTHN GIF CREATOR
   gifgol.js
======================================== */

"use strict";


/* ========================================
   CONFIGURATION
======================================== */

/*
    IMPORTANT:

    DO NOT PUT YOUR DISCORD WEBHOOK HERE.

    Your GitHub secret is:

        GIF_WEBHOOK_GOLLER

    The browser should only communicate
    with your backend endpoint.

    Replace this later with the URL of
    your backend/serverless function.
*/

const GIF_BACKEND_ENDPOINT =
    "/api/gif";


/*
    Maximum number of frames generated.

    This prevents accidentally trying to
    encode thousands of frames from a
    massive video.
*/

const MAX_FRAMES =
    600;


/* ========================================
   ELEMENTS
======================================== */

const fileInput =
    document.getElementById(
        "gifFileInput"
    );

const dropzone =
    document.getElementById(
        "gifDropzone"
    );

const workspace =
    document.getElementById(
        "gifWorkspace"
    );

const canvas =
    document.getElementById(
        "gifPreviewCanvas"
    );

const ctx =
    canvas.getContext(
        "2d",
        {
            willReadFrequently: true
        }
    );

const status =
    document.getElementById(
        "gifStatus"
    );

const sourceType =
    document.getElementById(
        "gifSourceType"
    );

const durationDisplay =
    document.getElementById(
        "gifDuration"
    );

const frameCountDisplay =
    document.getElementById(
        "gifFrameCount"
    );

const outputSizeDisplay =
    document.getElementById(
        "gifOutputSize"
    );

const filenameInput =
    document.getElementById(
        "gifFilename"
    );

const widthInput =
    document.getElementById(
        "gifWidth"
    );

const heightInput =
    document.getElementById(
        "gifHeight"
    );

const keepAspect =
    document.getElementById(
        "gifKeepAspect"
    );

const fpsInput =
    document.getElementById(
        "gifFps"
    );

const qualityInput =
    document.getElementById(
        "gifQuality"
    );

const reverseInput =
    document.getElementById(
        "gifReverse"
    );

const loopInput =
    document.getElementById(
        "gifLoop"
    );

const widthValue =
    document.getElementById(
        "gifWidthValue"
    );

const heightValue =
    document.getElementById(
        "gifHeightValue"
    );

const fpsValue =
    document.getElementById(
        "gifFpsValue"
    );

const qualityValue =
    document.getElementById(
        "gifQualityValue"
    );

const previewButton =
    document.getElementById(
        "gifPreviewButton"
    );

const resetButton =
    document.getElementById(
        "gifResetButton"
    );

const createButton =
    document.getElementById(
        "gifCreateButton"
    );

const sendButton =
    document.getElementById(
        "gifSendButton"
    );

const downloadButton =
    document.getElementById(
        "gifDownloadButton"
    );

const progress =
    document.getElementById(
        "gifProgress"
    );

const progressBar =
    document.getElementById(
        "gifProgressBar"
    );

const progressText =
    document.getElementById(
        "gifProgressText"
    );

const progressPercent =
    document.getElementById(
        "gifProgressPercent"
    );

const output =
    document.getElementById(
        "gifOutput"
    );

const outputImage =
    document.getElementById(
        "gifOutputImage"
    );

const trimTrack =
    document.getElementById(
        "gifTrimTrack"
    );

const trimSelection =
    document.getElementById(
        "gifTrimSelection"
    );

const startHandle =
    document.getElementById(
        "gifStartHandle"
    );

const endHandle =
    document.getElementById(
        "gifEndHandle"
    );

const startText =
    document.getElementById(
        "trimStartText"
    );

const endText =
    document.getElementById(
        "trimEndText"
    );


/* ========================================
   STATE
======================================== */

let sourceFile =
    null;

let sourceURL =
    null;

let sourceImage =
    null;

let sourceVideo =
    null;

let sourceIsVideo =
    false;

let sourceWidth =
    0;

let sourceHeight =
    0;

let sourceDuration =
    0;

let startTime =
    0;

let endTime =
    0;

let outputBlob =
    null;

let outputURL =
    null;

let previewTimer =
    null;

let draggingHandle =
    null;

let isEncoding =
    false;


/* ========================================
   STATUS
======================================== */

function setStatus(
    text,
    type = ""
) {

    status.textContent =
        text;

    status.className =
        "gif-status " +
        type;

}


/* ========================================
   FORMAT TIME
======================================== */

function formatTime(
    seconds
) {

    if (
        !Number.isFinite(
            seconds
        )
    ) {

        return "0.00s";

    }


    return (
        seconds.toFixed(2) +
        "s"
    );

}


/* ========================================
   FORMAT FILE SIZE
======================================== */

function formatBytes(
    bytes
) {

    if (
        bytes < 1024
    ) {

        return (
            bytes +
            " B"
        );

    }


    if (
        bytes < 1024 * 1024
    ) {

        return (
            (bytes / 1024)
                .toFixed(1) +
            " KB"
        );

    }


    return (
        (bytes / 1024 / 1024)
            .toFixed(1) +
        " MB"
    );

}


/* ========================================
   FILE NAME
======================================== */

function cleanFilename(
    name
) {

    name =
        String(name || "")
            .trim()
            .replace(
                /\.gif$/i,
                ""
            )
            .replace(
                /[^a-zA-Z0-9_\- ]/g,
                ""
            )
            .trim();


    if (
        !name
    ) {

        name =
            "bacothn-gif";

    }


    return name;

}


/* ========================================
   UPDATE SETTINGS
======================================== */

function updateSettingsUI() {

    widthValue.textContent =
        widthInput.value;

    fpsValue.textContent =
        fpsInput.value;

    qualityValue.textContent =
        qualityInput.value;


    if (
        keepAspect.checked
    ) {

        heightValue.textContent =
            "AUTO";

    } else {

        heightValue.textContent =
            heightInput.value;

    }


    updateOutputSize();

}


/* ========================================
   OUTPUT SIZE
======================================== */

function getOutputDimensions() {

    let width =
        Number(
            widthInput.value
        );

    let height =
        Number(
            heightInput.value
        );


    if (
        keepAspect.checked &&
        sourceWidth > 0
    ) {

        height =
            Math.round(
                width *
                sourceHeight /
                sourceWidth
            );

    }


    width =
        Math.max(
            2,
            Math.floor(width)
        );

    height =
        Math.max(
            2,
            Math.floor(height)
        );


    return {
        width,
        height
    };

}


function updateOutputSize() {

    const size =
        getOutputDimensions();


    outputSizeDisplay.textContent =
        size.width +
        "×" +
        size.height;

}


/* ========================================
   WIDTH → HEIGHT
======================================== */

widthInput.addEventListener(
    "input",
    () => {

        if (
            keepAspect.checked &&
            sourceWidth > 0
        ) {

            const width =
                Number(
                    widthInput.value
                );

            const height =
                Math.round(
                    width *
                    sourceHeight /
                    sourceWidth
                );

            heightInput.value =
                Math.min(
                    1000,
                    Math.max(
                        64,
                        height
                    )
                );

        }

        updateSettingsUI();

    }
);


/* ========================================
   SETTINGS EVENTS
======================================== */

heightInput.addEventListener(
    "input",
    updateSettingsUI
);

fpsInput.addEventListener(
    "input",
    updateSettingsUI
);

qualityInput.addEventListener(
    "input",
    updateSettingsUI
);

keepAspect.addEventListener(
    "change",
    updateSettingsUI
);


/* ========================================
   FILE INPUT
======================================== */

fileInput.addEventListener(
    "change",
    () => {

        const file =
            fileInput.files &&
            fileInput.files[0];

        if (
            file
        ) {

            loadFile(
                file
            );

        }

    }
);


/* ========================================
   DRAG & DROP
======================================== */

[
    "dragenter",
    "dragover"
].forEach(
    eventName => {

        dropzone.addEventListener(
            eventName,
            event => {

                event.preventDefault();

                dropzone.classList.add(
                    "dragging"
                );

            }
        );

    }
);


[
    "dragleave",
    "drop"
].forEach(
    eventName => {

        dropzone.addEventListener(
            eventName,
            event => {

                event.preventDefault();

                dropzone.classList.remove(
                    "dragging"
                );

            }
        );

    }
);


dropzone.addEventListener(
    "drop",
    event => {

        const file =
            event.dataTransfer.files &&
            event.dataTransfer.files[0];

        if (
            file
        ) {

            loadFile(
                file
            );

        }

    }
);


/* ========================================
   LOAD FILE
======================================== */

function loadFile(
    file
) {

    if (
        isEncoding
    ) {

        return;

    }


    resetOutputOnly();


    sourceFile =
        file;

    sourceURL =
        URL.createObjectURL(
            file
        );


    sourceIsVideo =
        file.type.startsWith(
            "video/"
        );


    if (
        !sourceIsVideo &&
        !file.type.startsWith(
            "image/"
        )
    ) {

        alert(
            "Please choose an image or video file."
        );

        return;

    }


    if (
        sourceIsVideo
    ) {

        loadVideo();

    } else {

        loadImage();

    }

}


/* ========================================
   LOAD IMAGE
======================================== */

function loadImage() {

    sourceImage =
        new Image();


    sourceImage.onload =
        () => {

            sourceWidth =
                sourceImage.naturalWidth;

            sourceHeight =
                sourceImage.naturalHeight;

            sourceDuration =
                1;

            startTime =
                0;

            endTime =
                1;


            sourceType.textContent =
                "IMAGE";

            durationDisplay.textContent =
                "1.00s";


            prepareWorkspace();

        };


    sourceImage.onerror =
        () => {

            setStatus(
                "IMAGE ERROR"
            );

        };


    sourceImage.src =
        sourceURL;

}


/* ========================================
   LOAD VIDEO
======================================== */

function loadVideo() {

    sourceVideo =
        document.createElement(
            "video"
        );


    sourceVideo.preload =
        "metadata";

    sourceVideo.muted =
        true;

    sourceVideo.playsInline =
        true;


    sourceVideo.onloadedmetadata =
        () => {

            sourceWidth =
                sourceVideo.videoWidth;

            sourceHeight =
                sourceVideo.videoHeight;

            sourceDuration =
                sourceVideo.duration;


            if (
                !Number.isFinite(
                    sourceDuration
                ) ||
                sourceDuration <= 0
            ) {

                setStatus(
                    "INVALID VIDEO"
                );

                return;

            }


            startTime =
                0;

            endTime =
                sourceDuration;


            sourceType.textContent =
                "VIDEO";

            durationDisplay.textContent =
                formatTime(
                    sourceDuration
                );


            prepareWorkspace();

        };


    sourceVideo.onerror =
        () => {

            setStatus(
                "VIDEO ERROR"
            );

        };


    sourceVideo.src =
        sourceURL;

}


/* ========================================
   PREPARE WORKSPACE
======================================== */

function prepareWorkspace() {

    workspace.classList.add(
        "visible"
    );


    dropzone.style.display =
        "none";


    updateTrimUI();

    updateSettingsUI();

    drawPreview(
        startTime
    );


    setStatus(
        "READY",
        "ready"
    );


    createButton.disabled =
        false;

    previewButton.disabled =
        false;

}


/* ========================================
   DRAW IMAGE
======================================== */

function drawImageToCanvas(
    image,
    width,
    height
) {

    canvas.width =
        width;

    canvas.height =
        height;


    ctx.clearRect(
        0,
        0,
        width,
        height
    );


    ctx.drawImage(
        image,
        0,
        0,
        width,
        height
    );

}


/* ========================================
   DRAW VIDEO FRAME
======================================== */

async function seekVideo(
    time
) {

    if (
        !sourceVideo
    ) {

        return;

    }


    if (
        Math.abs(
            sourceVideo.currentTime -
            time
        ) <
        0.005
    ) {

        return;

    }


    await new Promise(
        resolve => {

            let finished =
                false;


            function done() {

                if (
                    finished
                ) {

                    return;

                }

                finished =
                    true;

                sourceVideo.removeEventListener(
                    "seeked",
                    done
                );

                resolve();

            }


            sourceVideo.addEventListener(
                "seeked",
                done,
                {
                    once: true
                }
            );


            sourceVideo.currentTime =
                Math.min(
                    sourceDuration,
                    Math.max(
                        0,
                        time
                    )
                );


            setTimeout(
                done,
                1000
            );

        }
    );

}


async function drawVideoPreview(
    time
) {

    await seekVideo(
        time
    );


    const size =
        getOutputDimensions();


    canvas.width =
        size.width;

    canvas.height =
        size.height;


    ctx.drawImage(
        sourceVideo,
        0,
        0,
        size.width,
        size.height
    );

}


/* ========================================
   DRAW PREVIEW
======================================== */

async function drawPreview(
    time
) {

    const size =
        getOutputDimensions();


    if (
        sourceIsVideo
    ) {

        await drawVideoPreview(
            time
        );

    } else if (
        sourceImage
    ) {

        drawImageToCanvas(
            sourceImage,
            size.width,
            size.height
        );

    }

}


/* ========================================
   TRIM UI
======================================== */

function updateTrimUI() {

    const duration =
        Math.max(
            sourceDuration,
            0.001
        );


    const startPercent =
        (
            startTime /
            duration
        ) * 100;


    const endPercent =
        (
            endTime /
            duration
        ) * 100;


    startHandle.style.left =
        startPercent +
        "%";

    endHandle.style.left =
        endPercent +
        "%";


    trimSelection.style.left =
        startPercent +
        "%";


    trimSelection.style.width =
        (
            endPercent -
            startPercent
        ) +
        "%";


    startText.textContent =
        formatTime(
            startTime
        );

    endText.textContent =
        formatTime(
            endTime
        );


    const durationSelected =
        Math.max(
            0,
            endTime -
            startTime
        );


    frameCountDisplay.textContent =
        Math.min(
            MAX_FRAMES,
            Math.max(
                1,
                Math.ceil(
                    durationSelected *
                    Number(
                        fpsInput.value
                    )
                )
            )
        );

}


/* ========================================
   HANDLE POSITION
======================================== */

function setHandleFromPointer(
    event,
    handle
) {

    const rect =
        trimTrack.getBoundingClientRect();


    let percent =
        (
            event.clientX -
            rect.left
        ) /
        rect.width;


    percent =
        Math.max(
            0,
            Math.min(
                1,
                percent
            )
        );


    const time =
        percent *
        sourceDuration;


    const minimum =
        0.01;


    if (
        handle ===
        "start"
    ) {

        startTime =
            Math.min(
                time,
                endTime -
                minimum
            );

        startTime =
            Math.max(
                0,
                startTime
            );

    } else {

        endTime =
            Math.max(
                time,
                startTime +
                minimum
            );

        endTime =
            Math.min(
                sourceDuration,
                endTime
            );

    }


    updateTrimUI();

    drawPreview(
        handle ===
        "start"
            ? startTime
            : endTime
    );

}


/* ========================================
   TRIM POINTER EVENTS
======================================== */

startHandle.addEventListener(
    "pointerdown",
    event => {

        event.preventDefault();

        draggingHandle =
            "start";

        startHandle.setPointerCapture(
            event.pointerId
        );

    }
);


endHandle.addEventListener(
    "pointerdown",
    event => {

        event.preventDefault();

        draggingHandle =
            "end";

        endHandle.setPointerCapture(
            event.pointerId
        );

    }
);


trimTrack.addEventListener(
    "pointermove",
    event => {

        if (
            !draggingHandle
        ) {

            return;

        }


        setHandleFromPointer(
            event,
            draggingHandle
        );

    }
);


[
    "pointerup",
    "pointercancel"
].forEach(
    type => {

        trimTrack.addEventListener(
            type,
            () => {

                draggingHandle =
                    null;

            }
        );

    }
);


/* ========================================
   CLICK TRACK
======================================== */

trimTrack.addEventListener(
    "click",
    event => {

        if (
            draggingHandle
        ) {

            return;

        }


        const rect =
            trimTrack.getBoundingClientRect();


        const percent =
            Math.max(
                0,
                Math.min(
                    1,
                    (
                        event.clientX -
                        rect.left
                    ) /
                    rect.width
                )
            );


        const time =
            percent *
            sourceDuration;


        const startDistance =
            Math.abs(
                time -
                startTime
            );


        const endDistance =
            Math.abs(
                time -
                endTime
            );


        setHandleFromPointer(
            event,
            startDistance <
                endDistance
                ? "start"
                : "end"
        );

    }
);


/* ========================================
   PREVIEW BUTTON
======================================== */

previewButton.addEventListener(
    "click",
    async () => {

        if (
            !sourceFile
        ) {

            return;

        }


        clearInterval(
            previewTimer
        );


        setStatus(
            "PREVIEWING",
            "working"
        );


        let time =
            reverseInput.checked
                ? endTime
                : startTime;


        const step =
            1 /
            Number(
                fpsInput.value
            );


        previewTimer =
            setInterval(
                async () => {

                    if (
                        reverseInput.checked
                    ) {

                        time -= step;

                        if (
                            time <=
                            startTime
                        ) {

                            time =
                                endTime;

                        }

                    } else {

                        time += step;

                        if (
                            time >=
                            endTime
                        ) {

                            time =
                                startTime;

                        }

                    }


                    await drawPreview(
                        time
                    );

                },
                step * 1000
            );

    }
);


/* ========================================
   STOP PREVIEW WHEN CREATE
======================================== */

function stopPreview() {

    clearInterval(
        previewTimer
    );

    previewTimer =
        null;

}


/* ========================================
   GET FRAME TIMES
======================================== */

function getFrameTimes() {

    const fps =
        Number(
            fpsInput.value
        );


    const duration =
        Math.max(
            0.01,
            endTime -
            startTime
        );


    let frameCount =
        Math.ceil(
            duration *
            fps
        );


    frameCount =
        Math.max(
            1,
            Math.min(
                MAX_FRAMES,
                frameCount
            )
        );


    const actualDuration =
        duration;


    const times =
        [];


    for (
        let i = 0;
        i < frameCount;
        i++
    ) {

        const ratio =
            frameCount === 1
                ? 0
                : i /
                  (
                      frameCount -
                      1
                  );


        let time;


        if (
            reverseInput.checked
        ) {

            time =
                endTime -
                (
                    ratio *
                    actualDuration
                );

        } else {

            time =
                startTime +
                (
                    ratio *
                    actualDuration
                );

        }


        times.push(
            time
        );

    }


    return times;

}


/* ========================================
   CREATE GIF
======================================== */

async function createGIF() {

    if (
        !sourceFile ||
        isEncoding
    ) {

        return null;

    }


    stopPreview();


    if (
        typeof GIF ===
        "undefined"
    ) {

        alert(
            "The GIF encoder failed to load. Check your internet connection and reload the page."
        );

        return null;

    }


    isEncoding =
        true;


    createButton.disabled =
        true;

    previewButton.disabled =
        true;

    sendButton.disabled =
        true;


    progress.classList.add(
        "visible"
    );


    progressBar.style.width =
        "0%";

    progressPercent.textContent =
        "0%";


    setStatus(
        "ENCODING",
        "working"
    );


    const size =
        getOutputDimensions();


    const times =
        getFrameTimes();


    frameCountDisplay.textContent =
        times.length;


    const delay =
        Math.max(
            20,
            Math.round(
                1000 /
                Number(
                    fpsInput.value
                )
            )
        );


    const encoder =
        new GIF({

            workers: 2,

            quality:
                Number(
                    qualityInput.value
                ),

            width:
                size.width,

            height:
                size.height,

            workerScript:
                "https://cdnjs.cloudflare.com/ajax/libs/gif.js/0.2.0/gif.worker.js"

        });


    for (
        let i = 0;
        i < times.length;
        i++
    ) {

        const time =
            times[i];


        if (
            sourceIsVideo
        ) {

            await seekVideo(
                time
            );

            ctx.clearRect(
                0,
                0,
                size.width,
                size.height
            );

            ctx.drawImage(
                sourceVideo,
                0,
                0,
                size.width,
                size.height
            );

        } else {

            drawImageToCanvas(
                sourceImage,
                size.width,
                size.height
            );

        }


        encoder.addFrame(
            ctx,
            {
                copy: true,
                delay
            }
        );


        const percent =
            Math.round(
                (
                    (
                        i +
                        1
                    ) /
                    times.length
                ) *
                70
            );


        progressBar.style.width =
            percent +
            "%";

        progressPercent.textContent =
            percent +
            "%";

        progressText.textContent =
            "CAPTURING FRAME " +
            (
                i +
                1
            ) +
            " / " +
            times.length;


        await new Promise(
            resolve =>
                requestAnimationFrame(
                    resolve
                )
        );

    }


    encoder.on(
        "progress",
        value => {

            const percent =
                70 +
                Math.round(
                    value *
                    30
                );


            progressBar.style.width =
                percent +
                "%";

            progressPercent.textContent =
                percent +
                "%";

            progressText.textContent =
                "ENCODING GIF...";

        }
    );


    const blob =
        await new Promise(
            (
                resolve,
                reject
            ) => {

                encoder.on(
                    "finished",
                    resolve
                );

                try {

                    encoder.render();

                } catch (
                    error
                ) {

                    reject(
                        error
                    );

                }

            }
        );


    outputBlob =
        blob;


    if (
        outputURL
    ) {

        URL.revokeObjectURL(
            outputURL
        );

    }


    outputURL =
        URL.createObjectURL(
            blob
        );


    outputImage.src =
        outputURL;


    output.classList.add(
        "visible"
    );


    progressBar.style.width =
        "100%";

    progressPercent.textContent =
        "100%";

    progressText.textContent =
        "GIF READY";


    setStatus(
        "GIF READY",
        "success"
    );


    isEncoding =
        false;


    createButton.disabled =
        false;

    previewButton.disabled =
        false;

    sendButton.disabled =
        false;


    return blob;

}


/* ========================================
   CREATE BUTTON
======================================== */

createButton.addEventListener(
    "click",
    async () => {

        try {

            await createGIF();

        } catch (
            error
        ) {

            console.error(
                "GIF creation failed:",
                error
            );


            setStatus(
                "ENCODING FAILED"
            );


            progressText.textContent =
                "ERROR";


            isEncoding =
                false;


            createButton.disabled =
                false;

            previewButton.disabled =
                false;

            sendButton.disabled =
                false;


            alert(
                "The GIF could not be created. Check the browser console for details."
            );

        }

    }
);


/* ========================================
   DOWNLOAD
======================================== */

downloadButton.addEventListener(
    "click",
    () => {

        if (
            !outputBlob ||
            !outputURL
        ) {

            return;

        }


        const filename =
            cleanFilename(
                filenameInput.value
            ) +
            ".gif";


        const link =
            document.createElement(
                "a"
            );


        link.href =
            outputURL;

        link.download =
            filename;

        document.body.appendChild(
            link
        );

        link.click();

        link.remove();

    }
);


/* ========================================
   SEND TO BACKEND
======================================== */

sendButton.addEventListener(
    "click",
    async () => {

        if (
            !outputBlob
        ) {

            return;

        }


        /*
            The browser does NOT know the
            Discord webhook.

            The backend is responsible for:

                GIF_WEBHOOK_GOLLER

            and sending the GIF to Discord.

            This endpoint expects multipart/form-data
            with:

                file
                filename
                width
                height
                fps
                duration
                frames
        */


        sendButton.disabled =
            true;


        setStatus(
            "UPLOADING",
            "working"
        );


        const form =
            new FormData();


        const filename =
            cleanFilename(
                filenameInput.value
            ) +
            ".gif";


        form.append(
            "file",
            outputBlob,
            filename
        );


        form.append(
            "filename",
            filename
        );


        form.append(
            "width",
            String(
                getOutputDimensions()
                    .width
            )
        );


        form.append(
            "height",
            String(
                getOutputDimensions()
                    .height
            )
        );


        form.append(
            "fps",
            String(
                fpsInput.value
            )
        );


        form.append(
            "duration",
            String(
                endTime -
                startTime
            )
        );


        form.append(
            "frames",
            String(
                getFrameTimes().length
            )
        );


        try {

            const response =
                await fetch(
                    GIF_BACKEND_ENDPOINT,
                    {
                        method: "POST",
                        body: form
                    }
                );


            if (
                !response.ok
            ) {

                throw new Error(
                    "Backend returned " +
                    response.status
                );

            }


            setStatus(
                "SHARED",
                "success"
            );


            sendButton.textContent =
                "SHARED";


        } catch (
            error
        ) {

            console.error(
                "GIF upload failed:",
                error
            );


            setStatus(
                "UPLOAD FAILED"
            );


            alert(
                "The GIF was created successfully, but it could not be sent to the sharing service."
            );


        } finally {

            sendButton.disabled =
                false;

        }

    }
);


/* ========================================
   RESET OUTPUT
======================================== */

function resetOutputOnly() {

    stopPreview();


    outputBlob =
        null;


    if (
        outputURL
    ) {

        URL.revokeObjectURL(
            outputURL
        );

        outputURL =
            null;

    }


    outputImage.removeAttribute(
        "src"
    );


    output.classList.remove(
        "visible"
    );


    progress.classList.remove(
        "visible"
    );

}


/* ========================================
   FULL RESET
======================================== */

resetButton.addEventListener(
    "click",
    () => {

        stopPreview();


        if (
            sourceURL
        ) {

            URL.revokeObjectURL(
                sourceURL
            );

        }


        if (
            outputURL
        ) {

            URL.revokeObjectURL(
                outputURL
            );

        }


        sourceFile =
            null;

        sourceURL =
            null;

        sourceImage =
            null;

        sourceVideo =
            null;

        sourceWidth =
            0;

        sourceHeight =
            0;

        sourceDuration =
            0;

        startTime =
            0;

        endTime =
            0;

        outputBlob =
            null;

        outputURL =
            null;


        fileInput.value =
            "";


        workspace.classList.remove(
            "visible"
        );


        dropzone.style.display =
            "";


        output.classList.remove(
            "visible"
        );


        progress.classList.remove(
            "visible"
        );


        canvas.width =
            1;

        canvas.height =
            1;


        sourceType.textContent =
            "—";

        durationDisplay.textContent =
            "—";

        frameCountDisplay.textContent =
            "—";

        outputSizeDisplay.textContent =
            "—";


        setStatus(
            "WAITING FOR FILE"
        );


        createButton.disabled =
            false;

        previewButton.disabled =
            false;

        sendButton.disabled =
            false;


        filenameInput.value =
            "bacothn-gif";

        widthInput.value =
            "480";

        heightInput.value =
            "480";

        fpsInput.value =
            "15";

        qualityInput.value =
            "10";

        keepAspect.checked =
            true;

        reverseInput.checked =
            false;

        loopInput.checked =
            true;


        updateSettingsUI();

    }
);


/* ========================================
   INITIALIZE
======================================== */

createButton.disabled =
    true;

previewButton.disabled =
    true;

sendButton.disabled =
    true;


updateSettingsUI();

setStatus(
    "WAITING FOR FILE"
);