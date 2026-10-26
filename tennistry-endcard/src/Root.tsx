import { Composition } from "remotion";
import { EndCard } from "./EndCard";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="EndCard"
        component={EndCard}
        durationInFrames={180}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ creatorHandle: "" }}
      />
    </>
  );
};
