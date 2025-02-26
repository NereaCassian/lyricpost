export async function onRequest(context) {
    const url = new URL(context.request.url);
    const artist = url.searchParams.get('artist');
    const track = url.searchParams.get('track');
    
    if (!artist || !track) {
        return new Response(JSON.stringify({ error: 'Missing artist or track name' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }
    try {
        const response = await fetch(
            `https://lrclib.net/api/search?q=${encodeURIComponent(artist)} ${encodeURIComponent(track)}`,
            { method: 'GET' }
        );
    
        const result = await response.json();
    
        // Filter results same as original code
        const filteredResult = result.filter(
            data => data.trackName.toLowerCase().trim() === track.toLowerCase().trim()
        );
    
        const finalResult = filteredResult[0] ?? result[0] ?? null;
    
        return new Response(JSON.stringify(finalResult), {
            headers: { 
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });
    }
}