import chalk from "chalk";

const BRAND = ["#7c3aed", "#2563eb", "#06b6d4", "#22d3ee"];

function grad(text) {
  const chars = [...text];
  return chars
    .map((c, i) => {
      const color = BRAND[Math.floor((i / Math.max(chars.length - 1, 1)) * (BRAND.length - 1))];
      return chalk.hex(color)(c);
    })
    .join("");
}

const LOGO = [
"  ██████╗ ██████╗ ██╗████████╗   ██████╗ ██████╗ ",
" ██╔════╝ ██╔══██╗██║╚══██╔══╝   ██╔══██╗██╔══██╗",
" ██║  ███╗██████╔╝██║   ██║      ██║  ██║██████╔╝",
" ██║   ██║██╔══██╗██║   ██║      ██║  ██║██╔══██╗",
" ╚██████╔╝██████╔╝██║   ██║      ██████╔╝██████╔╝",
"  ╚═════╝ ╚═════╝ ╚═╝   ╚═╝      ╚═════╝ ╚═════╝ ",
];

export function banner(subtitle = "Full-stack backend engine") {
  console.log("");
  for (const line of LOGO) console.log(grad(line));
  console.log("");
  console.log(
    "  " +
      chalk.bgHex("#7c3aed").white.bold(" GBIT DB ") +
      " " +
      chalk.gray(subtitle),
  );
  console.log("  " + chalk.gray("next.js · gbit-db-dados · gbit-database · gbit-container · portal ai"));
  console.log("");
}

export function rule(label = "") {
  const line = "─".repeat(Math.max(58 - label.length, 4));
  console.log(chalk.hex("#334155")(`  ${label ? chalk.white.bold(label) + " " : ""}${line}`));
}

const FRAMES = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];

export function spinner(text) {
  const tty = process.stdout.isTTY;
  const started = Date.now();
  let i = 0;
  let timer;

  const render = () => {
    process.stdout.write(
      `\r  ${chalk.hex("#22d3ee")(FRAMES[(i = ++i % FRAMES.length)])} ${chalk.white(text)}   `,
    );
  };

  if (tty) {
    render();
    timer = setInterval(render, 80);
  } else {
    console.log(`  • ${text}`);
  }

  const stop = (symbol, color, message) => {
    if (timer) clearInterval(timer);
    const secs = ((Date.now() - started) / 1000).toFixed(1);
    const line = `  ${color(symbol)} ${chalk.white(message || text)} ${chalk.gray(`(${secs}s)`)}`;
    if (tty) process.stdout.write("\r" + " ".repeat(80) + "\r");
    console.log(line);
  };

  return {
    succeed: (msg) => stop("✔", chalk.green, msg),
    fail: (msg) => stop("✖", chalk.red, msg),
    update: (msg) => {
      text = msg;
    },
  };
}

export function box(title, lines) {
  const width = Math.max(title.length + 4, ...lines.map((l) => stripLen(l) + 4), 46);
  const top = "╭" + "─".repeat(width) + "╮";
  const bottom = "╰" + "─".repeat(width) + "╯";
  console.log(chalk.hex("#7c3aed")(top));
  console.log(
    chalk.hex("#7c3aed")("│") +
      " " +
      chalk.white.bold(title.padEnd(width - 2)) +
      " " +
      chalk.hex("#7c3aed")("│"),
  );
  console.log(chalk.hex("#7c3aed")("│") + " ".repeat(width) + chalk.hex("#7c3aed")("│"));
  for (const l of lines) {
    console.log(
      chalk.hex("#7c3aed")("│") +
        " " +
        l +
        " ".repeat(Math.max(width - 2 - stripLen(l), 0)) +
        " " +
        chalk.hex("#7c3aed")("│"),
    );
  }
  console.log(chalk.hex("#7c3aed")(bottom));
}

function stripLen(str) {
  // eslint-disable-next-line no-control-regex
  return str.replace(/\u001b\[[0-9;]*m/g, "").length;
}

export const c = chalk;