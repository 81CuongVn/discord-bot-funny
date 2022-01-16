import { readdirSync } from "fs";
import path from "path";
import { table } from "table";
import { IClient } from "./../types/index";
var dataLog = [["filename", "status"]];

const MessageCommandHandler = (client: IClient) => {
  var dirMain = readdirSync(path.join(__dirname, "../commands/"));
  for (const dir of dirMain) {
    console.log(dir);
    var commands = readdirSync(
      path.join(__dirname, `../commands/${dir}/`)
    ).filter((file) => file.endsWith(".ts"));
    for (var file of commands) {
      const pathToFile = path.join(__dirname, `../commands/${dir}/${file}`);
      var pull = require(pathToFile).default;
      if (pull?.name) {
        client.commands?.set(pull.name, pull);
        console.log(pathToFile);
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
  }

  console.log("message command handlers đã được load xong");
  console.log(table(dataLog));
};
export default MessageCommandHandler;
