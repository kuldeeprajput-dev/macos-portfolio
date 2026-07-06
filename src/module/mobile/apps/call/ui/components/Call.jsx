import windowWrapper from "@hoc/windowWrapper";
import useCall from "../../hooks/useCall";
import CallSection from "../section/CallSection";

const Call = () => {
  const props = useCall();
  return <CallSection {...props} />;
};

const CallWindow = windowWrapper(Call, "call");
export default CallWindow;
