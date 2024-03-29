import { PropsWithChildren, ReactElement } from "react";

import type { Meta as MetaObj } from "@storybook/react";

import { Heading, Paragraph as ParagraphComponent } from "components";
import { AsType } from "types/heading";

export default {
  title: "Design System/Paragraph",
  component: ParagraphComponent,
  parameters: {
    layout: "fullscreen",
    container: {
      backgroundTheme: "dark",
    },
  },
} as MetaObj;

const lyrics =
  "[Peso Pluma]\nSalió de su casa con la mente encendida\nHoy discutió con el otro, me la dejó servida (Servida)\nYa llama de una para recogerla\n\"Plan B\" en la radio canta con sus nena'\nUnos shots de clase azul y vamos directo al club\nPorque ella solo quiere, eh\n\n[Anitta & Peso Pluma]\nToa' la noche bellaqueo, bellaqueo, bellaqueo, bellaqueo\nBellaque-que-que-que-que-que-queo\nBellaqueo, bellaqueo, bellaqueo, bellaqueo\nBellaque-que-que-que-queo\nToa' la noche bellaqueo, bellaqueo, bellaqueo, bellaqueo\n\nBellaque-que-que-que-que-que-queo\nBellaqueo, bellaqueo, bellaqueo, bellaqueo\nBellaque-que-que-que-queo\n\n[Anitta]\n(Quedarme pegada) Quedarme pegada en la pared\nDJ, súbele al perreo (Perreo)\nMe gusta que me den como es\n\n[Anitta]\nY toa' la noche bellaqueo\nTodo el mundo quiere acercarse a mí\nPero yo no quiero a nadie\nEs que cuando tú lo mueve' así (Mueve' así)\nEl ambiente se pone peligroso pa' hacer fresquería'\nPapi, tú 'tás duro, ya tú lo sabía' (Yeah, yeah, yeah)\n\nTú eres mucho más de lo que pedía (Pedía)\n¿Quién diría que esta noche pasaría?\n\n[Peso Pluma]\nY no requiere el aval de nadie\nY ella dice, eh-eh-eh\nUnos shots de clase azul y vamos directo al club\nPorque ella solo quiere, eh\n\n[Peso Pluma & Anitta]\nToa' la noche bellaqueo, bellaqueo, bellaqueo, bellaqueo\nBellaque-que-que-que-que-que-queo\nBellaqueo, bellaqueo, bellaqueo, bellaqueo\nBellaque-que-que-que-queo\nToa' la noche bellaqueo, bellaqueo, bellaqueo, bellaqueo\nBellaque-que-que-que-que-que-queo\n\nBellaqueo, bellaqueo, bellaqueo, bellaqueo\nBellaque-que-que-que-queo\n\n[Peso Pluma]\nDale, bebé, hasta abajo y que el piso se desarme\nCamina con las Yeezy repartiendo los cristales\nDomina toa' la clase\nPero cuando está conmigo se derrite y se deshace\nNenita, báilele (-le), desaparézcame (-me)\nCorrecaminos explotando como un TNT (T)\nTú bellaqueándome (-me), ella bellaqueándo al cien (Cien)\nMamita, sin mucho pensarlo me voy con usted (-ted)\nNenita, báilele (-le), desaparézcame (-me)\nCorrecaminos explotando como un TNT (T)\nTú bellaqueándome (-me), ella bellaqueándo al cien (Cien)\n\nMamita, sin mucho pensarlo me voy con usted (-ted)\n\n[Anitta]\nQuedarme pegada en la pared\nDJ, súbele al perreo (Perreo)\nMe gusta que me den como es\n\n[Peso Pluma]\nToa' la noche bellaqueo, bellaqueo, bellaqueo, bellaqueo\nBellaque-que-que-que-que-que-queo\nBellaqueo, bellaqueo, bellaqueo, bellaqueo\nBellaque-que-que-que-queo\n\n[Anitta]\nAnitta, Anitta, ah\nPeso, Peso Pluma\n\nPura doble P (Ah)\nToma (Papi), toma, toma, toma\nToma, to-to-to-to-toma (Uh)\nToma (Uh), toma, toma, toma\nToma, to-to-to-to-toma";

const about =
  "Karly-Marina Loaiza, professionally known as Kali Uchis, is a Colombian-American singer-songwriter, record producer, music video director and fashion designer. She writes and produces most of her own music. The stylistic range of left-field pop artist Kali Uchis is reflected in the variety of her collaborators – an extensive genre-crossing list that includes Tyler, the Creator, Gorillaz, Daniel Caesar, Juanes, and BadBadNotGood.";

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
