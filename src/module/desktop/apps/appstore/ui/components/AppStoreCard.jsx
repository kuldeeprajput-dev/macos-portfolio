import { useState } from "react";
import { Star, Play, Check, RefreshCw } from "lucide-react";
import OptimizedImage from "@module/shared/ui/components/OptimizedImage";

const AppStoreIcon = ({ icon, name, fallbackBg = "bg-blue-500" }) => {
  const [hasError, setHasError] = useState(false);
  return (
    <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden border border-gray-200/50 shadow-sm shrink-0">
      {!hasError ? (
        <OptimizedImage
          src={`/images/${icon}`}
          alt={name}
          width={48}
          height={48}
          onError={() => setHasError(true)}
          className="w-full h-full object-cover"
        />
      ) : (
        <div
          className={`w-full h-full ${fallbackBg} text-white flex items-center justify-center font-bold text-xs uppercase`}
        >
          {name[0]}
        </div>
      )}
    </div>
  );
};

const ActionButton = ({ app, installState, onStartDownload, onOpenApp }) => {
  if (installState === "get") {
    return (
      <button
        onClick={() => onStartDownload(app.id)}
        className="px-5 py-1 bg-gray-100 hover:bg-blue-600 hover:text-white rounded-full text-xs font-bold text-blue-600 transition-colors shadow-sm cursor-pointer"
      >
        GET
      </button>
    );
  }

  if (installState?.status === "downloading") {
    const radius = 10;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (installState.progress / 100) * circumference;

    return (
      <div className="relative w-8 h-8 flex items-center justify-center">
        <svg className="w-8 h-8 -rotate-90">
          <circle
            cx="16"
            cy="16"
            r={radius}
            className="stroke-gray-200 fill-none"
            strokeWidth="2.5"
          />
          <circle
            cx="16"
            cy="16"
            r={radius}
            className="stroke-blue-500 fill-none transition-all duration-200"
            strokeWidth="2.5"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
          />
        </svg>
        <span className="absolute text-[8px] font-bold text-blue-500 tabular-nums">
          {installState.progress}%
        </span>
      </div>
    );
  }

  return (
    <button
      onClick={() => onOpenApp(app)}
      className="px-5 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-xs font-bold text-gray-800 transition-colors shadow-sm cursor-pointer"
    >
      OPEN
    </button>
  );
};

const AppStoreCard = ({ app, installState, onStartDownload, onOpenApp, variant = "default" }) => {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-all">
      <div className="flex items-center gap-3 min-w-0">
        {variant === "game" && !app.icon ? (
          <div className="w-12 h-12 bg-gradient-to-tr from-amber-500 to-orange-600 rounded-xl flex items-center justify-center font-bold text-white shadow-sm shrink-0 uppercase">
            {app.name.slice(0, 2)}
          </div>
        ) : (
          <AppStoreIcon
            icon={app.icon}
            name={app.name}
            fallbackBg={
              variant === "develop"
                ? "bg-indigo-500"
                : variant === "game"
                  ? "bg-amber-500"
                  : "bg-blue-500"
            }
          />
        )}
        <div className="min-w-0">
          <h4 className="text-xs font-bold text-gray-800 truncate">{app.name}</h4>
          <p className="text-[10px] text-gray-400 truncate">{app.desc}</p>
          <div className="flex items-center gap-0.5 mt-0.5 text-amber-500">
            <Star className="w-2.5 h-2.5 fill-current" />
            <span className="text-[9px] font-bold text-gray-500">{app.rating}</span>
          </div>
        </div>
      </div>
      <div className="shrink-0 pl-2">
        <ActionButton
          app={app}
          installState={installState}
          onStartDownload={onStartDownload}
          onOpenApp={onOpenApp}
        />
      </div>
    </div>
  );
};

const UpdateItem = ({ update, appIcon, progressVal, onUpdate, _updatingAll }) => {
  const isUpdating = progressVal !== undefined && progressVal < 100;
  const isUpdated = progressVal === 100;

  return (
    <div className="p-4 bg-gray-50/50 hover:bg-gray-50 rounded-xl border border-gray-150 transition-all flex items-start gap-4">
      {/* App Icon */}
      {appIcon ? (
        <AppStoreIcon icon={appIcon} name={update.name} fallbackBg="bg-blue-500" />
      ) : (
        <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center font-bold text-white shadow-sm shrink-0">
          {update.name[0]}
        </div>
      )}

      {/* Content */}
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex flex-wrap items-baseline gap-x-2">
          <h4 className="text-xs font-bold text-gray-800">{update.name}</h4>
          <span className="text-[10px] text-gray-400 font-medium font-mono">{update.ver}</span>
        </div>
        <p className="text-[11px] text-gray-500 leading-relaxed font-medium">{update.details}</p>

        {isUpdating && (
          <div className="flex items-center gap-3 pt-1">
            <div className="w-full max-w-[150px] h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all duration-200"
                style={{ width: `${progressVal}%` }}
              />
            </div>
            <span className="text-[9px] font-bold text-blue-600 tabular-nums">{progressVal}%</span>
          </div>
        )}
      </div>

      {/* Action Button */}
      <div className="shrink-0 pl-2 self-center">
        {isUpdated ? (
          <span className="flex items-center gap-1 px-4 py-1 text-xs text-green-600 font-bold bg-green-50 rounded-full">
            <Check className="w-3.5 h-3.5" />
            Updated
          </span>
        ) : (
          <button
            onClick={() => onUpdate(update.id)}
            disabled={isUpdating}
            className="px-4 py-1 bg-white hover:bg-gray-100 disabled:opacity-40 border border-gray-200 rounded-full text-xs font-bold text-blue-600 hover:text-blue-700 transition-all shadow-sm cursor-pointer disabled:cursor-not-allowed"
          >
            {isUpdating ? "UPDATING..." : "UPDATE"}
          </button>
        )}
      </div>
    </div>
  );
};

export { AppStoreIcon, ActionButton, AppStoreCard, UpdateItem };
