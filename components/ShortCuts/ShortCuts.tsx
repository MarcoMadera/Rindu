import { Fragment, ReactElement } from "react";

import { Heading } from "components";
import { useTranslations } from "hooks";
import { AsType } from "types/heading";
import { templateReplace } from "utils";

export default function ShortCuts(): ReactElement {
  const { translations } = useTranslations();
  const shortCutsGroups: Record<string, Record<string, string[]>[]>[] = [
    {
      [translations.basic]: [
        {
          [translations.createNewPlaylist]: ["Alt", "Shift", "P"],
          [translations.createNewFolder]: ["Ctrl", "Alt", "Shift", "P"],
          [translations.openContextMenu]: ["Alt", "J"],
          [translations.openQuickSearch]: ["Ctrl", "K"],
          [translations.logOut]: ["Alt", "Shift", "F6"],
        },
      ],
      [translations.playback]: [
        {
          [translations.playPause]: ["Space"],
          [translations.like]: ["Alt", "Shift", "B"],
          [translations.shuffle]: ["Alt", "S"],
          [translations.repeat]: ["Alt", "R"],
          [translations.skipToPrevious]: ["Alt", "←"],
          [translations.skipToNext]: ["Alt", "→"],
          [translations.seekBackward]: ["Shift", "←"],
          [translations.seekForward]: ["Shift", "→"],
          [translations.raiseVolume]: ["Alt", "↑"],
          [translations.lowerVolume]: ["Alt", "↓"],
        },
      ],
      [translations.navigation]: [
        {
          [translations.home]: ["Alt", "Shift", "H"],
          [translations.backInHistory]: ["Ctrl", "←"],
          [translations.forwardInHistory]: ["Ctrl", "→"],
          [translations.currentlyPlaying]: ["Alt", "Shift", "J"],
          [translations.search]: ["Ctrl", "Shift", "L"],
          [translations.likedSongs]: ["Alt", "Shift", "S"],
          [translations.queue]: ["Alt", "Shift", "Q"],
          [translations.yourPlaylists]: ["Alt", "Shift", "1"],
          [translations.yourPodcasts]: ["Alt", "Shift", "2"],
          [translations.yourArtists]: ["Alt", "Shift", "3"],
          [translations.yourAlbums]: ["Alt", "Shift", "4"],
          [translations.madeForYou]: ["Alt", "Shift", "M"],
          [translations.newReleases]: ["Alt", "Shift", "N"],
          [translations.charts]: ["Alt", "Shift", "C"],
        },
      ],
      [translations.layout]: [
        {
          [translations.decreaseNavigationWidth]: ["Alt", "Shift", "←"],
          [translations.increaseNavigationWidth]: ["Alt", "Shift", "→"],
          [translations.decreaseActivityTabWidth]: ["Alt", "Shift", "↑"],
          [translations.increaseActivityTabWidth]: ["Alt", "Shift", "↓"],
        },
      ],
    },
  ];

  return (
    <div className="shortcuts-container">
      <p>
        {templateReplace(translations.shortCutdescription, [
          <Fragment key={"Shortcut to shortcut"}>
            <kbd key={"Ctrl"}>Ctrl</kbd>
            <kbd key={"/"}>/</kbd>
          </Fragment>,
          <kbd key={"?"}>?</kbd>,
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
                            return <kbd key={key}>{key}</kbd>;
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
        kbd {
          border-radius: 4px;
          box-shadow:
            0 1px 0 rgba(0, 0, 0, 0.3),
            inset 0 0 0 1px #fff;
          box-sizing: border-box;
          color: inherit;
          display: inline-block;
          font-size: 1rem;
          font-weight: 400;
          margin: 0 4px;
          padding: 2px 8px;
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
