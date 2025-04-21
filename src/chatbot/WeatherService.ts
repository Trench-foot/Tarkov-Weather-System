import { inject, injectable } from "tsyringe";

import { IDialogueChatBot } from "@spt/helpers/Dialogue/IDialogueChatBot";
import { ISendMessageRequest } from "@spt/models/eft/dialog/ISendMessageRequest";
import { IUserDialogInfo } from "@spt/models/eft/profile/IUserDialogInfo";
import { MemberCategory } from "@spt/models/enums/MemberCategory";
import { MailSendService } from "@spt/services/MailSendService";

import { SeasonValues, setSeason, savedWeather, savedSeason, isWinter, seasonText } from "../utlis";
import { weatherMap, winterWeatherMap } from "../weathertypes";


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
		if(request.text === "forecast" && isWinter) {
			this.mailSendService.sendUserMessageToPlayer(
				sessionId,
				this.getChatBot(),
				`This is Bolt Lightning!  Your number 1 weather man in Tarkov.  Current season is: \n${seasonText}  Current weather is \n${winterWeatherMap[savedWeather]}`,
			);
			return request.dialogId;
		} else if(request.text === "forecast" && !isWinter) {
			this.mailSendService.sendUserMessageToPlayer(
				sessionId,
				this.getChatBot(),
				`This is Bolt Lightning!  Your number 1 weather man in Tarkov.  Current season is: \n${seasonText}  Current weather is \n${winterWeatherMap[savedWeather]}`,
			);
			return request.dialogId;
		} else {
			this.mailSendService.sendUserMessageToPlayer(
            sessionId,
            this.getChatBot(),
            `This is Bolt Lightning!  Your number 1 weather man in Tarkov.  I just reply back what you typed to me!:\n${request.text}`,
			);
			return request.dialogId;
		}
    }
}