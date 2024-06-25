import inquirer from "inquirer";

async function selector(opts, text) {
  const choices = opts.map((opt) => ({
    name: `${opt}`,
  }));

  const prompt = await inquirer.prompt({
    name: "choice",
    type: "list",
    message: text,
    choices,
  });

  return prompt.choice;
}

export default selector;
