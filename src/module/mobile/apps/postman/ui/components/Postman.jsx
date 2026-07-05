import { useState } from "react";
import WindowControls from "@components/WindowControls";
import windowWrapper from "@hoc/windowWrapper";
import { projects, GITHUB_PROFILE } from "@constants";
import PostmanSection from "../section/PostmanSection";

const Postman = () => {
  const [activeTab, setActiveTab] = useState("params");
  const [method, setMethod] = useState("GET");
  const [url, setUrl] = useState("https://api.dev/v1/profile");
  const [reqBody, setReqBody] = useState("");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [expandedFolders, setExpandedFolders] = useState({
    "User API": true,
    "Portfolio API": true,
  });

  const loadRequest = (req) => {
    setMethod(req.method);
    setUrl(req.url);
    setReqBody(req.body);
    setResponse(null);
  };

  const handleSend = () => {
    setLoading(true);
    setResponse(null);

    setTimeout(() => {
      let status = 200;
      let statusText = "OK";
      let data;

      const cleanUrl = url.trim().replace(/\/$/, "");

      try {
        if (cleanUrl.endsWith("/v1/profile") && method === "GET") {
          data = {
            name: "Kuldeep Rajput",
            role: "Full Stack Developer",
            location: "Mumbai, India",
            github: GITHUB_PROFILE,
            skills: ["React", "Node.js", "Bun", "Tailwind CSS", "GSAP"],
          };
        } else if (cleanUrl.endsWith("/v1/login") && method === "POST") {
          let parsed = {};
          if (reqBody.trim()) {
            parsed = JSON.parse(reqBody);
          }
          if (parsed.username === "guest" && parsed.password === "password123") {
            status = 200;
            data = {
              message: "Login successful!",
              token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mockTokenForTesting",
              expiresIn: "24h",
            };
          } else {
            status = 401;
            statusText = "Unauthorized";
            data = {
              error: "Invalid credentials",
              message: "Please double check your request payload username and password values.",
            };
          }
        } else if (cleanUrl.endsWith("/v1/projects") && method === "GET") {
          data = {
            count: projects.length,
            results: projects.map((p) => ({
              id: p.id,
              title: p.title,
              description: p.description,
              demo_url: p.link,
              github_url: p.github,
            })),
          };
        } else if (cleanUrl.endsWith("/v1/contact") && method === "POST") {
          let parsed = {};
          if (reqBody.trim()) {
            parsed = JSON.parse(reqBody);
          }
          if (parsed.name && parsed.email && parsed.message) {
            status = 201;
            statusText = "Created";
            data = {
              status: "success",
              received: parsed,
              timestamp: new Date().toISOString(),
              notification: "Thank you for getting in touch! Your message was received.",
            };
          } else {
            status = 400;
            statusText = "Bad Request";
            data = {
              error: "Missing required fields",
              required: ["name", "email", "message"],
            };
          }
        } else {
          status = 404;
          statusText = "Not Found";
          data = {
            error: "Not Found",
            message: `Cannot ${method} ${url}`,
            hint: "Try loading one of the preconfigured requests in the sidebar collections!",
          };
        }
      } catch (err) {
        status = 400;
        statusText = "Bad Request";
        data = {
          error: "JSON Parsing Error",
          details: err.message,
          message: "Please ensure your Request Body is valid JSON format.",
        };
      }

      setResponse({
        status,
        statusText,
        time: Math.floor(Math.random() * 80) + 40 + " ms",
        size: (JSON.stringify(data).length / 1000).toFixed(2) + " KB",
        body: JSON.stringify(data, null, 2),
      });
      setLoading(false);
    }, 600);
  };

  return (
    <div className="flex flex-col h-full w-full bg-white text-gray-800 font-sans select-none rounded-xl overflow-hidden shadow-2xl border border-zinc-200/80">
      <div
        id="window-header"
        className="shrink-0 bg-[#f3f3f3] border-b border-zinc-200 px-4 py-2 flex items-center justify-between text-xs text-gray-600"
      >
        <div className="flex items-center gap-2">
          <WindowControls target="postman" />
          <span className="font-semibold pl-4 hidden md:inline">
            Postman Agent (Desktop client)
          </span>
        </div>
        <div className="flex-1 text-center font-medium text-[11px] truncate px-4">
          API Request Workspace
        </div>
        <div className="w-16 flex justify-end">
          <span className="text-[10px] bg-orange-500 text-white px-2 py-0.5 rounded font-bold">
            POSTMAN
          </span>
        </div>
      </div>

      <PostmanSection
        expandedFolders={expandedFolders}
        setExpandedFolders={setExpandedFolders}
        loadRequest={loadRequest}
        url={url}
        method={method}
        setMethod={setMethod}
        setUrl={setUrl}
        handleSend={handleSend}
        loading={loading}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        reqBody={reqBody}
        setReqBody={setReqBody}
        response={response}
      />
    </div>
  );
};

const PostmanWindow = windowWrapper(Postman, "postman");
export default PostmanWindow;
