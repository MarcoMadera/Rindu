import { AnyNode, Cheerio, load } from "cheerio";
import levenshtein from "fast-levenshtein";
import _ from "lodash";
import type { NextApiRequest, NextApiResponse } from "next";

import { getSiteUrl } from "utils";

async function getLyrics(
  artistName: string,
  title: string
): Promise<string | null> {
  const promises = [];

  const textln = (html: Cheerio<AnyNode>): string => {
    html.find("br").replaceWith("\n");
    html.find("script").replaceWith("");
    html.find("#video-musictory").replaceWith("");
    html.find("strong").replaceWith("");
    let result = _.trim(html.text());
    result = result.replace(/\r\n\n/g, "\n");
    result = result.replace(/\t/g, "");
    result = result.replace(/\n\r\n/g, "\n");
    result = result.replace(/ +/g, " ");
    result = result.replace(/\n /g, "\n");
    return result;
  };

  const lyricsUrl = (title: string) => {
    return _.kebabCase(_.trim(_.toLower(_.deburr(title))));
  };
  const lyricsManiaUrl = (title: string) => {
    return _.snakeCase(_.trim(_.toLower(_.deburr(title))));
  };
  const lyricsManiaUrlAlt = (title: string) => {
    title = _.trim(_.toLower(title));
    title = title.replace("'", "");
    title = title.replace(" ", "_");
    title = title.replace(/_+/g, "_");
    return title;
  };

  const reqWikia = fetch(
    "http://lyrics.wikia.com/wiki/" +
      encodeURIComponent(artistName) +
      ":" +
      encodeURIComponent(title)
  )
    .then((res) => {
      return res.text();
    })
    .then((body) => {
      return load(body);
    })
    .then((html) => {
      const lyrics = textln(html(".lyricbox"));
      if (lyrics.length > 0) {
        return lyrics;
      }
      throw new Error("No lyrics found");
    });

  const reqParolesNet = fetch(
    "http://www.paroles.net/" +
      lyricsUrl(artistName) +
      "/paroles-" +
      lyricsUrl(title)
  )
    .then((res) => {
      return res.text();
    })
    .then((body) => {
      return load(body);
    })
    .then(($) => {
      if ($(".song-text").length === 0) {
        return Promise.reject();
      }
      const text = textln($(".song-text"));
      return text
        .replace(/^Paroles de la chanson.*\n?$/m, "")
        .replace(/^\n/m, "")
        .replace(/(\n\n\n)/g, "\n");
    })
    .catch((err) => {
      console.info("reqParolesNet", err);
      return Promise.reject();
    });

  const reqLyricsMania1 = fetch(
    "http://www.lyricsmania.com/" +
      lyricsManiaUrl(title) +
      "_lyrics_" +
      lyricsManiaUrl(artistName) +
      ".html"
  )
    .then((res) => {
      return res.text();
    })
    .then((body) => {
      return load(body);
    })
    .then(($) => {
      if ($(".lyrics-body").length === 0) {
        return Promise.reject();
      }
      const lyrics = textln($(".lyrics-body"));
      return lyrics.replace(/\n\n/g, "\n");
    })
    .catch((err) => {
      console.info("reqLyricsMania1", err);
      return Promise.reject();
    });

  const reqLyricsMania2 = fetch(
    "http://www.lyricsmania.com/" +
      lyricsManiaUrl(title) +
      "_" +
      lyricsManiaUrl(artistName) +
      ".html"
  )
    .then((res) => {
      return res.text();
    })
    .then((body) => {
      return load(body);
    })
    .then(($) => {
      if ($(".lyrics-body").length === 0) {
        return Promise.reject();
      }
      const lyrics = textln($(".lyrics-body"));
      return lyrics.replace(/\n\n/g, "\n");
    })
    .catch((err) => {
      console.info("LyricsMania2", err);
      return Promise.reject();
    });

  const reqLyricsMania3 = fetch(
    "http://www.lyricsmania.com/" +
      lyricsManiaUrlAlt(title) +
      "_lyrics_" +
      encodeURIComponent(lyricsManiaUrlAlt(artistName)) +
      ".html"
  )
    .then((res) => {
      return res.text();
    })
    .then((body) => {
      return load(body);
    })
    .then(($) => {
      if ($(".lyrics-body").length === 0) {
        return Promise.reject();
      }
      const lyrics = textln($(".lyrics-body"));
      return lyrics.replace(/\n\n/g, "\n");
    })
    .catch((err) => {
      console.info("LyricsMania3", err);
      return Promise.reject();
    });

  const reqSweetLyrics = fetch("http://www.sweetslyrics.com/search.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "search=" + encodeURIComponent(title),
  })
    .then((res) => {
      return res.text();
    })
    .then((body) => {
      return load(body);
    })
    .then(($) => {
      let closestLink: string | undefined,
        closestScore = -1;
      _.forEach($(".search_results_row_color"), (e) => {
        const artist = $(e)
          .text()
          .replace(/ - .+$/, "");
        const currentScore = levenshtein.get(artistName, artist);
        if (closestScore === -1 || currentScore < closestScore) {
          closestScore = currentScore;
          closestLink = $(e).find("a").last().attr("href");
        }
      });
      if (!closestLink) {
        return Promise.reject();
      }
      return fetch(`http://www.sweetslyrics.com/${closestLink}`)
        .then((res) => {
          return res.text();
        })
        .then((body) => {
          return load(body);
        });
    })
    .then(($) => {
      return textln($(".lyric_full_text"));
    })
    .catch((err) => {
      console.info("reqSweetLyrics", err);
      return Promise.reject();
    });

  if (/\(.*\)/.test(title) || /\[.*\]/.test(title)) {
    promises.push(
      getLyrics(title.replace(/\(.*\)/g, "").replace(/\[.*\]/g, ""), artistName)
    );
  }

  promises.push(reqWikia);
  promises.push(reqParolesNet);
  promises.push(reqLyricsMania1);
  promises.push(reqLyricsMania2);
  promises.push(reqLyricsMania3);
  promises.push(reqSweetLyrics);

  return Promise.any(promises).then((lyrics) => {
    return lyrics;
  });
}

export default async function lyrics(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const thisUrl = getSiteUrl();
  const body = req.body as { title: string; artistName: string };
  if (
    thisUrl &&
    req.headers.referer &&
    !req.headers.referer.startsWith(thisUrl)
  ) {
    res.status(401).end();
    return;
  }
  if (!body.artistName || !body.title) {
    return res.status(400).json({ error: "Missing artistName or title" });
  }
  try {
    const lyrics = await getLyrics(body.artistName, body.title);

    return res.json(lyrics);
  } catch (err) {
    console.error("lyrics", err);
    return res.status(404).json({ error: "No lyrics found" });
  }
}
