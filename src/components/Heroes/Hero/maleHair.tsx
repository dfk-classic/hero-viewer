import React from "react"; // useState
import styles from "../HeroCard/styles.module.css";

/* MALE HAIR */
import emptyHighlight from "../../../assets/images/hero/male/hair/empty-highlight.svg";
import maleHair0frontbase from "../../../assets/images/hero/male/hair/hair0-front-base.svg?react";
import maleHair0fronthighlight from "../../../assets/images/hero/male/hair/hair0-front-highlight.svg";
import maleHair0frontshadow from "../../../assets/images/hero/male/hair/hair0-front-shadow.svg";

import maleHair1backbase from "../../../assets/images/hero/male/hair/hair1-back-base.svg?react";
import maleHair1backhighlight from "../../../assets/images/hero/male/hair/hair1-back-highlight.svg";
import maleHair1backshadow from "../../../assets/images/hero/male/hair/hair1-back-shadow.svg";
import maleHair1frontbase from "../../../assets/images/hero/male/hair/hair1-front-base.svg?react";
import maleHair1fronthighlight from "../../../assets/images/hero/male/hair/hair1-front-highlight.svg";
import maleHair1frontshadow from "../../../assets/images/hero/male/hair/hair1-front-shadow.svg";

import maleHair2backbase from "../../../assets/images/hero/male/hair/hair2-back-base.svg?react";
import maleHair2backhighlight from "../../../assets/images/hero/male/hair/hair2-back-highlight.svg";
import maleHair2backshadow from "../../../assets/images/hero/male/hair/hair2-back-shadow.svg";
import maleHair2frontbase from "../../../assets/images/hero/male/hair/hair2-front-base.svg?react";
import maleHair2fronthighlight from "../../../assets/images/hero/male/hair/hair2-front-highlight.svg";
import maleHair2frontshadow from "../../../assets/images/hero/male/hair/hair2-front-shadow.svg";

import maleHair3backbase from "../../../assets/images/hero/male/hair/hair3-back-base.svg?react";
import maleHair3backhighlight from "../../../assets/images/hero/male/hair/hair3-back-highlight.svg";
import maleHair3backshadow from "../../../assets/images/hero/male/hair/hair3-back-shadow.svg";
import maleHair3frontbase from "../../../assets/images/hero/male/hair/hair3-front-base.svg?react";
import maleHair3fronthighlight from "../../../assets/images/hero/male/hair/hair3-front-highlight.svg";
import maleHair3frontshadow from "../../../assets/images/hero/male/hair/hair3-front-shadow.svg";

import maleHair4frontbase from "../../../assets/images/hero/male/hair/hair4-front-base.svg?react";
import maleHair4fronthighlight from "../../../assets/images/hero/male/hair/hair4-front-highlight.svg";
import maleHair4frontshadow from "../../../assets/images/hero/male/hair/hair4-front-shadow.svg";

import maleHair5frontbase from "../../../assets/images/hero/male/hair/hair5-front-base.svg?react";
import maleHair5fronthighlight from "../../../assets/images/hero/male/hair/hair5-front-highlight.svg";
import maleHair5frontshadow from "../../../assets/images/hero/male/hair/hair5-front-shadow.svg";

import maleHair6frontbase from "../../../assets/images/hero/male/hair/hair6-front-base.svg?react";
import maleHair6fronthighlight from "../../../assets/images/hero/male/hair/hair6-front-highlight.svg";
import maleHair6frontshadow from "../../../assets/images/hero/male/hair/hair6-front-shadow.svg";

import maleHair7frontbase from "../../../assets/images/hero/male/hair/hair7-front-base.svg?react";
import maleHair7fronthighlight from "../../../assets/images/hero/male/hair/hair7-front-highlight.svg";
import maleHair7frontshadow from "../../../assets/images/hero/male/hair/hair7-front-shadow.svg";

import maleHair8frontbase from "../../../assets/images/hero/male/hair/hair8-front-base.svg?react";
import maleHair8fronthighlight from "../../../assets/images/hero/male/hair/hair8-front-highlight.svg";
import maleHair8frontshadow from "../../../assets/images/hero/male/hair/hair8-front-shadow.svg";

import maleHair9frontbase from "../../../assets/images/hero/male/hair/hair9-front-base.svg?react";
import maleHair9fronthighlight from "../../../assets/images/hero/male/hair/hair9-front-highlight.svg";
import maleHair9frontshadow from "../../../assets/images/hero/male/hair/hair9-front-shadow.svg";

import maleHair10frontbase from "../../../assets/images/hero/male/hair/hair10-front-base.svg?react";
import maleHair10frontshadow from "../../../assets/images/hero/male/hair/hair10-front-shadow.svg";

import maleHair11frontbase from "../../../assets/images/hero/male/hair/hair11-front-base.svg?react";
import maleHair11frontshadow from "../../../assets/images/hero/male/hair/hair11-front-shadow.svg";

import maleHair12frontbase from "../../../assets/images/hero/male/hair/hair12-front-base.svg?react";
import maleHair12fronthighlight from "../../../assets/images/hero/male/hair/hair12-front-highlight.svg";
import maleHair12frontshadow from "../../../assets/images/hero/male/hair/hair12-front-shadow.svg";

import maleHair13backbase from "../../../assets/images/hero/male/hair/hair13-back-base.svg?react";
import maleHair13backhighlight from "../../../assets/images/hero/male/hair/hair13-back-highlight.svg";
import maleHair13backshadow from "../../../assets/images/hero/male/hair/hair13-back-shadow.svg";
import maleHair13frontbase from "../../../assets/images/hero/male/hair/hair13-front-base.svg?react";
import maleHair13fronthighlight from "../../../assets/images/hero/male/hair/hair13-front-highlight.svg";
import maleHair13frontshadow from "../../../assets/images/hero/male/hair/hair13-front-shadow.svg";

import maleHair14frontbase from "../../../assets/images/hero/male/hair/hair14-front-base.svg?react";
import maleHair14fronthighlight from "../../../assets/images/hero/male/hair/hair14-front-highlight.svg";
import maleHair14frontshadow from "../../../assets/images/hero/male/hair/hair14-front-shadow.svg";

import maleHair15frontbase from "../../../assets/images/hero/male/hair/hair15-front-base.svg?react";
import maleHair15fronthighlight from "../../../assets/images/hero/male/hair/hair15-front-highlight.svg";
import maleHair15frontshadow from "../../../assets/images/hero/male/hair/hair15-front-shadow.svg";

import maleHair16frontbase from "../../../assets/images/hero/male/hair/hair16-front-base.svg?react";
import maleHair16fronthighlight from "../../../assets/images/hero/male/hair/hair16-front-highlight.svg";
import maleHair16frontshadow from "../../../assets/images/hero/male/hair/hair16-front-shadow.svg";

import maleHair17frontbase from "../../../assets/images/hero/male/hair/hair17-front-base.svg?react";
import maleHair17fronthighlight from "../../../assets/images/hero/male/hair/hair17-front-highlight.svg";
import maleHair17frontshadow from "../../../assets/images/hero/male/hair/hair17-front-shadow.svg";

import maleHair18frontbase from "../../../assets/images/hero/male/hair/hair18-front-base.svg?react";
import maleHair18fronthighlight from "../../../assets/images/hero/male/hair/hair18-front-highlight.svg";
import maleHair18frontshadow from "../../../assets/images/hero/male/hair/hair18-front-shadow.svg";

import maleHair19frontbase from "../../../assets/images/hero/male/hair/hair19-front-base.svg?react";
import maleHair19fronthighlight from "../../../assets/images/hero/male/hair/hair19-front-highlight.svg";
import maleHair19frontshadow from "../../../assets/images/hero/male/hair/hair19-front-shadow.svg";

import maleHair20backbase from "../../../assets/images/hero/male/hair/hair20-back-base.svg?react";
import maleHair20backhighlight from "../../../assets/images/hero/male/hair/hair20-back-highlight.svg";
import maleHair20backshadow from "../../../assets/images/hero/male/hair/hair20-back-shadow.svg";
import maleHair20frontbase from "../../../assets/images/hero/male/hair/hair20-front-base.svg?react";
import maleHair20fronthighlight from "../../../assets/images/hero/male/hair/hair20-front-highlight.svg";
import maleHair20frontshadow from "../../../assets/images/hero/male/hair/hair20-front-shadow.svg";

import maleHair21frontbase from "../../../assets/images/hero/male/hair/hair21-front-base.svg?react";
import maleHair21frontshadow from "../../../assets/images/hero/male/hair/hair21-front-shadow.svg";

import maleHair22frontbase from "../../../assets/images/hero/male/hair/hair22-front-base.svg?react";
import maleHair22fronthighlight from "../../../assets/images/hero/male/hair/hair22-front-highlight.svg";
import maleHair22frontshadow from "../../../assets/images/hero/male/hair/hair22-front-shadow.svg";

import maleHair23frontbase from "../../../assets/images/hero/male/hair/hair23-front-base.svg?react";
import maleHair23fronthighlight from "../../../assets/images/hero/male/hair/hair23-front-highlight.svg";
import maleHair23frontshadow from "../../../assets/images/hero/male/hair/hair23-front-shadow.svg";

import maleHair24backbase from "../../../assets/images/hero/male/hair/hair24-back-base.svg?react";
import maleHair24backhighlight from "../../../assets/images/hero/male/hair/hair24-back-highlight.svg";
import maleHair24backshadow from "../../../assets/images/hero/male/hair/hair24-back-shadow.svg";
import maleHair24frontbase from "../../../assets/images/hero/male/hair/hair24-front-base.svg?react";
import maleHair24fronthighlight from "../../../assets/images/hero/male/hair/hair24-front-highlight.svg";
import maleHair24frontshadow from "../../../assets/images/hero/male/hair/hair24-front-shadow.svg";

import maleHair25frontbase from "../../../assets/images/hero/male/hair/hair25-front-base.svg?react";
import maleHair25fronthighlight from "../../../assets/images/hero/male/hair/hair25-front-highlight.svg";
import maleHair25frontshadow from "../../../assets/images/hero/male/hair/hair25-front-shadow.svg";
import maleHair26frontbase from "../../../assets/images/hero/male/hair/hair26-front-base.svg?react";
import maleHair26frontshadow from "../../../assets/images/hero/male/hair/hair26-front-shadow.svg";

import maleHair27frontbase from "../../../assets/images/hero/male/hair/hair27-front-base.svg?react";
import maleHair27fronthighlight from "../../../assets/images/hero/male/hair/hair27-front-highlight.svg";
import maleHair27frontshadow from "../../../assets/images/hero/male/hair/hair27-front-shadow.svg";

import maleHair28frontbase from "../../../assets/images/hero/male/hair/hair28-front-base.svg?react";
import maleHair28fronthighlight from "../../../assets/images/hero/male/hair/hair28-front-highlight.svg";
import maleHair28frontshadow from "../../../assets/images/hero/male/hair/hair28-front-shadow.svg";

import maleHair29frontbase from "../../../assets/images/hero/male/hair/hair29-front-base.svg?react";
import maleHair29fronthighlight from "../../../assets/images/hero/male/hair/hair29-front-highlight.svg";
import maleHair29frontshadow from "../../../assets/images/hero/male/hair/hair29-front-shadow.svg";

import maleHair30frontbase from "../../../assets/images/hero/male/hair/hair30-front-base.svg?react";
import maleHair30fronthighlight from "../../../assets/images/hero/male/hair/hair30-front-highlight.svg";
import maleHair30frontshadow from "../../../assets/images/hero/male/hair/hair30-front-shadow.svg";

type SvgComponent = React.FunctionComponent<React.ComponentProps<"svg"> & { title?: string }>;

interface GetHairProps {
  backbase?: SvgComponent;
  backhighlight?: string | undefined;
  backshadow?: string | undefined;
  frontbase?: SvgComponent;
  fronthighlight?: string | undefined;
  frontshadow?: string | undefined;
}
// write a getter functions that uses a switch statement tto use every import
const getHair = (id: string | number): GetHairProps => {
  switch (id) {
    case 0: {
      return {
        backbase: undefined,
        backhighlight: undefined,
        backshadow: undefined,
        frontbase: maleHair0frontbase,
        fronthighlight: maleHair0fronthighlight,
        frontshadow: maleHair0frontshadow,
      };
    }
    case 1: {
      return {
        backbase: maleHair1backbase,
        backhighlight: maleHair1backhighlight,
        backshadow: maleHair1backshadow,
        frontbase: maleHair1frontbase,
        fronthighlight: maleHair1fronthighlight,
        frontshadow: maleHair1frontshadow,
      };
    }
    case 2: {
      return {
        backbase: maleHair2backbase,
        backhighlight: maleHair2backhighlight,
        backshadow: maleHair2backshadow,
        frontbase: maleHair2frontbase,
        fronthighlight: maleHair2fronthighlight,
        frontshadow: maleHair2frontshadow,
      };
    }
    case 3: {
      return {
        backbase: maleHair3backbase,
        backhighlight: maleHair3backhighlight,
        backshadow: maleHair3backshadow,
        frontbase: maleHair3frontbase,
        fronthighlight: maleHair3fronthighlight,
        frontshadow: maleHair3frontshadow,
      };
    }
    case 4: {
      return {
        backbase: undefined,
        backhighlight: undefined,
        backshadow: undefined,
        frontbase: maleHair4frontbase,
        fronthighlight: maleHair4fronthighlight,
        frontshadow: maleHair4frontshadow,
      };
    }
    case 5: {
      return {
        backbase: undefined,
        backhighlight: undefined,
        backshadow: undefined,
        frontbase: maleHair5frontbase,
        fronthighlight: maleHair5fronthighlight,
        frontshadow: maleHair5frontshadow,
      };
    }
    case 6: {
      return {
        backbase: undefined,
        backhighlight: undefined,
        backshadow: undefined,
        frontbase: maleHair6frontbase,
        fronthighlight: maleHair6fronthighlight,
        frontshadow: maleHair6frontshadow,
      };
    }
    case 7: {
      return {
        backbase: undefined,
        backhighlight: undefined,
        backshadow: undefined,
        frontbase: maleHair7frontbase,
        fronthighlight: maleHair7fronthighlight,
        frontshadow: maleHair7frontshadow,
      };
    }
    case 8: {
      return {
        backbase: undefined,
        backhighlight: undefined,
        backshadow: undefined,
        frontbase: maleHair8frontbase,
        fronthighlight: maleHair8fronthighlight,
        frontshadow: maleHair8frontshadow,
      };
    }
    case 9: {
      return {
        backbase: undefined,
        backhighlight: undefined,
        backshadow: undefined,
        frontbase: maleHair9frontbase,
        fronthighlight: maleHair9fronthighlight,
        frontshadow: maleHair9frontshadow,
      };
    }
    case 10: {
      return {
        backbase: undefined,
        backhighlight: undefined,
        backshadow: undefined,
        frontbase: maleHair10frontbase,
        fronthighlight: emptyHighlight,
        frontshadow: maleHair10frontshadow,
      };
    }
    case 11: {
      return {
        backbase: undefined,
        backhighlight: undefined,
        backshadow: undefined,
        frontbase: maleHair11frontbase,
        fronthighlight: emptyHighlight,
        frontshadow: maleHair11frontshadow,
      };
    }
    case 12: {
      return {
        backbase: undefined,
        backhighlight: undefined,
        backshadow: undefined,
        frontbase: maleHair12frontbase,
        fronthighlight: maleHair12fronthighlight,
        frontshadow: maleHair12frontshadow,
      };
    }
    case 13: {
      return {
        backbase: maleHair13backbase,
        backhighlight: maleHair13backhighlight,
        backshadow: maleHair13backshadow,
        frontbase: maleHair13frontbase,
        fronthighlight: maleHair13fronthighlight,
        frontshadow: maleHair13frontshadow,
      };
    }
    case 14: {
      return {
        backbase: undefined,
        backhighlight: undefined,
        backshadow: undefined,
        frontbase: maleHair14frontbase,
        fronthighlight: maleHair14fronthighlight,
        frontshadow: maleHair14frontshadow,
      };
    }
    case 15: {
      return {
        backbase: undefined,
        backhighlight: undefined,
        backshadow: undefined,
        frontbase: maleHair15frontbase,
        fronthighlight: maleHair15fronthighlight,
        frontshadow: maleHair15frontshadow,
      };
    }
    case 16: {
      return {
        backbase: undefined,
        backhighlight: undefined,
        backshadow: undefined,
        frontbase: maleHair16frontbase,
        fronthighlight: maleHair16fronthighlight,
        frontshadow: maleHair16frontshadow,
      };
    }
    case 17: {
      return {
        backbase: undefined,
        backhighlight: undefined,
        backshadow: undefined,
        frontbase: maleHair17frontbase,
        fronthighlight: maleHair17fronthighlight,
        frontshadow: maleHair17frontshadow,
      };
    }
    case 18: {
      return {
        backbase: undefined,
        backhighlight: undefined,
        backshadow: undefined,
        frontbase: maleHair18frontbase,
        fronthighlight: maleHair18fronthighlight,
        frontshadow: maleHair18frontshadow,
      };
    }
    case 19: {
      return {
        backbase: undefined,
        backhighlight: undefined,
        backshadow: undefined,
        frontbase: maleHair19frontbase,
        fronthighlight: maleHair19fronthighlight,
        frontshadow: maleHair19frontshadow,
      };
    }
    case 20: {
      return {
        backbase: maleHair20backbase,
        backhighlight: maleHair20backhighlight,
        backshadow: maleHair20backshadow,
        frontbase: maleHair20frontbase,
        fronthighlight: maleHair20fronthighlight,
        frontshadow: maleHair20frontshadow,
      };
    }
    case 21: {
      return {
        backbase: undefined,
        backhighlight: undefined,
        backshadow: undefined,
        frontbase: maleHair21frontbase,
        fronthighlight: emptyHighlight,
        frontshadow: maleHair21frontshadow,
      };
    }
    case 22: {
      return {
        backbase: undefined,
        backhighlight: undefined,
        backshadow: undefined,
        frontbase: maleHair22frontbase,
        fronthighlight: maleHair22fronthighlight,
        frontshadow: maleHair22frontshadow,
      };
    }
    case 23: {
      return {
        backbase: undefined,
        backhighlight: undefined,
        backshadow: undefined,
        frontbase: maleHair23frontbase,
        fronthighlight: maleHair23fronthighlight,
        frontshadow: maleHair23frontshadow,
      };
    }
    case 24: {
      return {
        backbase: maleHair24backbase,
        backhighlight: maleHair24backhighlight,
        backshadow: maleHair24backshadow,
        frontbase: maleHair24frontbase,
        fronthighlight: maleHair24fronthighlight,
        frontshadow: maleHair24frontshadow,
      };
    }
    case 25: {
      return {
        backbase: undefined,
        backhighlight: undefined,
        backshadow: undefined,
        frontbase: maleHair25frontbase,
        fronthighlight: maleHair25fronthighlight,
        frontshadow: maleHair25frontshadow,
      };
    }
    case 26: {
      return {
        backbase: undefined,
        backhighlight: undefined,
        backshadow: undefined,
        frontbase: maleHair26frontbase,
        fronthighlight: emptyHighlight,
        frontshadow: maleHair26frontshadow,
      };
    }
    case 27: {
      return {
        backbase: undefined,
        backhighlight: undefined,
        backshadow: undefined,
        frontbase: maleHair27frontbase,
        fronthighlight: maleHair27fronthighlight,
        frontshadow: maleHair27frontshadow,
      };
    }
    case 28: {
      return {
        backbase: undefined,
        backhighlight: undefined,
        backshadow: undefined,
        frontbase: maleHair28frontbase,
        fronthighlight: maleHair28fronthighlight,
        frontshadow: maleHair28frontshadow,
      };
    }
    case 29: {
      return {
        backbase: undefined,
        backhighlight: undefined,
        backshadow: undefined,
        frontbase: maleHair29frontbase,
        fronthighlight: maleHair29fronthighlight,
        frontshadow: maleHair29frontshadow,
      };
    }
    case 30: {
      return {
        backbase: undefined,
        backhighlight: undefined,
        backshadow: undefined,
        frontbase: maleHair30frontbase,
        fronthighlight: maleHair30fronthighlight,
        frontshadow: maleHair30frontshadow,
      };
    }
    default: {
      return {};
    }
  }
};

const MaleHair = ({ hairId, hairColor }: { hairId?: string | number; hairColor?: string | number }) => {
  const config = getHair(hairId ?? "");
  const BackBase = config.backbase;
  const FrontBase = config.frontbase;
  return (
    <>
      {BackBase && (
        <div className={`${styles.heroHairBack} ${styles.hair}`}>
          <>
            <img src={config.backhighlight} className={styles.highlight} />
            <img src={config.backshadow} className={styles.shadow} />
            <BackBase className={styles.color} stroke={`#${hairColor}`} />
          </>
        </div>
      )}
      {FrontBase && (
        <div className={`${styles.heroHairFront} ${styles.hair}`}>
          <>
            <img src={config.fronthighlight} className={styles.highlight} />
            <img src={config.frontshadow} className={styles.shadow} />
            <FrontBase className={styles.color} stroke={`#${hairColor}`} />
          </>
        </div>
      )}
    </>
  );
};

export default MaleHair;
