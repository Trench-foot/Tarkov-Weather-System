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
        if (request.text === "forecast" && utlis_1.isWinter) {
            this.mailSendService.sendUserMessageToPlayer(sessionId, this.getChatBot(), `This is Bolt Lightning!  Your number 1 weather man in Tarkov.  Current season is: \n${utlis_1.seasonText}  Current weather is \n${weathertypes_1.winterWeatherMap[utlis_1.savedWeather]}`);
            return request.dialogId;
        }
        else {
            this.mailSendService.sendUserMessageToPlayer(sessionId, this.getChatBot(), `This is Bolt Lightning!  Your number 1 weather man in Tarkov.  I just reply back what you typed to me!:\n${request.text}`);
            return request.dialogId;
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