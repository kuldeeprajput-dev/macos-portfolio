import { projects } from "@constants";
import { SafariMobileHeader } from "../components/SafariToolbar";

const SafariSection = () => {
  return <SafariMobileHeader projects={projects} />;
};

export default SafariSection;
