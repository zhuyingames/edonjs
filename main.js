#!/usr/bin/env node

//console.log("edonjs: Editor on NodeJS");

const VERSION = "0.0.6";

const fs = require("fs");

const stdin = process.stdin;
const stdout = process.stdout;

const ESC = "\u001b";

const inputBuffer = [];

function useAlternateScreenBuffer() {
  stdout.write(`${ESC}[?1049h`);
}

function useMainScreenBuffer() {
  stdout.write(`${ESC}[?1049l`);
}

if (process.argv.length > 2) {
  const cmd1 = process.argv[2];
  switch (cmd1) {
    case "version":
    case "ver":
    case "-v": {
      console.log(VERSION);
      process.exit(0);
    }
  }
}

useAlternateScreenBuffer();

stdout.cursorTo(0, 0);

process.on("exit", () => {
  useMainScreenBuffer();
});

stdin.setRawMode(true);

stdin.on("data", (data) => {
  if (data.length === 1) {
    const number = data[0];
    if (number < 0 || number > 127) {
      console.error("invalid input");
      process.exit(1);
    }
    if (number <= 31) {
      switch (number) {
        // Escape:
        case 27: {
          process.exit(0);
        }
      }
    } else if (number <= 126) {
      const ascii = String.fromCharCode(number);
      inputBuffer.push(ascii);
      stdout.write(ascii);
    } else {
    }
  } else {
  }
});
