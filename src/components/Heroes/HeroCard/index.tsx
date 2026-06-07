import React, { useMemo, useState } from "react";
import styled from "styled-components";
import styles from "./styles.module.css";
import { isActivateKey } from "./cardKeys";

import Hero from "../Hero";
import HeroInfo from "../HeroInfo";
import HeroStatsSkills from "../HeroStatsSkills";
import HeroStatsGrowth from "../HeroStatsGrowth";
import HeroStatsAbilities from "../HeroStatsAbilities";
import HeroStatsRecessive from "../HeroStatsRecessive";
import HeroCardTabs from "../HeroCardTabs";

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

import healthIcon from "../../../assets/images/hero/icons/icon-health.png";
import manaIcon from "../../../assets/images/hero/icons/icon-mana.png";

import survivorIcon from "../../../assets/images/gui/survivor_badge_2x.png";
import type { Hero as HeroType } from "../../../types/hero";

// How long the hero-id badge shows "copied!" before reverting to the id.
const COPIED_FEEDBACK_MS = 900;

interface HeroCardProps {
  hero: HeroType;
  isFlipped?: boolean;
  isAnimated?: boolean;
  flipToggle?: boolean;
}

/* exported component */
const HeroCard = ({
  hero,
  isFlipped,
  isAnimated,
  flipToggle,
}: HeroCardProps) => {
  const [activeTab, setActiveTab] = useState("Stats");
  const [Flipped, setFlipped] = useState(isFlipped);

  type DataPage = {
    label: string;
    symbol: string;
    content: React.ReactNode;
    recessive?: boolean;
    sup?: string;
  };
  // Back-of-card pages, HONK Marketplace tab set: Stats / Growth / Abilities / Recessive 1 / Recessive 2. Memoised on the hero so the array identity stays stable across flip, tab-change and copy-feedback re-renders — that restores HeroCardTabs's React.memo (it was handed a freshly-built array every render) and builds each page's content node once per hero instead of on every interaction.
  const dataPages = useMemo<DataPage[]>(() => {
    const pages: DataPage[] = [
      {
        label: "Stats",
        symbol: "\u{1F4CA}",
        content: (
          <>
            <HeroStatsSkills hero={hero} />
            {hero && hero.owner.name ? (
              <div className={styles.heroOwner}>Owned by: {hero.owner.name}</div>
            ) : null}
            {hero && hero.owner.owner ? (
              <div className={styles.heroHash}>{hero.owner.owner}</div>
            ) : null}
          </>
        ),
      },
    ];
    if (hero.statGrowth && hero.statGrowth.primary) {
      pages.push({
        label: "Growth",
        symbol: "\u{1F4C8}",
        content: <HeroStatsGrowth hero={hero} />,
      });
    }
    if (hero.genes) {
      pages.push(
        {
          label: "Abilities",
          symbol: "⚔️",
          content: <HeroStatsAbilities hero={hero} />,
        },
        {
          label: "Recessive 1",
          symbol: "\u{1F9EC}",
          recessive: true,
          content: <HeroStatsRecessive hero={hero} slot="r1" />,
        },
        {
          label: "Recessive 2",
          symbol: "\u{1F9EC}",
          recessive: true,
          sup: "2",
          content: <HeroStatsRecessive hero={hero} slot="r2" />,
        }
      );
    }
    return pages;
  }, [hero]);
  const activePage =
    dataPages.find((p) => p.label === activeTab) ?? dataPages[0];

  // Copy the hero id to the clipboard and briefly confirm in place. Shared by the pointer (onClick) and keyboard (onKeyDown) paths so both behave identically.
  const copyHeroId = (el: HTMLDivElement) => {
    navigator.clipboard.writeText(String(hero.id));
    const original = el.textContent;
    el.textContent = "copied!";
    setTimeout(() => {
      el.textContent = original;
    }, COPIED_FEEDBACK_MS);
  };

  // Make the whole card a keyboard-operable toggle, but only when it is actually flippable. aria-pressed exposes the flipped state, so role="button" is required here for it to carry meaning to assistive tech.
  const flipToggleProps: React.HTMLAttributes<HTMLDivElement> = flipToggle
    ? {
        role: "button",
        tabIndex: 0,
        "aria-label": "Flip hero card",
        "aria-pressed": Boolean(Flipped),
        onKeyDown: (e) => {
          if (!isActivateKey(e.key)) return;
          e.preventDefault();
          setFlipped(!Flipped);
        },
      }
    : {};

  return (
    <>
      {hero && (
        <CardContainer key={hero.id}>
          <div
            onClick={() => {
              if (flipToggle) setFlipped(!Flipped);
            }}
            {...flipToggleProps}
            className={`
          ${styles.heroCard}
          ${isAnimated && styles.animate}
          ${flipToggle ? styles.flippable : ""}
          ${hero.shiny ? styles.shiny : ""}
          ${hero.shiny ? styles[`shiny${hero.shinyStyle}`] : ""}
          ${styles[`${hero.element}`]}
          ${styles[`${hero.rarity}`]}
          ${Flipped || isFlipped ? styles.flipped : ""}
          `}
          >
            <div className={styles.heroCardFront}>
              {hero.pjstatus === "SURVIVED" && (
                <img
                  className={styles.perilousJourneyIcon}
                  src={survivorIcon}
                  alt=""
                />
              )}
              <div
                className={styles.heroID}
                style={{ cursor: "pointer" }}
                title="Click to copy hero ID"
                role="button"
                tabIndex={0}
                aria-label={`Copy hero ID ${hero.id}`}
                onClick={(e) => {
                  e.stopPropagation();
                  copyHeroId(e.currentTarget);
                }}
                onKeyDown={(e) => {
                  if (!isActivateKey(e.key)) return;
                  e.preventDefault();
                  e.stopPropagation(); // inner control, never flips the card
                  copyHeroId(e.currentTarget);
                }}
              >
                #{hero.id}
              </div>
              <div className={styles.heroHealth}>
                <img src={healthIcon} alt="" />
                {hero.stats.hp}
                <span className={styles.tooltip}>Health</span>
              </div>
              <div className={styles.heroMana}>
                <img src={manaIcon} alt="" />
                {hero.stats.mp}
                <span className={styles.tooltip}>Mana</span>
              </div>
              <div className={styles.heroCardFrame}>
                <div className={`${styles.specials} ${styles.row}`}>
                  <div className={styles.icon}>
                    {hero.element === "fire" && <img src={fireIcon} alt="" />}
                    {hero.element === "water" && <img src={waterIcon} alt="" />}
                    {hero.element === "earth" && <img src={earthIcon} alt="" />}
                    {hero.element === "wind" && <img src={windIcon} alt="" />}
                    {hero.element === "lightning" && (
                      <img src={lightningIcon} alt="" />
                    )}
                    {hero.element === "ice" && <img src={iceIcon} alt="" />}
                    {hero.element === "light" && <img src={lightIcon} alt="" />}
                    {hero.element === "dark" && <img src={darkIcon} alt="" />}
                    <span className={styles.tooltip}>{hero.element}</span>
                  </div>
                  <div className={styles.icon}>
                    {hero.visualGenes.background === "arctic" && (
                      <img src={arcticIcon} alt="" />
                    )}
                    {hero.visualGenes.background === "city" && (
                      <img src={cityIcon} alt="" />
                    )}
                    {hero.visualGenes.background === "desert" && (
                      <img src={desertIcon} alt="" />
                    )}
                    {hero.visualGenes.background === "forest" && (
                      <img src={forestIcon} alt="" />
                    )}
                    {hero.visualGenes.background === "island" && (
                      <img src={islandIcon} alt="" />
                    )}
                    {hero.visualGenes.background === "mountains" && (
                      <img src={mountainIcon} alt="" />
                    )}
                    {hero.visualGenes.background === "plains" && (
                      <img src={plainsIcon} alt="" />
                    )}
                    {hero.visualGenes.background === "swamp" && (
                      <img src={swampIcon} alt="" />
                    )}
                    <span className={styles.tooltip}>{hero.background}</span>
                  </div>
                  <div className={styles.icon}>
                    <img
                      src={hero.gender === "female" ? femaleIcon : maleIcon}
                      alt=""
                    />
                    <span className={styles.tooltip}>{hero.gender}</span>
                  </div>
                </div>

                <div className={styles.heroName}>
                  <span>{hero.name}</span>
                </div>

                <div className={styles.heroPreview}>
                  <div className={styles.heroGlow} />
                  <Hero hero={hero} />
                </div>

                <div className={styles.heroInfo}>
                  <div className={styles.class}>
                    {hero.class}
                    <span className={styles.subClass}>{hero.subClass}</span>
                  </div>
                  <div className={styles.cardRarity}>
                    <div className={styles.icon}>
                      {hero.rarity === "common" && (
                        <img src={commonIcon} alt="" />
                      )}
                      {hero.rarity === "uncommon" && (
                        <img src={uncommonIcon} alt="" />
                      )}
                      {hero.rarity === "rare" && <img src={rareIcon} alt="" />}
                      {hero.rarity === "legendary" && (
                        <img src={legendaryIcon} alt="" />
                      )}
                      {hero.rarity === "mythic" && (
                        <img src={mythicIcon} alt="" />
                      )}
                      <span className={styles.tooltip}>{hero.rarity}</span>
                    </div>
                  </div>
                  <div className={styles.level}>
                    Level {hero.level}
                    <span className={styles.subClass}>
                      Gen {hero.generation}
                    </span>
                  </div>
                </div>

                <HeroInfo hero={hero} />
              </div>
            </div>
            <div className={styles.heroCardBack}>
              <div className={styles.heroCardFrame}>
                <div className={`${styles.specials} ${styles.row}`}>
                  <div className={styles.icon}>
                    {hero.element === "fire" && <img src={fireIcon} alt="" />}
                    {hero.element === "water" && <img src={waterIcon} alt="" />}
                    {hero.element === "earth" && <img src={earthIcon} alt="" />}
                    {hero.element === "wind" && <img src={windIcon} alt="" />}
                    {hero.element === "lightning" && (
                      <img src={lightningIcon} alt="" />
                    )}
                    {hero.element === "ice" && <img src={iceIcon} alt="" />}
                    {hero.element === "light" && <img src={lightIcon} alt="" />}
                    {hero.element === "dark" && <img src={darkIcon} alt="" />}
                    <span className={styles.tooltip}>{hero.element}</span>
                  </div>
                  <div className={styles.icon}>
                    {hero.visualGenes.background === "arctic" && (
                      <img src={arcticIcon} alt="" />
                    )}
                    {hero.visualGenes.background === "city" && (
                      <img src={cityIcon} alt="" />
                    )}
                    {hero.visualGenes.background === "desert" && (
                      <img src={desertIcon} alt="" />
                    )}
                    {hero.visualGenes.background === "forest" && (
                      <img src={forestIcon} alt="" />
                    )}
                    {hero.visualGenes.background === "island" && (
                      <img src={islandIcon} alt="" />
                    )}
                    {hero.visualGenes.background === "mountains" && (
                      <img src={mountainIcon} alt="" />
                    )}
                    {hero.visualGenes.background === "plains" && (
                      <img src={plainsIcon} alt="" />
                    )}
                    {hero.visualGenes.background === "swamp" && (
                      <img src={swampIcon} alt="" />
                    )}
                    <span className={styles.tooltip}>{hero.background}</span>
                  </div>
                  <div className={styles.icon}>
                    <img
                      src={hero.gender === "female" ? femaleIcon : maleIcon}
                      alt=""
                    />
                    <span className={styles.tooltip}>{hero.gender}</span>
                  </div>
                </div>

                <div className={styles.heroStats}>
                  <div className={styles.heroFrame}>{activePage.content}</div>
                </div>
              </div>
              <HeroCardTabs
                tabs={dataPages}
                activeTab={activePage.label}
                onTabChange={setActiveTab}
              />
            </div>
          </div>
        </CardContainer>
      )}
    </>
  );
};

export default React.memo(HeroCard);

// Styled Components
const CardContainer = styled.div.attrs(() => ({
  className: "cardContainer",
}))`
  perspective: 1000px;
  width: 300px;
  height: 430px;
  margin: 0 auto;
`;
