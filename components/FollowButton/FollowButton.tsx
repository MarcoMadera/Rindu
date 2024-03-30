import { ReactElement, useEffect, useState } from "react";

import { useRouter } from "next/router";

import { useTranslations } from "hooks";
import {
  checkIfUserFollowArtistUser,
  follow,
  Follow_type,
  unFollow,
} from "utils/spotifyCalls";

export default function FollowButton({
  type,
  id,
}: Readonly<{
  type: Follow_type;
  id?: string;
}>): ReactElement {
  const [isFollowing, setIsFollowing] = useState(false);
  const { translations } = useTranslations();
  const router = useRouter();

  useEffect(() => {
    checkIfUserFollowArtistUser(type, id).then((res) => {
      setIsFollowing(res);
    });
  }, [type, id, router]);

  return (
    <button
      type="button"
      className="follow-button"
      onClick={(e) => {
        e.stopPropagation();
        if (isFollowing) {
          unFollow(type, id).then((res) => {
            if (res) {
              setIsFollowing(false);
            }
          });
        } else {
          follow(type, id).then((res) => {
            if (res) {
              setIsFollowing(true);
            }
          });
        }
      }}
    >
      {isFollowing
        ? translations.pages.artist.following
        : translations.pages.artist.follow}
      <style jsx>{`
        button {
          margin-left: 20px;
          display: flex;
          justify-content: center;
          align-items: center;
          width: 56px;
          height: 56px;
          min-width: 56px;
          min-height: 56px;
          background-color: transparent;
          border: none;
          min-height: 20px;
          max-height: min-content;
        }
        .follow-button {
          height: min-content;
        }
        button:focus,
        button:hover {
          border-color: #fff;
        }
        button:active {
          border-color: #fff;
        }
        button {
          background-color: transparent;
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 4px;
          box-sizing: border-box;
          color: #fff;
          font-size: 16px;
          width: auto;
          font-weight: 700;
          letter-spacing: 0.1em;
          line-height: 16px;
          padding: 7px 15px;
          text-align: center;
          text-transform: uppercase;
          font-weight: bold;
          margin-right: 24px;
        }
      `}</style>
    </button>
  );
}
