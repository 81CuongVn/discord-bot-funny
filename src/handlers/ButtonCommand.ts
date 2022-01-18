import { table } from "table";
import fs from "fs";
import path from "path";
import { IClient } from "src/types";

const slashCommandDir = "../ButtonCommands/";

export default function getCommands(client: IClient) {
  // set up for slash command
  const data = [["filename", "status"]];
  const commandFolder = fs.readdirSync(
    path.join(__dirname, `${slashCommandDir}/`)
  );
  for (const folder of commandFolder) {
    console.log(folder);
    const folderPath = path.join(__dirname, `${slashCommandDir}`, folder);
    const files = fs.readdirSync(folderPath);
    for (const file of files) {
      const fileName = path.join(
        __dirname,
        `${slashCommandDir}/`,
        folder,
        file
      );
      const command = require(fileName).default;
      if (command) {
        if (!command?.name) {
          data.push([file, "missing name"]); //${folder}/
        } else {
          console.log(fileName);
          data.push([file, "☑ ok"]); //${folder}/
          client.buttonCommand?.set(command.name, fileName);
        }
      } else {
        data.push([file, "forgot to export default or something"]); //${folder}/
      }
    }
  }
  console.log("button command đã được load xong :)");
  console.log(table(data));

}
