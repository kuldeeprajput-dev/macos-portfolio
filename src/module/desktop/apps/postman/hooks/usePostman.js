import { useState, useEffect } from "react";
import MOCK_COLLECTIONS from "../data/postmanData";
import { projects, GITHUB_PROFILE, PORTFOLIO_URL } from "@constants";

const getApiHost = () => {
  try {
    const cleanUrl = PORTFOLIO_URL.includes("://") ? PORTFOLIO_URL : `https://${PORTFOLIO_URL}`;
    const parsed = new URL(cleanUrl);
    return `${parsed.protocol}//api.${parsed.hostname}`;
  } catch {
    return "https://api.dev";
  }
};

const usePostman = () => {
  const [activeTab, setActiveTab] = useState("params"); // "params" | "headers" | "body"
  const [activeResponseTab, setActiveResponseTab] = useState("pretty"); // "pretty" | "raw" | "headers"
  const [method, setMethod] = useState("GET");
  const [url, setUrl] = useState("https://api.dev/v1/profile");
  const [reqBody, setReqBody] = useState("");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [environment, setEnvironment] = useState("dev"); // "dev" | "prod" | "none"
  const [history, setHistory] = useState([
    { method: "GET", url: "https://api.dev/v1/profile", timestamp: "Just now" },
  ]);
  const [sidebarTab, setSidebarTab] = useState("collections"); // "collections" | "history"

  const [expandedFolders, setExpandedFolders] = useState({
    "User API": true,
    "Portfolio API": true,
  });

  // Query Params State
  const [queryParams, setQueryParams] = useState([{ key: "", value: "", enabled: true }]);

  // Headers State
  const [headers, setHeaders] = useState([
    { key: "Content-Type", value: "application/json", enabled: true },
    { key: "Authorization", value: "Bearer eyJhbGciOiJIUzI1NiJ9...", enabled: false },
    { key: "", value: "", enabled: true },
  ]);

  // Sync environment dropdown with URL host
  const handleEnvironmentChange = (env) => {
    setEnvironment(env);
    let host = "https://api.dev";
    if (env === "prod") host = getApiHost();
    else if (env === "none") host = "https://localhost:8080";

    const path = url.replace(/^https?:\/\/[^/]+/, "");
    setUrl(host + path);
  };

  // Sync Query Params with URL string
  useEffect(() => {
    const activeParams = queryParams.filter((p) => p.key && p.enabled);
    const baseUrl = url.split("?")[0];
    if (activeParams.length > 0) {
      const queryString = activeParams
        .map((p) => `${encodeURIComponent(p.key)}=${encodeURIComponent(p.value)}`)
        .join("&");
      setUrl(`${baseUrl}?${queryString}`);
    } else {
      setUrl(baseUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryParams]);

  const loadRequest = (req) => {
    setMethod(req.method);
    let targetUrl = req.url;
    if (environment === "prod") {
      targetUrl = req.url.replace("https://api.dev", getApiHost());
    } else if (environment === "none") {
      targetUrl = req.url.replace("https://api.dev", "https://localhost:8080");
    }
    setUrl(targetUrl);
    setReqBody(req.body || "");
    setResponse(null);
  };

  const handleSend = () => {
    setLoading(true);
    setResponse(null);

    // Save to history
    setHistory((prev) => [
      {
        method,
        url,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      },
      ...prev.filter((h) => h.url !== url || h.method !== method).slice(0, 19),
    ]);

    setTimeout(() => {
      let status = 200;
      let statusText = "OK";
      let data;
      let respHeaders = {
        "content-type": "application/json; charset=utf-8",
        "cache-control": "no-cache, no-store, must-revalidate",
        date: new Date().toUTCString(),
        server: "Bun/1.1.17 (macOS arm64)",
        "x-powered-by": "Next.js/Turbopack",
      };

      const cleanUrl = url.trim().split("?")[0].replace(/\/$/, "");

      try {
        if (cleanUrl.endsWith("/v1/profile")) {
          if (method === "GET") {
            data = {
              id: "usr_001",
              name: "Kuldeep Rajput",
              role: "Full Stack Developer",
              location: "Mumbai, India",
              github: GITHUB_PROFILE,
              skills: ["React", "Node.js", "Bun", "Tailwind CSS", "GSAP"],
              status: "active",
            };
          } else if (method === "PUT") {
            let parsed = {};
            if (reqBody.trim()) {
              parsed = JSON.parse(reqBody);
            }
            status = 200;
            data = {
              message: "Profile updated successfully",
              updated_fields: parsed,
              profile: {
                id: "usr_001",
                name: parsed.name || "Kuldeep Rajput",
                role: parsed.role || "Full Stack Developer",
                location: parsed.location || "Mumbai, India",
                github: GITHUB_PROFILE,
                skills: ["React", "Node.js", "Bun", "Tailwind CSS", "GSAP"],
                status: "active",
              },
            };
          } else {
            status = 405;
            statusText = "Method Not Allowed";
            data = { error: "Method Not Allowed", message: `Cannot ${method} /v1/profile` };
          }
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
              user: { username: "guest", role: "collaborator" },
            };
          } else {
            status = 401;
            statusText = "Unauthorized";
            data = {
              error: "Invalid credentials",
              message: "Please double check your request payload username and password values.",
              tip: "Use username 'guest' and password 'password123'",
            };
          }
        } else if (cleanUrl.endsWith("/v1/logout") && method === "DELETE") {
          status = 200;
          data = {
            status: "success",
            message: "User session terminated, credentials cleared.",
          };
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
        } else if (cleanUrl.endsWith("/v1/stats") && method === "GET") {
          data = {
            website: PORTFOLIO_URL,
            analytics: {
              page_views: 1420,
              unique_visitors: 485,
              github_stars: 42,
              coffee_cups_consumed: 184,
              system_uptime: "99.99%",
            },
            status: "all_systems_operational",
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
        time: Math.floor(Math.random() * 50) + 15 + " ms",
        size: (JSON.stringify(data).length / 1000).toFixed(2) + " KB",
        body: JSON.stringify(data, null, 2),
        headers: respHeaders,
      });
      setLoading(false);
    }, 450);
  };

  return {
    activeTab,
    setActiveTab,
    activeResponseTab,
    setActiveResponseTab,
    method,
    setMethod,
    url,
    setUrl,
    reqBody,
    setReqBody,
    response,
    setResponse,
    loading,
    setLoading,
    environment,
    setEnvironment,
    history,
    setHistory,
    sidebarTab,
    setSidebarTab,
    expandedFolders,
    setExpandedFolders,
    queryParams,
    setQueryParams,
    headers,
    setHeaders,
    handleEnvironmentChange,
    loadRequest,
    handleSend,
  };
};

export default usePostman;
