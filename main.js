#!/usr/bin/env node

//console.log("edonjs: Editor on NodeJS");

const VERSION = "0.0.9";

const fs = require("fs");

const stdin = process.stdin;
const stdout = process.stdout;

const ESC = "\u001b";

const inputBuffer = [];
let rowIndex = 0;
let columnIndex = 0;
let cursorX = 0;
let cursorY = 0;
let rows = 0;
let colunms = 0;

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

stdout.cursorTo(cursorX, cursorY);

rows = stdout.rows;
colunms = stdout.columns;

stdout.on("resize", () => {
  rows = stdout.rows;
  colunms = stdout.columns;
});

process.on("exit", () => {
  useMainScreenBuffer();
});

stdin.setRawMode(true);

function input(number) {
  const ascii = String.fromCharCode(number);
  inputBuffer.splice(columnIndex, 0, ascii);
  if (columnIndex < colunms) {
    if (cursorX < colunms - 1) {
      cursorX++;
    }
    stdout.cursorTo(0, cursorY);
    for (let i = 0; i < inputBuffer.length; i++) {
      stdout.write(inputBuffer[i]);
    }
    stdout.cursorTo(cursorX, cursorY);
  } else {
    stdout.cursorTo(0, cursorY);
    const offsetX = 1 + columnIndex - colunms;
    for (let i = offsetX; i < colunms + offsetX; i++) {
      stdout.write(inputBuffer[i]);
    }
  }
  columnIndex++;
}

function backspace() {
  if (columnIndex > 0) {
    inputBuffer.pop();
    columnIndex--;
    if (columnIndex < colunms) {
      cursorX--;
      stdout.cursorTo(columnIndex, cursorY);
      stdout.write(" ");
      stdout.cursorTo(columnIndex, cursorY);
    } else {
      stdout.cursorTo(0, cursorY);
      const offsetX = columnIndex - colunms;
      for (let i = offsetX; i < colunms + offsetX; i++) {
        stdout.write(inputBuffer[i]);
      }
    }
  }
}

function cursorLeft() {
  if (cursorX > 0) {
    if (columnIndex > 0) {
      columnIndex--;
    }
    cursorX--;
    stdout.cursorTo(cursorX, cursorY);
  }
}

function cursorRight() {
  if (cursorX < columnIndex) {
    if (cursorX < colunms - 1) {
      cursorX++;
      stdout.cursorTo(cursorX, cursorY);
    }
  }
}

stdin.on("data", (data) => {
  if (data.length === 1) {
    const number = data[0];
    if (number < 0 || number > 127) {
      console.error("invalid input");
      process.exit(1);
    }
    if (number <= 31) {
      switch (number) {
        // Backspace
        case 8: {
          backspace();
          break;
        }
        // CR
        case 13: {
          break;
        }
        // Escape:
        case 27: {
          process.exit(0);
        }
      }
    } else if (number <= 126) {
      input(number);
    } else {
      backspace();
    }
  } else {
    if (data.length === 3) {
      // Arrows
      if (data[0] === 27 && data[1] === 91) {
        switch (data[2]) {
          // up
          case 65: {
            break;
          }
          // down
          case 66: {
            break;
          }
          // right
          case 67: {
            cursorRight();
            break;
          }
          // left
          case 68: {
            cursorLeft();
            break;
          }
        }
      }
    }
  }
});
