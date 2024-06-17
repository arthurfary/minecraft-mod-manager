const { Command } = require("commander");

const program = new Command();

program
  .option("-s, --search", "Searches for a mod.")
  .option("-mv, --minecraft-version <version>");

program.parse(process.argv);

const options = program.opts();
