const LoginContainer: React.FC = () => {
  const SPOTIFY_CLIENT_ID = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
  const SPOTIFY_REDIRECT_URL = process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URL;
  const API_AUTH_URL = "https://accounts.spotify.com/authorize?";
  const scopes =
    "streaming,user-read-email,user-follow-read,user-follow-modify,playlist-read-private,user-read-private,user-library-read,user-library-modify,user-read-playback-state,user-modify-playback-state,playlist-modify-private,playlist-modify-public";
  const paramsData = {
    client_id: SPOTIFY_CLIENT_ID || "",
    response_type: "code",
    redirect_uri: SPOTIFY_REDIRECT_URL || "",
    scope: scopes,
  };
  const params = new URLSearchParams(paramsData);

  return (
    <div>
      <h2>Limpia tus playlists</h2>
      <p>Remueve canciones duplicadas e invisibles</p>
      <a href={API_AUTH_URL + params}>Entra con Spotify</a>
      <style jsx>{`
        div {
          width: 430px;
          text-align: center;
          padding: 24px;
          background-color: #111111;
          border-radius: 10px;
        }
        h2 {
          font-weight: bold;
          margin: 0;
        }
        a {
          display: block;
          background-color: #1db954;
          color: #fff;
          font-family: sans-serif;
          line-height: 1;
          border-radius: 500px;
          padding: 16px 32px;
          transition-property: background-color, border-color, color, box-shadow,
            filter;
          transition-duration: 0.3s;
          border-width: 0;
          letter-spacing: 2px;
          max-width: 300px;
          width: 100%;
          height: 48px;
          text-transform: uppercase;
          white-space: normal;
          text-decoration: none;
          margin: 0 auto;
        }
        a:hover,
        a:focus {
          background-color: #1ed760;
        }
        p {
          line-height: 1.6;
        }
      `}</style>
    </div>
  );
};
export default LoginContainer;
