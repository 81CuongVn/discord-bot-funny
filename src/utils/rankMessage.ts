import { Message } from "discord.js";
import { xpUserModel } from "../model/RankUser";
import { IClient } from "./../types/index";
export default async function xpMessage(message: Message, client: IClient) {
  let xp = 0;
  if (message.content.length <= 1024) {
    xp = xp + 50;
  } else {
    xp = xp + 100;
  }
  if (message.content.length <= 500) {
    xp = xp + 25;
  }
  if (message.content.length <= 100) {
    xp = xp + 10;
  }
  if (message.content.length <= 50) {
    xp = xp + 5;
  }
  if (message.content.length <= 20) {
    xp = xp + 2;
  }
  if (message.content.length <= 10) {
    xp = xp + 1;
  }
  if (message.content.length <= 5) {
    xp = xp + 0.5;
  }
  if (message.content.length <= 3) {
    xp = xp + 0.25;
  }
  if (message.content.length <= 2) {
    xp = xp + 0.1;
  }
  if (message.content.length <= 1) {
    xp = xp + 0.05;
  }
  if (message.content.length <= 0) {
    xp = xp + 0.01;
  }
  const addPoint = Math.round(Math.random() * 100) + 1;
  const xpFinal = xp + addPoint;
  const lastXpInDatabase = await xpUserModel.findOne({
    userId: message.author.id,
    serverId: message.guild?.id,
  });
  const serverId = message.guild?.id;
  if (lastXpInDatabase) {
    await xpUserModel.findOneAndUpdate(
      {
        _id: lastXpInDatabase._id,
        serverId: serverId,
      },
      {
        xp: lastXpInDatabase.xpMessage + xpFinal,
      }
    );
  } else {
    const newXpUser = new xpUserModel({
      userId: message.author.id,
      xpMessage: xpFinal,
      xpAnswer: 0,
      serverId: serverId,
    });
    await newXpUser.save();
  }
  return await xpUserModel.findOne({
    userId: message.author.id,
  });
}
