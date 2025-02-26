export default {
    async fetch(request, env, ctx) {
      const url = new URL(request.url);
      const query = url.searchParams.get('q');
      const limit = url.searchParams.get('limit') || 6;
      console.log(env);
      
      if (!query) {
          return new Response(JSON.stringify({ error: 'Missing search query' }), {
              status: 400,
              headers: { 'Content-Type': 'application/json' }
          });
      }   
      try {
          // Get Spotify token from environment variables
          const clientId = env.SPOTIFY_CLIENT_ID;
          const clientSecret = env.SPOTIFY_CLIENT_SECRET;
          
          // Get access token
          const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
              method: 'POST',
              headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
              body: new URLSearchParams({
                  'grant_type': 'client_credentials',
                  'client_id': clientId,
                  'client_secret': clientSecret
              })
          });
          const tokenData = await tokenResponse.json();
          const accessToken = tokenData.access_token;
          // Search for tracks
          const searchResponse = await fetch(
          `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=${limit}`,
              {
                  headers: { 'Authorization': `Bearer ${accessToken}` }
              }
          );
  
          const data = await searchResponse.json();
  
          return new Response(JSON.stringify(data), {
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
    },
  };