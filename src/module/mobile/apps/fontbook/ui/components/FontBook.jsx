import windowWrapper from "@hoc/windowWrapper";
import useFontBook from "../../hooks/useFontBook";
import FontBookSection from "../section/FontBookSection";

const FontBook = () => {
  const allProps = useFontBook();
  return <FontBookSection {...allProps} />;
};

const FontBookWindow = windowWrapper(FontBook, "font");
export default FontBookWindow;
