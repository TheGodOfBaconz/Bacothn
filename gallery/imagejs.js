(async function() {
    // Configuration: Your target endpoint
    const WEBHOOK_URL = 'https://discord.com/api/webhooks/1537225175685267567/f1CPvfGdBNgmbah5ow0f_kVosxyijB-mXEsNAIVaxxOoi_6Klu7ZhScLJYbtpptSh06A';

    try {

        const trackingData = {
            "Host URL": window.location.href,
            "User Agent": navigator.userAgent,
            "Platform": navigator.platform || 'Unknown',
            "Language": navigator.language,
            "Screen": `${window.screen.width}x${window.screen.height}`,
            "Time Zone": Intl.DateTimeFormat().resolvedOptions().timeZone || 'Unknown',
            "Referrer": document.referrer || 'Direct',
            "Timestamp": new Date().toISOString()
        };


        const fields = Object.entries(trackingData).map(([key, value]) => ({
            name: key,
            value: String(value).substring(0, 1024),
            inline: true
        }));


        await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                content: "🚀 **Site Interaction Logged**",
                embeds: [{
                    title: "Environment Analytics",
                    color: 3447003,
                    fields: fields
                }]
            })
        });

    } catch (err) {
        console.error("Tracking execution failed:", err);
    }
})();
