




async function getVideoTikTok(link: string) {
    const url = new URL(link);

    let id: string | null = null;

    const videoMatch = url.pathname.match(/\/video\/(\d+)/);
    if (videoMatch) {
        id = videoMatch[1];
    }

    if (!id && url.hostname.includes("vt.tiktok.com")) {
        const redirected = await fetch(link, { redirect: "follow" });
        const finalUrl = redirected.url;
        const match = finalUrl.match(/\/video\/(\d+)/);
        if (match) id = match[1];
    }

    if (!id) throw new Error("Tidak dapat menemukan ID video dari URL TikTok.");

    const response = await fetch(`https://api.twitterpicker.com/tiktok/mediav2/?id=${id}`);
    const data = await response.json();

    const videoUrl = data.video_no_watermark.url

    const fetchVideoUrl = await fetch(videoUrl)

    if (!fetchVideoUrl.ok) throw new Error(`Gagal fetch video: ${fetchVideoUrl.status}`);
    const buffer = await fetchVideoUrl.arrayBuffer();


    return Buffer.from(buffer)
}

export { getVideoTikTok };
