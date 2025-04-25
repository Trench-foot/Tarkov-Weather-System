import { inject, injectable } from "tsyringe";

import { IDialogueChatBot } from "@spt/helpers/Dialogue/IDialogueChatBot";
import { ISendMessageRequest } from "@spt/models/eft/dialog/ISendMessageRequest";
import { IUserDialogInfo } from "@spt/models/eft/profile/IUserDialogInfo";
import { MemberCategory } from "@spt/models/enums/MemberCategory";
import { MailSendService } from "@spt/services/MailSendService";

import { 
  seasonsEnabled,
  weatherEnabled,
  chatbotEnabled,
  SeasonValues, 
  savedWeather, 
  savedSeason,
  savedTime,
  savedWeatherTime,
  isWinter, 
  seasonText, 
  forceWeatherEnd, 
  forceWeatherType, 
  forceWeatherText,
  forceSeasonEnd,
  forceSeasonType,
  } from "../utlis";
import { weatherMap, winterWeatherMap } from "../weathertypes";

import { 
  testText, 
  winterForecast,
  notWinterForecast,
  } from "./WeatherResponses";


//    \/   dont forger this annotation here!
@injectable()
export class WeatherService implements IDialogueChatBot
{
    constructor(
        @inject("MailSendService") protected mailSendService: MailSendService,
    )
    {}

    public getChatBot(): IUserDialogInfo
    {
        return {
            _id: "6725eea2f238904716f89a08",
            aid: 7821004,
            Info: {
                Level: 1,
                MemberCategory: MemberCategory.SHERPA,
                Nickname: "Tarkov Weather Service",
                Side: "Usec",
            },
        };
    }
	
	
	
   public handleMessage(sessionId: string, request: ISendMessageRequest): string
    {
		// This whole switch function is way too long IMO
		// I should probably find a better way
		switch(chatbotEnabled) {
			
			case request.text === "forecast" && seasonsEnabled && weatherEnabled:
				if(isWinter) {
					this.mailSendService.sendUserMessageToPlayer(
						sessionId,
						this.getChatBot(),
						`This is Bolt Lightning!  Your number one weather man in Tarkov.\n` +
						`${seasonText} is expected to continue for another ${savedTime} minutes.\n` +
						`${winterWeatherMap[savedWeather]} conditions are expect to continue for another ${savedWeatherTime} minutes.`,
					);
				} else {
					this.mailSendService.sendUserMessageToPlayer(
						sessionId,
						this.getChatBot(),
						`This is Bolt Lightning!  Your number one weather man in Tarkov.\n` +
						`${seasonText} is expected to continue for another ${savedTime} minutes.\n` +
						`${weatherMap[savedWeather]} conditions are expect to continue for another ${savedWeatherTime} minutes.`,
				);
				}
			return request.dialogId;
			break;
			
			case request.text === "forecast" && seasonsEnabled:
				if(isWinter) {
					this.mailSendService.sendUserMessageToPlayer(
						sessionId,
						this.getChatBot(),
						`This is Bolt Lightning!  Your number one weather man in Tarkov.\n` +
						`${seasonText} is expected to continue for another ${savedTime} minutes.`,
					);
				} else {
					this.mailSendService.sendUserMessageToPlayer(
						sessionId,
						this.getChatBot(),
						`This is Bolt Lightning!  Your number one weather man in Tarkov.\n` +
						`${seasonText} is expected to continue for another ${savedTime} minutes.`,
				);
				}
			return request.dialogId;
			break;
			
			case request.text === "forecast" && weatherEnabled:
				if(isWinter) {
					this.mailSendService.sendUserMessageToPlayer(
						sessionId,
						this.getChatBot(),
						`This is Bolt Lightning!  Your number one weather man in Tarkov.\n` +
						`${winterWeatherMap[savedWeather]} conditions are expect to continue for another ${savedWeatherTime} minutes.`,
					);
				} else {
					this.mailSendService.sendUserMessageToPlayer(
						sessionId,
						this.getChatBot(),
						`This is Bolt Lightning!  Your number one weather man in Tarkov.\n` +
						`${weatherMap[savedWeather]} conditions are expect to continue for another ${savedWeatherTime} minutes.`,
				);
				}
			return request.dialogId;
			break;
			
			case request.text == "Force Stormy":
				forceWeatherEnd = true;
				forceWeatherType = 0;
				
				if(!weatherEnabled){
					this.mailSendService.sendUserMessageToPlayer(
						sessionId,
						this.getChatBot(),
						`Weather changes disabled, enable in config.`,
				);
				} else if(isWinter) {
					this.mailSendService.sendUserMessageToPlayer(
						sessionId,
						this.getChatBot(),
						`Forcing heavy snow`,
				);
				} else {
					this.mailSendService.sendUserMessageToPlayer(
						sessionId,
						this.getChatBot(),
						`Forcing storms`,
				}
				return request.dialogId;
				break;
				
			case request.text == "Force Foggy":
				forceWeatherEnd = true;
				forceWeatherType = 1;
				
				if(!weatherEnabled){
					this.mailSendService.sendUserMessageToPlayer(
						sessionId,
						this.getChatBot(),
						`Weather changes disabled, enable in config.`,
				);
				} else {
					this.mailSendService.sendUserMessageToPlayer(
						sessionId,
						this.getChatBot(),
						`Forcing fog`,
				);
				}
				return request.dialogId;
				break;
				
			case request.text == "Force Windy":
				forceWeatherEnd = true;
				forceWeatherType = 2;
				
				if(!weatherEnabled){
					this.mailSendService.sendUserMessageToPlayer(
						sessionId,
						this.getChatBot(),
						`Weather changes disabled, enable in config.`,
				);
				} else {
					this.mailSendService.sendUserMessageToPlayer(
						sessionId,
						this.getChatBot(),
						`Forcing high winds`,
				);
				}
				return request.dialogId;
				break;
				
			case request.text == "Force Misty":
				forceWeatherEnd = true;
				forceWeatherType = 3;
				
				if(!weatherEnabled){
					this.mailSendService.sendUserMessageToPlayer(
						sessionId,
						this.getChatBot(),
						`Weather changes disabled, enable in config.`,
				);
				} else if(isWinter) {
					this.mailSendService.sendUserMessageToPlayer(
						sessionId,
						this.getChatBot(),
						`Forcing ,misty light snow`,
				);
				} else {
					this.mailSendService.sendUserMessageToPlayer(
						sessionId,
						this.getChatBot(),
						`Forcing ,misty light rain`,
				}
				return request.dialogId;
				break;
				
			case request.text == "Force Foggy Sunny":
				forceWeatherEnd = true;
				forceWeatherType = 4;
				
				if(!weatherEnabled){
					this.mailSendService.sendUserMessageToPlayer(
						sessionId,
						this.getChatBot(),
						`Weather changes disabled, enable in config.`,
				);
				} else {
					this.mailSendService.sendUserMessageToPlayer(
						sessionId,
						this.getChatBot(),
						`Forcing sunny fog`,
				);
				}
				return request.dialogId;
				break;
				
			case request.text == "Force Sunny":
				forceWeatherEnd = true;
				forceWeatherType = 5;
				
				if(!weatherEnabled){
					this.mailSendService.sendUserMessageToPlayer(
						sessionId,
						this.getChatBot(),
						`Weather changes disabled, enable in config.`,
				);
				} else {
					this.mailSendService.sendUserMessageToPlayer(
						sessionId,
						this.getChatBot(),
						`Forcing sunny`,
				);
				}
				return request.dialogId;
				break;
				
			case request.text == "Force Foggy Stormy":
				forceWeatherEnd = true;
				forceWeatherType = 6;
				
				if(!weatherEnabled){
					this.mailSendService.sendUserMessageToPlayer(
						sessionId,
						this.getChatBot(),
						`Weather changes disabled, enable in config.`,
				);
				} else if(isWinter) {
					this.mailSendService.sendUserMessageToPlayer(
						sessionId,
						this.getChatBot(),
						`Forcing blizzards`,
				);
				} else {
					this.mailSendService.sendUserMessageToPlayer(
						sessionId,
						this.getChatBot(),
						`Forcing heavy storms and fog`,
				}
				return request.dialogId;
				break;
				
			case request.text == "Force Summer":
				forceSeasonEnd = true;
				forceSeasonType = 0;
				isWinter = false;
				
				if(!seasonsEnabled){
					this.mailSendService.sendUserMessageToPlayer(
						sessionId,
						this.getChatBot(),
						`Season changes disabled, enable in config.`,
				);
				} else {
					this.mailSendService.sendUserMessageToPlayer(
						sessionId,
						this.getChatBot(),
						`Forcing summer`,
				);
				}
				return request.dialogId;
				break;
				
			case request.text == "Force Autumn":
				forceSeasonEnd = true;
				forceSeasonType = 1;
				isWinter = false;
				
				if(!seasonsEnabled){
					this.mailSendService.sendUserMessageToPlayer(
						sessionId,
						this.getChatBot(),
						`Season changes disabled, enable in config.`,
				);
				} else {
					this.mailSendService.sendUserMessageToPlayer(
						sessionId,
						this.getChatBot(),
						`Forcing autumn`,
				);
				}
				return request.dialogId;
				break;
				
			case request.text == "Force Winter":
				forceSeasonEnd = true;
				forceSeasonType = 2;
				isWinter = true;
				
				if(!seasonsEnabled){
					this.mailSendService.sendUserMessageToPlayer(
						sessionId,
						this.getChatBot(),
						`Season changes disabled, enable in config.`,
				);
				} else {
					this.mailSendService.sendUserMessageToPlayer(
						sessionId,
						this.getChatBot(),
						`Forcing winter`,
				);
				}
				return request.dialogId;
				break;
				
			case request.text == "Force Spring":
				forceSeasonEnd = true;
				forceSeasonType = 3;
				isWinter = false;
				
				if(!seasonsEnabled){
					this.mailSendService.sendUserMessageToPlayer(
						sessionId,
						this.getChatBot(),
						`Season changes disabled, enable in config.`,
				);
				} else {
					this.mailSendService.sendUserMessageToPlayer(
						sessionId,
						this.getChatBot(),
						`Forcing spring`,
				);
				}
				return request.dialogId;
				break;
				
			case request.text == "Force Late Autumn":
				forceSeasonEnd = true;
				forceSeasonType = 4;
				isWinter = false;
				
				if(!seasonsEnabled){
					this.mailSendService.sendUserMessageToPlayer(
						sessionId,
						this.getChatBot(),
						`Season changes disabled, enable in config.`,
				);
				} else {
					this.mailSendService.sendUserMessageToPlayer(
						sessionId,
						this.getChatBot(),
						`Forcing late autumn`,
				);
				}
				return request.dialogId;
				break;
				
			case request.text == "Force Early Spring":
				forceSeasonEnd = true;
				forceSeasonType = 5;
				isWinter = false;
				
				if(!seasonsEnabled){
					this.mailSendService.sendUserMessageToPlayer(
						sessionId,
						this.getChatBot(),
						`Season changes disabled, enable in config.`,
				);
				} else {
					this.mailSendService.sendUserMessageToPlayer(
						sessionId,
						this.getChatBot(),
						`Forcing early spring`,
				);
				}
				return request.dialogId;
				break;
				
			default:
				this.mailSendService.sendUserMessageToPlayer(
					sessionId,
					this.getChatBot(),
					testText
			);
			return request.dialogId;
			break;
		}
    }
}