import React from "react";
import { Composition } from "remotion";
import { RestaurantMistakes } from "./reels/RestaurantMistakes";
import R from "./reels/R.json";
import { ReelIdeas, REEL_IDEAS_SLIDES } from "./carousels/ReelIdeas";

export const Root: React.FC = () => (
  <>
    <Composition id="RestaurantMistakes" component={RestaurantMistakes} durationInFrames={Math.round(R.total * 30)} fps={30} width={1080} height={1920} />
    <Composition id="ReelIdeas" component={ReelIdeas} durationInFrames={REEL_IDEAS_SLIDES} fps={30} width={1080} height={1350} />
  </>
);
