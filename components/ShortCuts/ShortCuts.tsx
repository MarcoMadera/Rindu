import { Fragment, ReactElement } from "react";

import { Heading, Kbd } from "components";
import { useTranslations } from "hooks";
import { AsType } from "types/heading";
import { templateReplace } from "utils";

export default function ShortCuts(): ReactElement {
  const { translations } = useTranslations();
  const shortCutsGroups: Record<string, Record<string, string[]>[]>[] = [
    {
      [translations.shortCuts.basic]: [
        {
          [translations.shortCuts.createNewPlaylist]: ["Alt", "Shift", "P"],
          [translations.shortCuts.createNewFolder]: [
            "Ctrl",
            "Alt",
            "Shift",
            "P",
          ],
          [translations.shortCuts.openContextMenu]: ["Alt", "J"],
          [translations.shortCuts.openQuickSearch]: ["Ctrl", "K"],
          [translations.shortCuts.logOut]: ["Alt", "Shift", "F6"],
        },
      ],
      [translations.shortCuts.playback]: [
        {
          [translations.shortCuts.playPause]: ["Space"],
          [translations.shortCuts.like]: ["Alt", "Shift", "B"],
          [translations.shortCuts.shuffle]: ["Alt", "S"],
          [translations.shortCuts.repeat]: ["Alt", "R"],
          [translations.shortCuts.skipToPrevious]: ["Alt", "←"],
          [translations.shortCuts.skipToNext]: ["Alt", "→"],
          [translations.shortCuts.seekBackward]: ["Shift", "←"],
          [translations.shortCuts.seekForward]: ["Shift", "→"],
          [translations.shortCuts.raiseVolume]: ["Alt", "↑"],
          [translations.shortCuts.lowerVolume]: ["Alt", "↓"],
        },
      ],
      [translations.shortCuts.navigation]: [
        {
          [translations.shortCuts.home]: ["Alt", "Shift", "H"],
          [translations.shortCuts.backInHistory]: ["Ctrl", "←"],
          [translations.shortCuts.forwardInHistory]: ["Ctrl", "→"],
          [translations.shortCuts.currentlyPlaying]: ["Alt", "Shift", "J"],
          [translations.shortCuts.search]: ["Ctrl", "Shift", "L"],
          [translations.shortCuts.likedSongs]: ["Alt", "Shift", "S"],
          [translations.shortCuts.queue]: ["Alt", "Shift", "Q"],
          [translations.shortCuts.yourPlaylists]: ["Alt", "Shift", "1"],
          [translations.shortCuts.yourPodcasts]: ["Alt", "Shift", "2"],
          [translations.shortCuts.yourArtists]: ["Alt", "Shift", "3"],
          [translations.shortCuts.yourAlbums]: ["Alt", "Shift", "4"],
          [translations.shortCuts.madeForYou]: ["Alt", "Shift", "M"],
          [translations.shortCuts.newReleases]: ["Alt", "Shift", "N"],
          [translations.shortCuts.charts]: ["Alt", "Shift", "C"],
        },
      ],
      [translations.shortCuts.layout]: [
        {
          [translations.shortCuts.decreaseNavigationWidth]: [
            "Alt",
            "Shift",
            "←",
          ],
          [translations.shortCuts.increaseNavigationWidth]: [
            "Alt",
            "Shift",
            "→",
          ],
          [translations.shortCuts.decreaseActivityTabWidth]: [
            "Alt",
            "Shift",
            "↑",
          ],
          [translations.shortCuts.increaseActivityTabWidth]: [
            "Alt",
            "Shift",
            "↓",
          ],
        },
      ],
    },
  ];

  return (
    <div className="shortcuts-container">
      <p>
        {templateReplace(translations.shortCuts.shortCutdescription, [
          <Fragment key={"Shortcut to shortcut"}>
            <Kbd key={"Ctrl"}>Ctrl</Kbd>
            <Kbd key={"/"}>/</Kbd>
          </Fragment>,
          <Kbd key={"?"}>?</Kbd>,
        ])}
      </p>
      <div className="shortcuts">
        {shortCutsGroups.map((group) => {
          return Object.keys(group).map((groupName) => {
            return (
              <Fragment key={groupName}>
                <Heading number={4} as={AsType.H2} margin="30px 0 15px">
                  {groupName}
                </Heading>
                <ul>
                  {group[groupName].map((shortCut) => {
                    return Object.keys(shortCut).map((shortCutName) => {
                      return (
                        <li key={shortCutName}>
                          <span>{shortCutName}</span>
                          {shortCut[shortCutName].map((key) => {
                            return <Kbd key={key}>{key}</Kbd>;
                          })}
                        </li>
                      );
                    });
                  })}
                </ul>
              </Fragment>
            );
          });
        })}
      </div>
      <style jsx>{`
        :global(.modal) {
          overflow: auto;
        }
        .shortcuts-container {
          max-width: 100%;
          margin-bottom: 20px;
          min-width: 440px;
        }
        .shortcuts {
          overflow: auto;
          max-width: 100%;
          max-height: 100%;
        }
        ol,
        ul {
          list-style: none;
        }
        li {
          align-items: center;
          display: flex;
          margin: 16px 0;
        }
        ul span {
          margin-right: 16px;
          box-sizing: border-box;
          font-size: 1rem;
          font-weight: 400;
          color: inherit;
          flex: 1;
        }
      `}</style>
    </div>
  );
}
