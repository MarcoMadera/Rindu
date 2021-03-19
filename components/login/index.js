export default function Login() {
  const SPOTIFY_CLIENT_ID = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
  const SPOTIFY_REDIRECT_URL = process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URL;
  const AUTH_URL = `https://accounts.spotify.com/authorize?client_id=${SPOTIFY_CLIENT_ID}&response_type=code&redirect_uri=${SPOTIFY_REDIRECT_URL}&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state%20playlist-modify-private%20playlist-modify-public`;
  return (
    <section>
      <div>
        <h1>Spotify Playlists Remover</h1>
        <p>Remueve las canciones duplicadas de tus playlists</p>
        <a href={AUTH_URL}>Login with spotify</a>
      </div>
      <style jsx>
        {`
          section {
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            text-align: center;
          }
          div {
            padding: 15px;
            background-color: #111111;
            border-radius: 8px;
            max-width: 800px;
          }
          a {
            display: block;
            background-color: #1db954;
            color: #fff;
            font-family: sans-serif;
            font-size: 14px;
            line-height: 1;
            border-radius: 500px;
            padding: 18px 48px 16px;
            transition-property: background-color, border-color, color,
              box-shadow, filter;
            transition-duration: 0.3s;
            border-width: 0;
            letter-spacing: 2px;
            min-width: 160px;
            text-transform: uppercase;
            white-space: normal;
            text-decoration: none;
            width: max-content;
            margin: 0 auto;
          }
          a:hover,
          a:focus {
            background-color: #1ed760;
          }
        `}
      </style>
    </section>
  );
}
