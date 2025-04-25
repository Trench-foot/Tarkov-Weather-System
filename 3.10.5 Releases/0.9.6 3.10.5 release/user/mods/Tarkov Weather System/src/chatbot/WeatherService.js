"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WeatherService = void 0;
const tsyringe_1 = require("C:/snapshot/project/node_modules/tsyringe");
const MemberCategory_1 = require("C:/snapshot/project/obj/models/enums/MemberCategory");
const MailSendService_1 = require("C:/snapshot/project/obj/services/MailSendService");
const utlis_1 = require("../utlis");
const weathertypes_1 = require("../weathertypes");
const WeatherResponses_1 = require("./WeatherResponses");
//    \/   dont forger this annotation here!
let WeatherService = class WeatherService {
    mailSendService;
    constructor(mailSendService) {
        this.mailSendService = mailSendService;
    }
    getChatBot() {
        return {
            _id: "6725eea2f238904716f89a08",
            aid: 7821004,
            Info: {
                Level: 1,
                MemberCategory: MemberCategory_1.MemberCategory.SHERPA,
                Nickname: "Tarkov Weather Service",
                Side: "Usec",
            },
        };
    }
    handleMessage(sessionId, request) {
        // This whole switch function is way too long IMO
        // I should probably find a better way
        switch (utlis_1.chatbotEnabled) {
            case request.text === "forecast" && utlis_1.isWinter &&
                utlis_1.seasonsEnabled && utlis_1.weatherEnabled:
                this.mailSendService.sendUserMessageToPlayer(sessionId, this.getChatBot(), `This is Bolt Lightning!  Your number one weather man in Tarkov.\n` +
                    `${utlis_1.seasonText} is expected to continue for another ${utlis_1.savedTime} minutes.\n` +
                    `${weathertypes_1.winterWeatherMap[utlis_1.savedWeather]} conditions are expect to continue for another ${utlis_1.savedWeatherTime} minutes.`);
                return request.dialogId;
                break;
            case request.text === "forecast" && !utlis_1.isWinter &&
                utlis_1.seasonsEnabled && utlis_1.weatherEnabled:
                this.mailSendService.sendUserMessageToPlayer(sessionId, this.getChatBot(), `This is Bolt Lightning!  Your number one weather man in Tarkov.\n` +
                    `${utlis_1.seasonText} is expected to continue for another ${utlis_1.savedTime} minutes.\n` +
                    `${weathertypes_1.weatherMap[utlis_1.savedWeather]} conditions are expect to continue for another ${utlis_1.savedWeatherTime} minutes.`);
                return request.dialogId;
                break;
            case request.text === "forecast" && utlis_1.isWinter &&
                utlis_1.seasonsEnabled:
                this.mailSendService.sendUserMessageToPlayer(sessionId, this.getChatBot(), `This is Bolt Lightning!  Your number one weather man in Tarkov.\n` +
                    `${utlis_1.seasonText} is expected to continue for another ${utlis_1.savedTime} minutes.\n`);
                return request.dialogId;
                break;
            case request.text === "forecast" && !utlis_1.isWinter &&
                utlis_1.seasonsEnabled:
                this.mailSendService.sendUserMessageToPlayer(sessionId, this.getChatBot(), `This is Bolt Lightning!  Your number one weather man in Tarkov.\n` +
                    `${utlis_1.seasonText} is expected to continue for another ${utlis_1.savedTime} minutes.\n`);
                return request.dialogId;
                break;
            case request.text === "forecast" && utlis_1.isWinter &&
                utlis_1.weatherEnabled:
                this.mailSendService.sendUserMessageToPlayer(sessionId, this.getChatBot(), `This is Bolt Lightning!  Your number one weather man in Tarkov.\n` +
                    `${weathertypes_1.winterWeatherMap[utlis_1.savedWeather]} conditions are expect to continue for another ${utlis_1.savedWeatherTime} minutes.`);
                return request.dialogId;
                break;
            case request.text === "forecast" && !utlis_1.isWinter &&
                utlis_1.weatherEnabled:
                this.mailSendService.sendUserMessageToPlayer(sessionId, this.getChatBot(), `This is Bolt Lightning!  Your number one weather man in Tarkov.\n` +
                    `${weathertypes_1.weatherMap[utlis_1.savedWeather]} conditions are expect to continue for another ${utlis_1.savedWeatherTime} minutes.`);
                return request.dialogId;
                break;
            case request.text == "Force Stormy":
                utlis_1.forceWeatherEnd = true;
                utlis_1.forceWeatherType = 0;
                if (!utlis_1.weatherEnabled) {
                    this.mailSendService.sendUserMessageToPlayer(sessionId, this.getChatBot(), `Weather changes disabled, enable in config.`);
                }
                else {
                    this.mailSendService.sendUserMessageToPlayer(sessionId, this.getChatBot(), `Forcing storms`);
                }
                return request.dialogId;
                break;
            case request.text == "Force Foggy":
                utlis_1.forceWeatherEnd = true;
                utlis_1.forceWeatherType = 1;
                this.mailSendService.sendUserMessageToPlayer(sessionId, this.getChatBot(), `Forcing fog`);
                return request.dialogId;
                break;
            case request.text == "Force Windy":
                utlis_1.forceWeatherEnd = true;
                utlis_1.forceWeatherType = 2;
                this.mailSendService.sendUserMessageToPlayer(sessionId, this.getChatBot(), `Forcing high winds`);
                return request.dialogId;
                break;
            case request.text == "Force Misty":
                utlis_1.forceWeatherEnd = true;
                utlis_1.forceWeatherType = 3;
                this.mailSendService.sendUserMessageToPlayer(sessionId, this.getChatBot(), `Forcing misty light rain`);
                return request.dialogId;
                break;
            case request.text == "Force Foggy Sunny":
                utlis_1.forceWeatherEnd = true;
                utlis_1.forceWeatherType = 4;
                this.mailSendService.sendUserMessageToPlayer(sessionId, this.getChatBot(), `Forcing sunny fog`);
                return request.dialogId;
                break;
            case request.text == "Force Sunny":
                utlis_1.forceWeatherEnd = true;
                utlis_1.forceWeatherType = 5;
                this.mailSendService.sendUserMessageToPlayer(sessionId, this.getChatBot(), `Forcing sunny`);
                return request.dialogId;
                break;
            case request.text == "Force Foggy Stormy":
                utlis_1.forceWeatherEnd = true;
                utlis_1.forceWeatherType = 6;
                this.mailSendService.sendUserMessageToPlayer(sessionId, this.getChatBot(), `Forcing heavy storms and fog`);
                return request.dialogId;
                break;
            case request.text == "Force Blizzard":
                utlis_1.forceWeatherEnd = true;
                utlis_1.forceWeatherType = 6;
                this.mailSendService.sendUserMessageToPlayer(sessionId, this.getChatBot(), `Forcing blizzards`);
                return request.dialogId;
                break;
            case request.text == "Force Summer":
                utlis_1.forceSeasonEnd = true;
                utlis_1.forceSeasonType = 0;
                utlis_1.isWinter = false;
                this.mailSendService.sendUserMessageToPlayer(sessionId, this.getChatBot(), `Forcing summer`);
                return request.dialogId;
                break;
            case request.text == "Force Autumn":
                utlis_1.forceSeasonEnd = true;
                utlis_1.forceSeasonType = 1;
                utlis_1.isWinter = false;
                this.mailSendService.sendUserMessageToPlayer(sessionId, this.getChatBot(), `Forcing autumn`);
                return request.dialogId;
                break;
            case request.text == "Force Winter":
                utlis_1.forceSeasonEnd = true;
                utlis_1.forceSeasonType = 2;
                utlis_1.isWinter = true;
                this.mailSendService.sendUserMessageToPlayer(sessionId, this.getChatBot(), `Forcing winter`);
                return request.dialogId;
                break;
            case request.text == "Force Spring":
                utlis_1.forceSeasonEnd = true;
                utlis_1.forceSeasonType = 3;
                utlis_1.isWinter = false;
                this.mailSendService.sendUserMessageToPlayer(sessionId, this.getChatBot(), `Forcing spring`);
                return request.dialogId;
                break;
            case request.text == "Force Late Autumn":
                utlis_1.forceSeasonEnd = true;
                utlis_1.forceSeasonType = 4;
                utlis_1.isWinter = false;
                this.mailSendService.sendUserMessageToPlayer(sessionId, this.getChatBot(), `Forcing late autumn`);
                return request.dialogId;
                break;
            case request.text == "Force Early Spring":
                utlis_1.forceSeasonEnd = true;
                utlis_1.forceSeasonType = 5;
                utlis_1.isWinter = false;
                this.mailSendService.sendUserMessageToPlayer(sessionId, this.getChatBot(), `Forcing early spring`);
                return request.dialogId;
                break;
            default:
                this.mailSendService.sendUserMessageToPlayer(sessionId, this.getChatBot(), WeatherResponses_1.testText);
                return request.dialogId;
                break;
        }
    }
};
exports.WeatherService = WeatherService;
exports.WeatherService = WeatherService = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("MailSendService")),
    __metadata("design:paramtypes", [typeof (_a = typeof MailSendService_1.MailSendService !== "undefined" && MailSendService_1.MailSendService) === "function" ? _a : Object])
], WeatherService);
//# sourceMappingURL=WeatherService.js.map