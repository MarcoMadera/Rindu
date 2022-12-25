import useAuth from "hooks/useAuth";
import Script from "next/script";
import { ReactElement, useEffect } from "react";
import NowPlaying from "./NowPlaying";
import useToast from "hooks/useToast";
import PlayerControls from "components/PlayerControls";
import PlaybackExtraControls from "components/PlaybackExtraControls";
import useSpotifyPlayer from "hooks/useSpotifyPlayer";

export default function SpotifyPlayer(): ReactElement {
  const { user } = useAuth();
  const { addToast } = useToast();
  const isPremium = user?.product === "premium";

  useSpotifyPlayer({ name: "Rindu" });

  useEffect(() => {
    if (!user?.product) {
      return;
    }

    if (user?.product === "premium") {
      addToast({
        variant: "info",
        message: "Welcome to Rindu, preparing your music for you",
      });
    } else {
      addToast({
        variant: "info",
        message: "Welcome to Rindu, prepare to enjoy!",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.product]);

  return (
    <footer>
      <div className="container">
        {isPremium ? (
          <Script src="https://sdk.scdn.co/spotify-player.js"></Script>
        ) : null}
        <section>
          <NowPlaying />
        </section>
        <section>
          <PlayerControls />
        </section>
        <section>
          <PlaybackExtraControls />
        </section>
      </div>
      <style jsx>{`
        section {
          display: flex;
        }
        section:nth-child(1) {
          width: 30%;
          min-width: 180px;
          justify-content: flex-start;
        }
        section:nth-child(2) {
          width: 100%;
          max-width: 550px;
          justify-content: center;
          flex-direction: column;
          align-items: center;
        }
        section:nth-child(3) {
          width: 30%;
          min-width: 180px;
          justify-content: flex-end;
        }
        div.container {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          padding: 0 16px;
          height: 90px;
        }
        footer {
          width: 100%;
          display: flex;
          flex-direction: column;
          background-color: #181818;
          border-top: 1px solid #282828;
        }
        @media (max-width: 685px) {
          div.container {
            flex-direction: column;
            gap: 16px;
            height: 270px;
            padding: 16px 0;
          }
          section {
            padding: 0 16px 10px 16px;
          }
          section:nth-child(1) {
            border-bottom: 1px solid #282828;
            width: 100%;
            align-self: baseline;
          }
        }
      `}</style>
    </footer>
  );
}
