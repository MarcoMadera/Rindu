import { ReactElement } from "react";

export default function LoginButton(): ReactElement {
  const SPOTIFY_CLIENT_ID = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
  const SPOTIFY_REDIRECT_URL = process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URL;
  const API_AUTH_URL = "https://accounts.spotify.com/authorize?";
  const scopes =
    "user-top-read,streaming,user-read-email,user-follow-read,user-follow-modify,playlist-read-private,user-read-private,user-library-read,user-library-modify,user-read-playback-state,user-modify-playback-state,playlist-modify-private,playlist-modify-public";
  const paramsData = {
    client_id: SPOTIFY_CLIENT_ID || "",
    response_type: "code",
    redirect_uri: SPOTIFY_REDIRECT_URL || "",
    scope: scopes,
  };
  const params = new URLSearchParams(paramsData);
  return (
    <>
      <a href={API_AUTH_URL + params}>Entra con Spotify</a>
      <style jsx>{`
        a {
          border-radius: 500px;
          text-decoration: none;
          color: #fff;
          cursor: pointer;
          display: inline-block;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 1.76px;
          line-height: 18px;
          padding: 12px 34px;
          text-align: center;
          text-transform: uppercase;
          transition: all 33ms cubic-bezier(0.3, 0, 0, 1);
          white-space: nowrap;
          background-color: #000000;
          border: 1px solid #ffffffb3;
          will-change: transform;
        }
        a:focus,
        a:hover {
          transform: scale(1.06);
          background-color: #000;
          border: 1px solid #fff;
        }
        a:active {
          transform: scale(1);
        }
        @media screen and (min-width: 0px) and (max-width: 780px) {
          a {
            padding: 8px 24px;
          }
        }
      `}</style>
    </>
  );
}
