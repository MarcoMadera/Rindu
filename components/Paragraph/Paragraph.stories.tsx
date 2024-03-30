import { PropsWithChildren, ReactElement } from "react";

import type { Meta as MetaObj } from "@storybook/react";

import { Heading, Paragraph as ParagraphComponent } from "components";
import { AsType } from "types/heading";

export default {
  title: "Design System/Paragraph",
  component: ParagraphComponent,
  parameters: {
    layout: "fullscreen",
  },
} as MetaObj;

const lyrics =
  "[Peso Pluma]\nSalió de su casa con la mente encendida\nHoy discutió con el otro, me la dejó servida (Servida)\nYa llama de una para recogerla\n\"Plan B\" en la radio canta con sus nena'\nUnos shots de clase azul y vamos directo al club\nPorque ella solo quiere, eh\n\n[Anitta & Peso Pluma]\nToa' la noche bellaqueo, bellaqueo, bellaqueo, bellaqueo\nBellaque-que-que-que-que-que-queo\nBellaqueo, bellaqueo, bellaqueo, bellaqueo\nBellaque-que-que-que-queo\nToa' la noche bellaqueo, bellaqueo, bellaqueo, bellaqueo\n\nBellaque-que-que-que-que-que-queo\nBellaqueo, bellaqueo, bellaqueo, bellaqueo\nBellaque-que-que-que-queo\n\n[Anitta]\n(Quedarme pegada) Quedarme pegada en la pared\nDJ, súbele al perreo (Perreo)\nMe gusta que me den como es\n\n[Anitta]\nY toa' la noche bellaqueo\nTodo el mundo quiere acercarse a mí\nPero yo no quiero a nadie\nEs que cuando tú lo mueve' así (Mueve' así)\nEl ambiente se pone peligroso pa' hacer fresquería'\nPapi, tú 'tás duro, ya tú lo sabía' (Yeah, yeah, yeah)\n\nTú eres mucho más de lo que pedía (Pedía)\n¿Quién diría que esta noche pasaría?\n\n[Peso Pluma]\nY no requiere el aval de nadie\nY ella dice, eh-eh-eh\nUnos shots de clase azul y vamos directo al club\nPorque ella solo quiere, eh\n\n[Peso Pluma & Anitta]\nToa' la noche bellaqueo, bellaqueo, bellaqueo, bellaqueo\nBellaque-que-que-que-que-que-queo\nBellaqueo, bellaqueo, bellaqueo, bellaqueo\nBellaque-que-que-que-queo\nToa' la noche bellaqueo, bellaqueo, bellaqueo, bellaqueo\nBellaque-que-que-que-que-que-queo\n\nBellaqueo, bellaqueo, bellaqueo, bellaqueo\nBellaque-que-que-que-queo\n\n[Peso Pluma]\nDale, bebé, hasta abajo y que el piso se desarme\nCamina con las Yeezy repartiendo los cristales\nDomina toa' la clase\nPero cuando está conmigo se derrite y se deshace\nNenita, báilele (-le), desaparézcame (-me)\nCorrecaminos explotando como un TNT (T)\nTú bellaqueándome (-me), ella bellaqueándo al cien (Cien)\nMamita, sin mucho pensarlo me voy con usted (-ted)\nNenita, báilele (-le), desaparézcame (-me)\nCorrecaminos explotando como un TNT (T)\nTú bellaqueándome (-me), ella bellaqueándo al cien (Cien)\n\nMamita, sin mucho pensarlo me voy con usted (-ted)\n\n[Anitta]\nQuedarme pegada en la pared\nDJ, súbele al perreo (Perreo)\nMe gusta que me den como es\n\n[Peso Pluma]\nToa' la noche bellaqueo, bellaqueo, bellaqueo, bellaqueo\nBellaque-que-que-que-que-que-queo\nBellaqueo, bellaqueo, bellaqueo, bellaqueo\nBellaque-que-que-que-queo\n\n[Anitta]\nAnitta, Anitta, ah\nPeso, Peso Pluma\n\nPura doble P (Ah)\nToma (Papi), toma, toma, toma\nToma, to-to-to-to-toma (Uh)\nToma (Uh), toma, toma, toma\nToma, to-to-to-to-toma";

const about =
  "Karly-Marina Loaiza, professionally known as Kali Uchis, is a Colombian-American singer-songwriter, record producer, music video director and fashion designer. She writes and produces most of her own music. The stylistic range of left-field pop artist Kali Uchis is reflected in the variety of her collaborators – an extensive genre-crossing list that includes Tyler, the Creator, Gorillaz, Daniel Caesar, Juanes, and BadBadNotGood.";

const bio = `Jermaine Lamarr Cole (born January 28, 1985), better known by his stage name J. Cole, is an American hip hop recording artist and record producer. Born in Frankfurt, Germany, Raised in Fayetteville, North Carolina, Cole posted songs on various internet forums at the age of 14 under the name "Blaza", but later switched to the name "Therapist".

Cole initially gained recognition as a rapper following the release of his debut mixtape, The Come Up, in early 2007 in which he also founded his record label Dreamville with label president Ibrahim Hamad. Intent on further pursuing a solo career as a rapper, he went on to release two additional mixtapes The Warm Up in 2009 and Friday Night Lights in 2010, after signing to Jay Z's Roc Nation imprint in 2009.

Cole released his debut studio album, Cole World: The Sideline Story, on September 27, 2011, which included the lead single "Work out". It debuted at number one on the U.S. Billboard 200, and was soon certified platinum by the Recording Industry Association of America (RIAA).

In June 18, 2013, Cole released his second studio album Born Sinner. Born Sinner sold 297,000 copies in its first week of release, and peaked at number one in it's third week of release. The album received mostly positive reviews from critics. On September 15, 2020, Born Sinner was certified double platinum. The album was supported by the lead single Power Trip with R&B artist Miguel, which was released on February 14.

On December 9, 2014, Cole, released his third studio album "2014 Forest Hills Drive". It was also the first album in 25 years at that time that went 3 times platinum with absolutely no features. The album debuted at number one on the Billboard 200, selling 353,000 copies in its first week and was certified platinum on March 31, 2015. The latter earned him his first Grammy Award nomination for Best Rap Album. The album was later accompanied by two documentaries "J. Cole: Road to Homecoming" in the period of December 16, 2015 – January 9, 2016 & "Forest Hills Drive: Homecoming" on January 9, 2016.

On 9 December, 2016, Cole released his fourth studio album "4 Your Eyez Only". The album debuted at number one on the Billboard 200 chart with 492,000 album-equivalent units, of which 363,000 were pure album sales, becoming Cole's fourth number one album. On January 12, 2017, the album was certified gold and certified platinum by the Recording Industry Association of America (RIAA) on April 7, 2017.

On April 20, 2018 Cole released his 5th studio album "KOD", after he revealed the album name two days after and held a couple listening sessions. The album featured his new alter ego kiLL edward under which he released the single "Tidal Wave (just a little reference)" on April 18th, 2018, 2 days before releasing KOD. The album was recieved with positive reviews from critics and debuted atop the US Billboard 200, selling 397,000 album-equivalent units in its first week (174,000 coming from pure sales), earning Cole his fifth consecutive number-one album in the country. The album broke several streaming records at the time of the release. On December 5, 2018 the album was certified platinum.

Cole released a 2 song EP called "Lewis Street" on July 22, 2020, which included the single "The Climb Back", which would later be featured on his 6th studio album. On May 7, 2021, Cole released the lead single "Interlude" one week before releasing his 6th studio album. Cole's 6th studio album "The Off-Season" was released on May 14, 2021. The album sold 282,000 album-equivalent units in its first week and would earn Cole his sixth consecutive number-one album in the country. 4 of the 12 songs debuted on the top ten on the US Billboard Hot 100, with the song "My Life" featuring 21 Savage & Morray peaking at number 2.`;

export const Lyrics = {
  render: ({ children }: PropsWithChildren): ReactElement => {
    return (
      <main>
        <Heading number={3} as={AsType.H2}>
          Lyrics
        </Heading>
        <ParagraphComponent>{children}</ParagraphComponent>
      </main>
    );
  },
  args: {
    children: lyrics,
  },
};

export const About = {
  args: {
    children: about,
  },
};

export const Bio = {
  args: {
    children: bio,
  },
};
