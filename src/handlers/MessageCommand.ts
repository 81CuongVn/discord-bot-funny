import { readdirSync } from "fs";
import path from "path";
import { table } from "table";
import { IClient } from "./../types/index";
var dataLog = [["filename", "status"]];
import glob from "glob";
import { promisify } from "util";

const globPromise = promisify(glob);

async function ImportFile(filePath: string) {
  const file = (await import(filePath)).default;
  return file;
}

const MessageCommandHandler = async (client: IClient) => {
  // var dirMain = readdirSync(path.join(__dirname, "../commands/"));
  // dirMain.forEach((dir) => {
  //   var commands = readdirSync(
  //     path.join(__dirname, `../commands/${dir}/`)
  //   ).filter((file) => file.endsWith(".ts"));

  // });
  const commandFile = await globPromise(`../commands/*/*{.ts,.js}`, {
    cwd: __dirname,
  });
  for (const file of commandFile) {
    const fileName = path.join(__dirname, file);
    const pull = await ImportFile(fileName);
    if (pull?.name) {
      client.commands?.set(pull.name, pull);
      dataLog.push([file, "☑ file status is good"]);
    } else {
      dataLog.push([file, " thieu name"]);
      continue;
    }
    if (pull.aliases && Array.isArray(pull.aliases)) {
      pull.aliases.map((alias: string) => {
        client.aliases?.set(alias, pull.name);
      });
    }
  }
  console.log("message command handlers đã được load xong");
  console.log(table(dataLog));
};
export default MessageCommandHandler;
