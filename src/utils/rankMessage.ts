
import { Message } from 'discord.js';
import { RankUserModel } from 'src/model/RankUser';
import { IClient } from './../types/index';
export default async function rankMessage(message: Message, client: IClient) {
    let rank = 0
    if (message.content.length <= 1024) {
        rank = rank + 50
    } else { 
        rank = rank + 100
    }
    if (message.content.length <= 500) {
        rank = rank + 25
    }
    if (message.content.length <= 100) {
        rank = rank + 10
    }
    if (message.content.length <= 50) {
        rank = rank + 5
    }
    if (message.content.length <= 20) {
        rank = rank + 2
    }
    if (message.content.length <= 10) {
        rank = rank + 1
    }
    if (message.content.length <= 5) {
        rank = rank + 0.5
    }
    if (message.content.length <= 3) {
        rank = rank + 0.25
    }
    if (message.content.length <= 2) {
        rank = rank + 0.1
    }
    if (message.content.length <= 1) {
        rank = rank + 0.05
    }
    if (message.content.length <= 0) {
        rank = rank + 0.01
    }
    const addPoint = Math.floor(Math.random() * 100) + 1;
    const rankFinal = rank + addPoint;
    const lastRankInDatabase = await RankUserModel.findOne({
        userId: message.author.id
    })
    if (lastRankInDatabase) {
        await RankUserModel.findByIdAndUpdate(lastRankInDatabase._id, {
            rank: lastRankInDatabase.rankMessage + rankFinal
        })
    } else {
        const newRankUser = new RankUserModel({
            userId: message.author.id,
            rank: rankFinal
        })
        await newRankUser.save()
    }
    return await RankUserModel.findOne({
        userId: message.author.id
    })
}