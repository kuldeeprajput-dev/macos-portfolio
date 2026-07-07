import React, { useState, useEffect } from "react";
import WindowControls from "@components/WindowControls";
import windowWrapper from "@hoc/windowWrapper";
import useWindowsStore from "@store/window";
import { Globe } from "lucide-react";
import { EMAIL, PHONE } from "@constants";
import ContactCard from "./ContactCard";
import ContactList from "./ContactList";
import ContactAboutModal from "./ContactAboutModal";

const Contact = () => {
  const { windows, setWindowData } = useWindowsStore();
  const [showAbout, setShowAbout] = useState(false);
  const [redirectSocial, setRedirectSocial] = useState(null);

  useEffect(() => {
    if (windows.contact?.data?.openAbout) {
      setShowAbout(true);
      setWindowData("contact", { ...windows.contact.data, openAbout: false });
    }
  }, [windows.contact?.data?.openAbout, windows.contact?.data, setWindowData]);

  const [copied, setCopied] = useState("");

  const handleCopy = (text, label) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(""), 2000);
  };

  return (
    <>
      <div className="flex flex-col h-full w-full @container bg-white rounded-xl overflow-hidden relative">
        <div id="window-header" className="shrink-0 !bg-gray-50 !border-b-[#d1d1d1] !px-4 !py-2">
          <WindowControls target={"contact"} />
          <h2 className="flex-1 text-center text-sm font-bold text-gray-500">Contact Me</h2>
        </div>
        <div className="p-5 space-y-5 flex-1 overflow-y-auto">
          <ContactCard email={EMAIL} phone={PHONE} copied={copied} onCopy={handleCopy} />
          <ContactList onSocialClick={setRedirectSocial} />
        </div>

        {redirectSocial && (
          <div className="absolute inset-0 bg-black/30 backdrop-blur-xs flex items-center justify-center z-[100] animate-in fade-in duration-150">
            <div className="bg-white border border-[#c8cbd0]/80 p-5 rounded-2xl shadow-2xl max-w-sm w-full mx-4 text-center space-y-4 transform animate-in zoom-in-95 duration-150">
              <div className="w-11 h-11 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <Globe className="w-5 h-5 animate-pulse" />
              </div>
              <div className="space-y-1 text-gray-800">
                <h3 className="text-sm font-bold text-gray-900">Open External Link</h3>
                <p className="text-[11.5px] text-gray-500 leading-relaxed font-medium">
                  Do you want to open the social link for{" "}
                  <span className="font-bold text-gray-700 text-gray-800">
                    {redirectSocial.text}
                  </span>
                  ?
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setRedirectSocial(null)}
                  className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-[#333] rounded-xl text-xs font-bold transition-all cursor-pointer border border-gray-200"
                >
                  Cancel
                </button>
                <a
                  href={redirectSocial.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setRedirectSocial(null)}
                  className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center cursor-pointer text-center"
                >
                  Open Link
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
      <ContactAboutModal show={showAbout} onClose={() => setShowAbout(false)} />
    </>
  );
};

const ContactWindow = windowWrapper(Contact, "contact");
export default ContactWindow;
