/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/brace-style */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/keyword-spacing */
/* eslint-disable @typescript-eslint/quotes */
/* eslint-disable @typescript-eslint/indent */
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
  seasonText, 
  exportVariables
  } from "../utlis";
import { weatherMap, winterWeatherMap } from "../weathertypes";

import { seasonMap } from "../seasons";

import { 
  testText, 
  winterForecast,
  notWinterForecast
  } from "./WeatherResponses";


//    \/   dont forger this annotation here!
@injectable()
export class WeatherService implements IDialogueChatBot
{
	

    constructor(
        @inject("MailSendService") protected mailSendService: MailSendService
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
				SelectedMemberCategory: MemberCategory.DEFAULT
			}
        };
    }
	
	
	
   public handleMessage(sessionId: string, request: ISendMessageRequest): string
    {
		//const exportVariables = new ExportVariables(false, false, 0, "...FStormy", false, false, 0);

		// This whole switch function is way too long IMO
		// I should probably find a better way
		switch (chatbotEnabled) 
		{
			
			case request.text === "forecast" && seasonsEnabled && weatherEnabled:
				if(exportVariables.isWinter) {
					this.mailSendService.sendUserMessageToPlayer(
						sessionId,
						this.getChatBot(),
						`This is Bolt Lightning!  Your number one weather man in Tarkov.\n` +
						`Currently ${seasonText} is expected to continue for another ${savedTime} minutes.\n` +
						`${winterWeatherMap[savedWeather]} conditions are expect to continue for another ${savedWeatherTime} minutes.`
					);
				} else {
					this.mailSendService.sendUserMessageToPlayer(
						sessionId,
						this.getChatBot(),
						`This is Bolt Lightning!  Your number one weather man in Tarkov.\n` +
						`Currently ${seasonText} is expected to continue for another ${savedTime} minutes.\n` +
						`${weatherMap[savedWeather]} conditions are expect to continue for another ${savedWeatherTime} minutes.`
					);
				}
			return request.dialogId;
			break;
			
			case request.text === "forecast" && seasonsEnabled:
				if(exportVariables.isWinter) {
					this.mailSendService.sendUserMessageToPlayer(
						sessionId,
						this.getChatBot(),
						`This is Bolt Lightning!  Your number one weather man in Tarkov.\n` +
						`$Currently {seasonText} is expected to continue for another ${savedTime} minutes.`
					);
				} else {
					this.mailSendService.sendUserMessageToPlayer(
						sessionId,
						this.getChatBot(),
						`This is Bolt Lightning!  Your number one weather man in Tarkov.\n` +
						`$Currently {seasonText} is expected to continue for another ${savedTime} minutes.`
					);
				}
			return request.dialogId;
			break;
			
			case request.text === "forecast" && weatherEnabled:
				if(exportVariables.isWinter) {
					this.mailSendService.sendUserMessageToPlayer(
						sessionId,
						this.getChatBot(),
						`This is Bolt Lightning!  Your number one weather man in Tarkov.\n` +
						`${winterWeatherMap[savedWeather]} conditions are expect to continue for another ${savedWeatherTime} minutes.`
					);
				} else {
					this.mailSendService.sendUserMessageToPlayer(
						sessionId,
						this.getChatBot(),
						`This is Bolt Lightning!  Your number one weather man in Tarkov.\n` +
						`${weatherMap[savedWeather]} conditions are expect to continue for another ${savedWeatherTime} minutes.`
					);
				}
			return request.dialogId;
			break;
			
			case request.text == "Force Stormy":
				exportVariables.forceWeatherEnd = true;
				exportVariables.forceWeatherType = 0;
				
				if(!weatherEnabled){
					this.mailSendService.sendUserMessageToPlayer(
						sessionId,
						this.getChatBot(),
						`Weather changes disabled, enable in config.`
					);
				} else if(exportVariables.isWinter) {
					this.mailSendService.sendUserMessageToPlayer(
						sessionId,
						this.getChatBot(),
						`Forcing heavy snow`
					);
				} else {
					this.mailSendService.sendUserMessageToPlayer(
						sessionId,
						this.getChatBot(),
						`Forcing storms`
					);
				}
				return request.dialogId;
				break;
				
			case request.text == "Force Foggy":
				exportVariables.forceWeatherEnd = true;
				exportVariables.forceWeatherType = 1;
				
				if(!weatherEnabled){
					this.mailSendService.sendUserMessageToPlayer(
						sessionId,
						this.getChatBot(),
						`Weather changes disabled, enable in config.`
					);
				} else {
					this.mailSendService.sendUserMessageToPlayer(
						sessionId,
						this.getChatBot(),
						`Forcing fog`
					);
				}
				return request.dialogId;
				break;
				
			case request.text == "Force Windy":
				exportVariables.forceWeatherEnd = true;
				exportVariables.forceWeatherType = 2;
				
				if(!weatherEnabled){
					this.mailSendService.sendUserMessageToPlayer(
						sessionId,
						this.getChatBot(),
						`Weather changes disabled, enable in config.`
					);
				} else {
					this.mailSendService.sendUserMessageToPlayer(
						sessionId,
						this.getChatBot(),
						`Forcing high winds`
					);
				}
				return request.dialogId;
				break;
				
			case request.text == "Force Misty":
				exportVariables.forceWeatherEnd = true;
				exportVariables.forceWeatherType = 3;
				
				if(!weatherEnabled){
					this.mailSendService.sendUserMessageToPlayer(
						sessionId,
						this.getChatBot(),
						`Weather changes disabled, enable in config.`
					);
				} else if(exportVariables.isWinter) {
					this.mailSendService.sendUserMessageToPlayer(
						sessionId,
						this.getChatBot(),
						`Forcing ,misty light snow`
					);
				} else {
					this.mailSendService.sendUserMessageToPlayer(
						sessionId,
						this.getChatBot(),
						`Forcing ,misty light rain`
					);
				}
				return request.dialogId;
				break;
				
			case request.text == "Force Foggy Sunny":
				exportVariables.forceWeatherEnd = true;
				exportVariables.forceWeatherType = 4;
				
				if(!weatherEnabled){
					this.mailSendService.sendUserMessageToPlayer(
						sessionId,
						this.getChatBot(),
						`Weather changes disabled, enable in config.`
					);
				} else {
					this.mailSendService.sendUserMessageToPlayer(
						sessionId,
						this.getChatBot(),
						`Forcing sunny fog`
					);
				}
				return request.dialogId;
				break;
				
			case request.text == "Force Sunny":
				exportVariables.forceWeatherEnd = true;
				exportVariables.forceWeatherType = 5;
				
				if(!weatherEnabled){
					this.mailSendService.sendUserMessageToPlayer(
						sessionId,
						this.getChatBot(),
						`Weather changes disabled, enable in config.`
					);
				} else {
					this.mailSendService.sendUserMessageToPlayer(
						sessionId,
						this.getChatBot(),
						`Forcing sunny`
					);
				}
				return request.dialogId;
				break;
				
			case request.text == "Force Foggy Stormy":
				exportVariables.forceWeatherEnd = true;
				exportVariables.forceWeatherType = 6;
				
				if(!weatherEnabled){
					this.mailSendService.sendUserMessageToPlayer(
						sessionId,
						this.getChatBot(),
						`Weather changes disabled, enable in config.`
					);
				} else if(exportVariables.isWinter) {
					this.mailSendService.sendUserMessageToPlayer(
						sessionId,
						this.getChatBot(),
						`Forcing blizzards`
					);
				} else {
					this.mailSendService.sendUserMessageToPlayer(
						sessionId,
						this.getChatBot(),
						`Forcing heavy storms and fog`
					);
				}
				return request.dialogId;
				break;
				
			case request.text == "Force Summer":
				exportVariables.forceSeasonEnd = true;
				exportVariables.forceSeasonType = 0;
				exportVariables.isWinter = false;
				
				if(!seasonsEnabled){
					this.mailSendService.sendUserMessageToPlayer(
						sessionId,
						this.getChatBot(),
						`Season changes disabled, enable in config.`
					);
				} else {
					this.mailSendService.sendUserMessageToPlayer(
						sessionId,
						this.getChatBot(),
						`Forcing summer`
					);
				}
				return request.dialogId;
				break;
				
			case request.text == "Force Autumn":
				exportVariables.forceSeasonEnd = true;
				exportVariables.forceSeasonType = 1;
				exportVariables.isWinter = false;
				
				if(!seasonsEnabled){
					this.mailSendService.sendUserMessageToPlayer(
						sessionId,
						this.getChatBot(),
						`Season changes disabled, enable in config.`
					);
				} else {
					this.mailSendService.sendUserMessageToPlayer(
						sessionId,
						this.getChatBot(),
						`Forcing autumn`
					);
				}
				return request.dialogId;
				break;
				
			case request.text == "Force Winter":
				exportVariables.forceSeasonEnd = true;
				exportVariables.forceSeasonType = 2;
				exportVariables.isWinter = true;
				
				if(!seasonsEnabled){
					this.mailSendService.sendUserMessageToPlayer(
						sessionId,
						this.getChatBot(),
						`Season changes disabled, enable in config.`
					);
				} else {
					this.mailSendService.sendUserMessageToPlayer(
						sessionId,
						this.getChatBot(),
						`Forcing winter`
					);
				}
				return request.dialogId;
				break;
				
			case request.text == "Force Spring":
				exportVariables.forceSeasonEnd = true;
				exportVariables.forceSeasonType = 3;
				exportVariables.isWinter = false;
				
				if(!seasonsEnabled){
					this.mailSendService.sendUserMessageToPlayer(
						sessionId,
						this.getChatBot(),
						`Season changes disabled, enable in config.`
					);
				} else {
					this.mailSendService.sendUserMessageToPlayer(
						sessionId,
						this.getChatBot(),
						`Forcing spring`
					);
				}
				return request.dialogId;
				break;
				
			case request.text == "Force Late Autumn":
				exportVariables.forceSeasonEnd = true;
				exportVariables.forceSeasonType = 4;
				exportVariables.isWinter = false;
				
				if(!seasonsEnabled){
					this.mailSendService.sendUserMessageToPlayer(
						sessionId,
						this.getChatBot(),
						`Season changes disabled, enable in config.`
					);
				} else {
					this.mailSendService.sendUserMessageToPlayer(
						sessionId,
						this.getChatBot(),
						`Forcing late autumn`
					);
				}
				return request.dialogId;
				break;
				
			case request.text == "Force Early Spring":
				exportVariables.forceSeasonEnd = true;
				exportVariables.forceSeasonType = 5;
				exportVariables.isWinter = false;
				
				if(!seasonsEnabled){
					this.mailSendService.sendUserMessageToPlayer(
						sessionId,
						this.getChatBot(),
						`Season changes disabled, enable in config.`
					);
				} else {
					this.mailSendService.sendUserMessageToPlayer(
						sessionId,
						this.getChatBot(),
						`Forcing early spring`
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