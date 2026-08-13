/*
    ============================================================
    GIFGOL
    Sends completed GIFs to the private Cloudflare Worker.
    The Discord webhook itself is NEVER exposed to the browser.
    ============================================================
*/

const GIFGOL_ENDPOINT =
    "https://bacothn-webhook-gif.bacothn.workers.dev/";


/*
    Send a completed GIF to the Cloudflare Worker.
*/
async function sendGifToWebhook(gifBlob, metadata) {

    if (!(gifBlob instanceof Blob)) {
        throw new Error("No GIF blob was provided.");
    }


    const formData =
        new FormData();


    formData.append(
        "gif",
        gifBlob,
        metadata.filename || "bacothn.gif"
    );


    formData.append(
        "metadata",
        JSON.stringify({
            filename:
                metadata.filename ||
                "bacothn.gif",

            prompt:
                metadata.prompt ||
                "N/A",

            username:
                metadata.username ||
                "Anonymous",

            width:
                metadata.width ||
                null,

            height:
                metadata.height ||
                null,

            fps:
                metadata.fps ||
                null,

            frames:
                metadata.frames ||
                null,

            duration:
                metadata.duration ||
                null,

            fileSize:
                gifBlob.size,

            createdAt:
                new Date().toISOString()
        })
    );


    const response =
        await fetch(
            GIFGOL_ENDPOINT,
            {
                method: "POST",
                body: formData
            }
        );


    if (!response.ok) {

        const errorText =
            await response.text();

        throw new Error(
            "Webhook request failed: " +
            response.status +
            " " +
            errorText
        );
    }


    return true;
}


/*
    Called by gif-creator.html after the GIF
    has successfully finished encoding.
*/
window.gifGolCreated =
    async function(gifBlob, metadata) {

        try {

            await sendGifToWebhook(
                gifBlob,
                metadata
            );


            console.log(
                "GIF successfully sent to Discord."
            );


        } catch (error) {

            console.error(
                "GIFGOL webhook error:",
                error
            );

            /*
                Do not stop the GIF creator if
                Discord/webhook delivery fails.
            */

        }

    };