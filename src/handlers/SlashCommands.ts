import { table } from "table";
import fs from "fs";
import path from "path";
import { IClient } from "../types";
import glob from "glob";
import { promisify } from "util";

const slashCommandDirs = ["../SlashCommands", "../ButtonCommands"];

const globPromise = promisify(glob);

async function ImportFile(filePath: string) {
  const file = (await import(filePath)).default;
  return file;
}

export default async (client: IClient) => {
  // set up for slash command
  const arrayOfCommands: any[] = [];
  let data = [["filename", "status"]];
  for (const slashCommandDir of slashCommandDirs) {
    const commandFile = await globPromise(`${slashCommandDir}/*/*{.ts,.js}`, {
      cwd: __dirname,
    });
    for (const file of commandFile) {
      const command = await ImportFile(file);
      const fileName = path.join(__dirname, file);
      if (command) {
        if (!command?.name) {
          data.push([file, "missing name"]);
        } else {
          command.name = command.name.toLocaleLowerCase();
          client.slashCommand?.set(command.name, fileName);
          data.push([file, "☑ ok"]);
          if (command.description) arrayOfCommands.push(command);
        }
      } else {
        data.push([file, "forgot to export default or something"]);
      }
    }
    client.slashCommandObject = arrayOfCommands;
    console.log(slashCommandDir + " đã được load xong :)");
    console.log(table(data));
    data = [["filename", "status"]];
  }
};
