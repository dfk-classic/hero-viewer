import femaleIcon from "../../../assets/images/hero/icons/icon-female.png";
import maleIcon from "../../../assets/images/hero/icons/icon-male.png";

import fireIcon from "../../../assets/images/hero/icons/element-fire.png";
import waterIcon from "../../../assets/images/hero/icons/element-water.png";
import earthIcon from "../../../assets/images/hero/icons/element-earth.png";
import windIcon from "../../../assets/images/hero/icons/element-wind.png";
import lightningIcon from "../../../assets/images/hero/icons/element-lightning.png";
import iceIcon from "../../../assets/images/hero/icons/element-ice.png";
import lightIcon from "../../../assets/images/hero/icons/element-light.png";
import darkIcon from "../../../assets/images/hero/icons/element-dark.png";

import arcticIcon from "../../../assets/images/hero/icons/icon-arctic.png";
import cityIcon from "../../../assets/images/hero/icons/icon-city.png";
import desertIcon from "../../../assets/images/hero/icons/icon-desert.png";
import forestIcon from "../../../assets/images/hero/icons/icon-forest.png";
import islandIcon from "../../../assets/images/hero/icons/icon-island.png";
import mountainIcon from "../../../assets/images/hero/icons/icon-mountains.png";
import plainsIcon from "../../../assets/images/hero/icons/icon-plains.png";
import swampIcon from "../../../assets/images/hero/icons/icon-swamp.png";

import commonIcon from "../../../assets/images/hero/icons/rarity-common.png";
import uncommonIcon from "../../../assets/images/hero/icons/rarity-uncommon.png";
import rareIcon from "../../../assets/images/hero/icons/rarity-rare.png";
import legendaryIcon from "../../../assets/images/hero/icons/rarity-legendary.png";
import mythicIcon from "../../../assets/images/hero/icons/rarity-mythic.png";

// Trait-value → icon lookups. These replace the long per-trait `hero.x === "..." && <img/>` ladders the card used to repeat: one entry per documented trait value, missing keys resolve to undefined so the badge simply renders no image.
export const elementIcons: Record<string, string> = {
  fire: fireIcon,
  water: waterIcon,
  earth: earthIcon,
  wind: windIcon,
  lightning: lightningIcon,
  ice: iceIcon,
  light: lightIcon,
  dark: darkIcon,
};

export const backgroundIcons: Record<string, string> = {
  arctic: arcticIcon,
  city: cityIcon,
  desert: desertIcon,
  forest: forestIcon,
  island: islandIcon,
  mountains: mountainIcon,
  plains: plainsIcon,
  swamp: swampIcon,
};

export const rarityIcons: Record<string, string> = {
  common: commonIcon,
  uncommon: uncommonIcon,
  rare: rareIcon,
  legendary: legendaryIcon,
  mythic: mythicIcon,
};

export const genderIcons: Record<string, string> = {
  female: femaleIcon,
  male: maleIcon,
};
