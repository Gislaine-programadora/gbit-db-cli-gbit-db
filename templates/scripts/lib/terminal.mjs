import { spawn } from "node:child_process";
import os from "node:os";

/**
 * Abre um comando em um TERMINAL SEPARADO (janela nova).
 * Windows / macOS / Linux. Se não conseguir, roda no terminal atual.
 */
export function openTerminal({ title, command, cwd = process.cwd() }) {
  const platform = os.platform();

  try {
    if (platform === "win32") {
      spawn("cmd", ["/c", "start", `"${title}"`, "cmd", "/k", command], {
        cwd,
        detached: true,
        stdio: "ignore",
        windowsVerbatimArguments: true,
      }).unref();
      return true;
    }

    if (platform === "darwin") {
      const script = `tell application "Terminal" to do script "cd '${cwd}' && ${command.replace(/"/g, '\\"')}"`;
      spawn("osascript", ["-e", script], { detached: true, stdio: "ignore" }).unref();
      return true;
    }

    const emulators = [
      ["gnome-terminal", ["--title", title, "--", "bash", "-lc", `cd '${cwd}' && ${command}; exec bash`]],
      ["konsole", ["-e", "bash", "-lc", `cd '${cwd}' && ${command}; exec bash`]],
      ["xfce4-terminal", ["-T", title, "-e", `bash -lc "cd '${cwd}' && ${command}; exec bash"`]],
      ["x-terminal-emulator", ["-e", `bash -lc "cd '${cwd}' && ${command}; exec bash"`]],
    ];

    for (const [bin, args] of emulators) {
      try {
        spawn(bin, args, { cwd, detached: true, stdio: "ignore" }).unref();
        return true;
      } catch {
        // tenta o próximo
      }
    }
  } catch {
    // cai no fallback
  }

  // Fallback: roda inline
  spawn(command, { cwd, shell: true, stdio: "inherit" });
  return false;
}