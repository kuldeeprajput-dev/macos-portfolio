import clsx from "clsx";
import OptimizedImage from "@module/shared/ui/components/OptimizedImage";

const HomeFolder = ({ project, onClick }) => {
  const displayName = project.name === "Resume Ats Scanner" ? "Resume ATS" : project.name;
  return (
    <li className={clsx("folder cursor-pointer", project.windowPosition)} onClick={onClick}>
      <div className="w-[62px] h-[52px] flex items-center justify-center pointer-events-none">
        <OptimizedImage
          src="/apps/folder.webp"
          alt={displayName}
          width={62}
          height={52}
          className="w-full h-full object-contain pointer-events-none"
        />
      </div>
      <p>{displayName}</p>
    </li>
  );
};

export default HomeFolder;
