import { useEffect } from "react";
import { Terminal as XTerm } from "xterm";
import "xterm/css/xterm.css";
import { FitAddon } from "@xterm/addon-fit";
import { techStack, projects, GITHUB_PROFILE, PORTFOLIO_URL, EMAIL } from "@constants";
import useWindowsStore from "@store/window";

const TerminalInput = ({ terminalRef, xtermRef, fitAddonRef, commandRef }) => {
  const isOpen = useWindowsStore((state) => state.windows.terminal?.isOpen);

  useEffect(() => {
    if (!isOpen || !terminalRef.current) return;

    let term = null;
    let fitAddon = null;
    let isOpened = false;
    let bannerShown = false;
    let printBanner = null;

    const setupHandlers = (t) => {
      const prompt = () => {
        t.write("\r\n\x1b[1;32mkuldeep@macbook ~ %\x1b[0m ");
      };

      const println = (msg) => {
        t.write("\r\n" + msg + "\x1b[0m");
      };

      const gradientChar = (char, tVal) => {
        const colors = [
          [239, 68, 68],
          [249, 115, 22],
          [234, 179, 8],
        ];
        let r, g, b;
        if (tVal <= 0.5) {
          const f = tVal / 0.5;
          r = Math.round(colors[0][0] + (colors[1][0] - colors[0][0]) * f);
          g = Math.round(colors[0][1] + (colors[1][1] - colors[0][1]) * f);
          b = Math.round(colors[0][2] + (colors[1][2] - colors[0][2]) * f);
        } else {
          const f = (tVal - 0.5) / 0.5;
          r = Math.round(colors[1][0] + (colors[2][0] - colors[1][0]) * f);
          g = Math.round(colors[1][1] + (colors[2][1] - colors[1][1]) * f);
          b = Math.round(colors[1][2] + (colors[2][2] - colors[1][2]) * f);
        }
        return `\x1b[38;2;${r};${g};${b}m${char}`;
      };
      const gradientLine = (str) =>
        [...str].map((c, i, a) => gradientChar(c, a.length > 1 ? i / (a.length - 1) : 0)).join("") +
        "\x1b[0m";

      const hulkLines = [
        "██╗  ██╗██╗   ██╗██╗     ██████╗ ███████╗███████╗██████╗ ",
        "██║ ██╔╝██║   ██║██║     ██╔══██╗██╔════╝██╔════╝██╔══██╗",
        "█████╔╝ ██║   ██║██║     ██║  ██║█████╗  █████╗  ██████╔╝",
        "██╔═██╗ ██║   ██║██║     ██║  ██║██╔══╝  ██╔══╝  ██╔═══╝ ",
        "██║  ██╗╚██████╔╝███████╗██████╔╝███████╗███████╗██║     ",
        "╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚═════╝ ╚══════╝╚══════╝╚═╝     ",
      ];
      printBanner = (terminal) => {
        if (terminal.cols >= 62) {
          hulkLines.forEach((line) => terminal.writeln(gradientLine(line)));
          bannerShown = true;
        } else {
          bannerShown = false;
        }
        terminal.write("Last login: " + new Date().toLocaleString() + " / help?");
        prompt();
      };

      printBanner(t);

      t.onData((data) => {
        const code = data.charCodeAt(0);

        if (code === 13) {
          const cmd = commandRef.current.trim();
          if (cmd === "") {
            prompt();
            return;
          }

          const args = cmd.split(" ");
          const baseCmd = args[0].toLowerCase();

          switch (baseCmd) {
            case "help":
              println("\x1b[1;38;2;219;39;119m=== Available Commands ===\x1b[0m");
              println(
                "\x1b[1;38;2;16;185;129mhelp\x1b[0m      \x1b[38;2;75;85;99m- Show help message\x1b[0m",
              );
              println(
                "\x1b[1;38;2;16;185;129mclear\x1b[0m     \x1b[38;2;75;85;99m- Clear screen\x1b[0m",
              );
              println(
                "\x1b[1;38;2;16;185;129mecho\x1b[0m      \x1b[38;2;75;85;99m- Print text\x1b[0m",
              );
              println(
                "\x1b[1;38;2;16;185;129mdate\x1b[0m      \x1b[38;2;75;85;99m- Print date/time\x1b[0m",
              );
              println(
                "\x1b[1;38;2;16;185;129mwhoami\x1b[0m    \x1b[38;2;75;85;99m- Print current user\x1b[0m",
              );
              println(
                "\x1b[1;38;2;16;185;129mabout\x1b[0m     \x1b[38;2;75;85;99m- About Kuldeep Rajput\x1b[0m",
              );
              println(
                "\x1b[1;38;2;16;185;129mtechstack\x1b[0m \x1b[38;2;75;85;99m- Display tech stack\x1b[0m",
              );
              println(
                "\x1b[1;38;2;16;185;129mprojects\x1b[0m  \x1b[38;2;75;85;99m- Display portfolio projects\x1b[0m",
              );
              println(
                "\x1b[1;38;2;16;185;129msudo\x1b[0m      \x1b[38;2;75;85;99m- Run superuser command\x1b[0m",
              );
              break;
            case "clear":
              t.clear();
              break;
            case "echo":
              println(args.slice(1).join(" "));
              break;
            case "date":
              println(new Date().toString());
              break;
            case "whoami":
              println("\x1b[38;2;75;85;99mkuldeep\x1b[0m");
              break;
            case "about":
              println("\x1b[1;38;2;219;39;119m=== About Kuldeep Rajput ===\x1b[0m");
              println("\x1b[1;38;2;16;185;129mName:      \x1b[38;2;75;85;99mKuldeep Rajput\x1b[0m");
              println(
                "\x1b[1;38;2;16;185;129mRole:      \x1b[38;2;75;85;99mFull-Stack Developer & Designer\x1b[0m",
              );
              println("\x1b[1;38;2;16;185;129mLocation:  \x1b[38;2;75;85;99mIndia 🇮🇳\x1b[0m");
              println(`\x1b[1;38;2;16;185;129mEmail:     \x1b[4;38;2;37;99;235m${EMAIL}\x1b[0m`);
              println(
                `\x1b[1;38;2;16;185;129mGitHub:    \x1b[4;38;2;37;99;235m${GITHUB_PROFILE}\x1b[0m`,
              );
              println(
                `\x1b[1;38;2;16;185;129mPortfolio: \x1b[4;38;2;37;99;235m${PORTFOLIO_URL}\x1b[0m`,
              );
              println("\x1b[1;38;2;6;182;212m\r\nBio:\x1b[0m");
              println(
                "\x1b[38;2;75;85;99mPassionate developer crafting premium macOS-inspired\x1b[0m",
              );
              println("\x1b[38;2;75;85;99mweb experiences with React, Next.js & Node.js.\x1b[0m");
              println(
                "\x1b[38;2;75;85;99mType \x1b[1;38;2;16;185;129mtechstack\x1b[0m\x1b[38;2;75;85;99m for skills or \x1b[1;38;2;16;185;129mprojects\x1b[0m\x1b[38;2;75;85;99m for work.\x1b[0m",
              );
              break;
            case "sudo":
              println(
                "\x1b[31mkuldeep is not in the sudoers file. This incident will be reported.\x1b[0m",
              );
              break;
            case "techstack":
              println("\x1b[1;38;2;219;39;119m=== Tech Stack ===\x1b[0m");
              techStack.forEach(({ category, items }) => {
                println(`\x1b[1;38;2;6;182;212m${category}:\x1b[0m`);
                println(`\x1b[38;2;75;85;99m${items.join(", ")}\x1b[0m`);
              });
              break;
            case "projects":
              println("\x1b[1;38;2;219;39;119m=== Portfolio Projects ===\x1b[0m");
              projects.forEach((proj) => {
                println(`\x1b[1;38;2;16;185;129m• ${proj.title}\x1b[0m`);
                println("\x1b[1;38;2;245;158;11mDescription:\x1b[0m");
                println(`\x1b[38;2;75;85;99m${proj.description}\x1b[0m`);
                if (proj.link) {
                  println("\x1b[1;38;2;6;182;212mLive Demo:\x1b[0m");
                  println(`\x1b[4;38;2;37;99;235m${proj.link}\x1b[0m`);
                }
                if (proj.github) {
                  println("\x1b[1;38;2;6;182;212mGitHub:\x1b[0m");
                  println(`\x1b[4;38;2;37;99;235m${proj.github}\x1b[0m`);
                }
                println("");
              });
              break;
            default:
              println(`\x1b[31mzsh: command not found: ${baseCmd}\x1b[0m`);
          }

          commandRef.current = "";
          prompt();
        } else if (code === 127 || code === 8) {
          if (commandRef.current.length > 0) {
            commandRef.current = commandRef.current.slice(0, -1);
            t.write("\b \b");
          }
        } else if (code >= 32 && code <= 126) {
          commandRef.current += data;
          t.write(data);
        }
      });
    };

    const tryInit = () => {
      if (isOpened || !terminalRef.current) return;
      const { width, height } = terminalRef.current.getBoundingClientRect();
      if (width > 0 && height > 0) {
        term = new XTerm({
          cursorBlink: true,
          fontFamily: "Menlo, Monaco, 'Courier New', monospace",
          fontSize: 14,
          lineHeight: 1.4,
          theme: {
            background: "#ffffff",
            foreground: "#333333",
            cursor: "#333333",
            selectionBackground: "#b5d5ff",
          },
        });

        fitAddon = new FitAddon();
        term.loadAddon(fitAddon);

        term.open(terminalRef.current);
        isOpened = true;

        xtermRef.current = term;
        fitAddonRef.current = fitAddon;

        try {
          fitAddon.fit();
        } catch (e) {
          console.warn("Could not fit terminal on lazy open:", e);
        }

        setupHandlers(term);
      }
    };

    tryInit();

    let resizeTimer = null;
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        if (width <= 0 || height <= 0) return;
      }
      if (!isOpened) {
        tryInit();
      } else if (fitAddonRef.current) {
        try {
          fitAddonRef.current.fit();
        } catch {
          /* empty */
        }

        // Debounced banner toggle on resize
        if (resizeTimer) clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
          if (!term || !printBanner) return;
          const shouldShow = term.cols >= 62;
          if (shouldShow !== bannerShown) {
            term.reset();
            commandRef.current = "";
            printBanner(term);
          }
        }, 200);
      }
    });

    resizeObserver.observe(terminalRef.current);

    const timer = setTimeout(() => {
      if (!isOpened) {
        tryInit();
      } else if (fitAddonRef.current && terminalRef.current) {
        const { width, height } = terminalRef.current.getBoundingClientRect();
        if (width > 0 && height > 0) {
          try {
            fitAddonRef.current.fit();
          } catch {
            /* empty */
          }
        }
      }
    }, 150);

    return () => {
      clearTimeout(timer);
      resizeObserver.disconnect();
      if (term) {
        term.dispose();
      }
      xtermRef.current = null;
      fitAddonRef.current = null;
    };
  }, [isOpen, commandRef, fitAddonRef, terminalRef, xtermRef]);

  return (
    <div
      ref={terminalRef}
      className="flex-1 w-full bg-white pt-4 px-4 pb-12 outline-none xterm-wrapper"
      style={{ overflow: "hidden" }}
    />
  );
};

export default TerminalInput;
