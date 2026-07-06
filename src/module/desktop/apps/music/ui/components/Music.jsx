import windowWrapper from "@hoc/windowWrapper";
import useMusic from "../../hooks/useMusic";
import MusicSection from "../section/MusicSection";

const Music = () => {
  const props = useMusic();
  return <MusicSection {...props} />;
};

const MusicWindow = windowWrapper(Music, "music");
export default MusicWindow;
