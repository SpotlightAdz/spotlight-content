import React from "react";
import { Composition } from "remotion";
import { RestaurantMistakes } from "./reels/RestaurantMistakes";
import R from "./reels/R.json";
import { BrandMistakes } from "./reels/BrandMistakes";
import R1 from "./reels/R1.json";
import { HappyFitnessSystem } from "./reels/HappyFitnessSystem";
import R2 from "./reels/R2.json";
import { ShootDay } from "./reels/ShootDay";
import R3 from "./reels/R3.json";
import { PovBchhal } from "./reels/PovBchhal";
import R4 from "./reels/R4.json";
import { FollowersMyth } from "./reels/FollowersMyth";
import R5 from "./reels/R5.json";
import { CaptionFormula, CAPTION_SLIDES, PackQuiz, PACK_SLIDES } from "./carousels/W3Carousels";
import { ReelIdeas, REEL_IDEAS_SLIDES } from "./carousels/ReelIdeas";

export const Root: React.FC = () => (
  <>
    <Composition id="RestaurantMistakes" component={RestaurantMistakes} durationInFrames={Math.round(R.total * 30)} fps={30} width={1080} height={1920} />
    <Composition id="ReelIdeas" component={ReelIdeas} durationInFrames={REEL_IDEAS_SLIDES} fps={30} width={1080} height={1350} />
    <Composition id="BrandMistakes" component={BrandMistakes} durationInFrames={Math.round(R1.total * 30)} fps={30} width={1080} height={1920} />
    <Composition id="HappyFitnessSystem" component={HappyFitnessSystem} durationInFrames={Math.round(R2.total * 30)} fps={30} width={1080} height={1920} />
    <Composition id="ShootDay" component={ShootDay} durationInFrames={Math.round(R3.total * 30)} fps={30} width={1080} height={1920} />
    <Composition id="PovBchhal" component={PovBchhal} durationInFrames={Math.round(R4.total * 30)} fps={30} width={1080} height={1920} />
    <Composition id="FollowersMyth" component={FollowersMyth} durationInFrames={Math.round(R5.total * 30)} fps={30} width={1080} height={1920} />
    <Composition id="CaptionFormula" component={CaptionFormula} durationInFrames={CAPTION_SLIDES} fps={30} width={1080} height={1350} />
    <Composition id="PackQuiz" component={PackQuiz} durationInFrames={PACK_SLIDES} fps={30} width={1080} height={1350} />
  </>
);
