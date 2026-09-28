import { useState } from "react";
import CallInProgress from "../../../call/ui/components/CallInProgress";

const CallOverlay = ({
  callState,
  callDuration,
  activeChat,
  onMicToggle,
  onCameraToggle,
  onEndCall,
  formatCallTime,
}) => {
  const [speakerMuted, setSpeakerMuted] = useState(false);

  return (
    <CallInProgress
      activeCall={{
        name: activeChat.name,
        avatar: activeChat.avatar,
        type: callState.type,
        status: callState.status,
      }}
      callTimer={callDuration}
      micMuted={callState.micMuted}
      cameraMuted={callState.cameraOff}
      speakerMuted={speakerMuted}
      onMicToggle={onMicToggle}
      onCameraToggle={onCameraToggle}
      onSpeakerToggle={() => setSpeakerMuted((muted) => !muted)}
      onEndCall={onEndCall}
      formatTimer={formatCallTime}
    />
  );
};

export default CallOverlay;
