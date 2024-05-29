#!/usr/bin/env node

//console.log("edonjs: Editor on NodeJS");

const fs = require("fs");

const stdin = process.stdin;
const stdout = process.stdout;

stdin.setRawMode(true);

stdin.on("data", (data) => {
  const number = data[0];
  if (number === 27) {
    process.exit(0);
  }
  const ascii = String.fromCharCode(number);
  stdout.write(ascii);
});
