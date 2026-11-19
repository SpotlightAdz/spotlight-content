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
import { FxTest } from "./lab/FxTest";
import { Look3D } from "./three/Look3D";
import { BchhalMontage } from "./reels/BchhalMontage";
import R4m from "./reels/R4m.json";
import { AdsMistakes } from "./reels/AdsMistakes";
import S1 from "./reels/S1.json";
import { FourResults } from "./reels/FourResults";
import S2 from "./reels/S2.json";
import { BlackFriday } from "./reels/BlackFriday";
import S3 from "./reels/S3.json";
import { PovWebsite } from "./reels/PovWebsite";
import S4 from "./reels/S4.json";
import { PhoneShots } from "./reels/PhoneShots";
import S5 from "./reels/S5.json";
import { MapsChecklist, MAPS_SLIDES, AgencyQuestions, AGENCY_SLIDES } from "./carousels/W4Carousels";
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
    <Composition id="FxTest" component={FxTest} durationInFrames={31} fps={30} width={1080} height={1920} />
    <Composition id="Look3D" component={Look3D} durationInFrames={90} fps={30} width={1080} height={1920} defaultProps={{ theme: "sunlit" }} />
    <Composition id="BchhalMontage" component={BchhalMontage} durationInFrames={Math.round(R4m.total * 30)} fps={30} width={1080} height={1920} />
    <Composition id="AdsMistakes" component={AdsMistakes} durationInFrames={Math.round(S1.total * 30)} fps={30} width={1080} height={1920} />
    <Composition id="FourResults" component={FourResults} durationInFrames={Math.round(S2.total * 30)} fps={30} width={1080} height={1920} />
    <Composition id="BlackFriday" component={BlackFriday} durationInFrames={Math.round(S3.total * 30)} fps={30} width={1080} height={1920} />
    <Composition id="PovWebsite" component={PovWebsite} durationInFrames={Math.round(S4.total * 30)} fps={30} width={1080} height={1920} />
    <Composition id="PhoneShots" component={PhoneShots} durationInFrames={Math.round(S5.total * 30)} fps={30} width={1080} height={1920} />
    <Composition id="MapsChecklist" component={MapsChecklist} durationInFrames={MAPS_SLIDES} fps={30} width={1080} height={1350} />
    <Composition id="AgencyQuestions" component={AgencyQuestions} durationInFrames={AGENCY_SLIDES} fps={30} width={1080} height={1350} />
  </>
);
