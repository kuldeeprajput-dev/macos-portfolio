import clsx from "clsx";
import OptimizedImage from "@module/shared/ui/components/OptimizedImage";

const HomeFolder = ({ project, onClick }) => {
  const displayName = project.name === "Resume Ats Scanner" ? "Resume ATS" : project.name;
  return (
    <li className={clsx("group folder", project.windowPosition)} onClick={onClick}>
      <OptimizedImage
        src="/images/folder.webp"
        alt={displayName}
        width={64}
        height={64}
        className="w-16 h-16 object-contain p-1 rounded-md transition-all duration-200 group-hover:scale-105 pointer-events-none"
      />
      <p>{displayName}</p>
    </li>
  );
};

export default HomeFolder;
