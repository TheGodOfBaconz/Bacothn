/* =========================================================
   GIFGOL
   =========================================================

   This file intentionally does NOT contain the webhook.

   GitHub Pages is public, so anything placed here can be
   viewed by anyone.

   Instead, this calls your backend endpoint.

   Example:

       https://YOUR-BACKEND.example/api/gif-created

   Your backend can then read the secret stored in GitFlow
   and send the Discord webhook.

   ========================================================= */


const GIFGOL_ENDPOINT = "";


/* =========================================================
   GIF CREATED
   ========================================================= */

window.gifGolCreated =
    async function(data) {

        /*
            If no backend endpoint has been configured,
            simply don't send anything.
        */

        if (
            !GIFGOL_ENDPOINT
        ) {

            console.log(
                "[GIFGOL] GIF created:",
                data
            );

            return;

        }


        try {

            await fetch(
                GIFGOL_ENDPOINT,
                {

                    method:
                        "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify({

                            event:
                                "gif_created",

                            filename:
                                data.filename,

                            width:
                                data.width,

                            height:
                                data.height,

                            fps:
                                data.fps,

                            frames:
                                data.frames,

                            size:
                                data.size,

                            timestamp:
                                new Date()
                                    .toISOString()

                        })

                }
            );


        } catch (error) {

            console.error(
                "[GIFGOL] Logging failed:",
                error
            );

        }

    };