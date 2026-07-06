import useWindowsStore from "@store/window";
import { GithubIcon, BookMarkedIcon } from "../../data/settingsData";

const SettingsAppleIDSection = ({ githubData }) => {
  const { setGithubRedirect } = useWindowsStore();

  if (!githubData) return null;

  return (
    <div className="w-full max-w-2xl mx-auto p-4 @sm:p-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex flex-col items-center mb-6 @sm:mb-8 text-center px-2 overflow-hidden w-full">
        <img
          src={githubData.profile.avatar_url}
          className="w-20 h-20 @sm:w-24 @sm:h-24 rounded-full mb-3 @sm:mb-4 shadow-lg border-2 border-white shrink-0 cursor-pointer"
          alt="Avatar"
          onClick={() =>
            setGithubRedirect({
              href: githubData.profile.html_url,
              name: githubData.profile.name || githubData.profile.login,
              source: "settings",
            })
          }
        />
        <h2 className="text-[20px] @sm:text-[24px] font-semibold text-gray-900 tracking-tight break-words max-w-full">
          {githubData.profile.name || githubData.profile.login}
        </h2>
        <p className="text-[12px] @sm:text-[13px] text-gray-500 mt-1 break-all @sm:break-words max-w-full px-2">
          {githubData.profile.email || `${githubData.profile.login}@users.noreply.github.com`}
        </p>
      </div>
      <div className="space-y-6 w-full">
        <div className="w-full bg-gray-50 rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="p-4 border-b border-gray-200">
            <p className="text-[13px] text-gray-600 leading-relaxed whitespace-pre-wrap break-words">
              {githubData.profile.bio || "No bio available."}
            </p>
          </div>
          <div
            className="flex items-center justify-between p-3 px-4 hover:bg-black/5 cursor-pointer transition-colors"
            onClick={() =>
              setGithubRedirect({
                href: githubData.profile.html_url,
                name: "GitHub Profile",
                source: "settings",
              })
            }
          >
            <div className="flex items-center gap-3">
              <GithubIcon size={16} className="text-gray-700" />
              <span className="text-[13px] font-medium text-gray-900">GitHub Profile</span>
            </div>
            <svg
              width={14}
              height={14}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-gray-400"
            >
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </div>
        </div>
        <div className="w-full bg-gray-50 rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="flex items-center justify-between p-3 px-4 border-b border-gray-200 gap-4">
            <span className="text-[13px] text-gray-700 shrink-0">Location</span>
            <span className="text-[13px] font-medium text-gray-900 text-right break-words flex-1 min-w-0">
              {githubData.profile.location || "Earth"}
            </span>
          </div>
          <div className="flex items-center justify-between p-3 px-4 border-b border-gray-200 gap-4">
            <span className="text-[13px] text-gray-700 shrink-0">Public Repositories</span>
            <span className="text-[13px] font-medium text-gray-900 text-right flex-1 min-w-0">
              {githubData.profile.public_repos}
            </span>
          </div>
          <div className="flex items-center justify-between p-3 px-4 gap-4">
            <span className="text-[13px] text-gray-700 shrink-0">Followers</span>
            <span className="text-[13px] font-medium text-gray-900 text-right flex-1 min-w-0">
              {githubData.profile.followers}
            </span>
          </div>
        </div>
        <h3 className="text-[12px] font-semibold text-gray-500 uppercase tracking-wider ml-1 mt-8 mb-2">
          Recent Repositories
        </h3>
        <div className="w-full bg-gray-50 rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          {githubData.repos.length > 0 ? (
            githubData.repos.map((repo, i) => (
              <div
                key={repo.id}
                className={`flex items-center justify-between p-3 px-4 cursor-pointer hover:bg-black/5 transition-colors min-w-0 ${i < githubData.repos.length - 1 ? "border-b border-gray-200" : ""}`}
                onClick={() =>
                  setGithubRedirect({
                    href: repo.html_url,
                    name: repo.name,
                    source: "settings",
                  })
                }
              >
                <div className="flex items-center gap-3 overflow-hidden min-w-0 flex-1">
                  <BookMarkedIcon size={16} className="text-blue-500 shrink-0" />
                  <div className="truncate flex-1 min-w-0">
                    <h4 className="text-[13px] font-medium text-gray-900 truncate">{repo.name}</h4>
                    <p className="text-[11px] text-gray-500 truncate">
                      {repo.description || "No description"}
                    </p>
                  </div>
                </div>
                <svg
                  width={16}
                  height={16}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-gray-400 shrink-0 ml-2"
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-[13px] text-gray-500">No recent repositories.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsAppleIDSection;
