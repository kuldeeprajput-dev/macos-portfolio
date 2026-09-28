import clsx from "clsx";
import OptimizedImage from "@module/shared/ui/components/OptimizedImage";
import FolderRenameInput from "./FolderRenameInput";

const HomeFolder = ({ project, displayName, isEditing, onRename, onClick, onContextMenu }) => {
  const currentName =
    displayName || (project.name === "Resume Ats Scanner" ? "Resume ATS" : project.name);

  return (
    <li
      className={clsx("folder cursor-default", project.windowPosition)}
      onClick={isEditing ? undefined : onClick}
      onContextMenu={(e) => {
        if (onContextMenu) {
          e.preventDefault();
          e.stopPropagation();
          onContextMenu(e, project);
        }
      }}
      data-id={project.id}
    >
      <div className="w-[62px] h-[52px] flex items-center justify-center pointer-events-none">
        <OptimizedImage
          src="/system/icons/files/folder.webp"
          alt={currentName}
          width={62}
          height={52}
          className="w-full h-full object-contain pointer-events-none"
        />
      </div>
      {isEditing ? (
        <FolderRenameInput
          initialValue={currentName}
          onSave={onRename}
          onCancel={() => onRename(currentName)}
        />
      ) : (
        <p>{currentName}</p>
      )}
    </li>
  );
};

export default HomeFolder;
