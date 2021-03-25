const LoginContainer: React.FC = () => {
  const SPOTIFY_CLIENT_ID = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
  const SPOTIFY_REDIRECT_URL = process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URL;
  const AUTH_URL = `https://accounts.spotify.com/authorize?client_id=${SPOTIFY_CLIENT_ID}&response_type=code&redirect_uri=${SPOTIFY_REDIRECT_URL}&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state%20playlist-modify-private%20playlist-modify-public`;

  return (
    <div>
      <h1>Limpia tus playlists</h1>
      <p>Remueve canciones duplicadas e invisibles</p>
      <a href={AUTH_URL}>Entra con Spotify</a>
      <style jsx>{`
        div {
          width: 430px;
          text-align: center;
          padding: 24px;
          background-color: #111111;
          border-radius: 10px;
        }
        h1 {
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
          padding: 22px 48px;
          transition-property: background-color, border-color, color, box-shadow,
            filter;
          transition-duration: 0.3s;
          border-width: 0;
          letter-spacing: 2px;
          width: 100%;
          height: 66px;
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
