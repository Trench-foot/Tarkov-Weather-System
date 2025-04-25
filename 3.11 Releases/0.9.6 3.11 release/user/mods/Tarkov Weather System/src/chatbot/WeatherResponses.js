"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notWinterForecast = exports.winterForecast = exports.testText = void 0;
// Attempt at moving weatherservice response text from the functions
//import { enable, enableSeasons, enableWeather } from ".../config/config.json";
const utlis_1 = require("../utlis");
const weathertypes_1 = require("../weathertypes");
exports.testText = `This is Bolt Lightning with a list of commands!  Your number one weather man in Tarkov.\n` +
    `Use one of the following commands\n` +
    `To check the current weather and season type:\n` +
    `forecast\n` +
    `To change weather use:\n` +
    `Force Stormy\n` +
    `Force Foggy\n` +
    `Force Windy\n` +
    `Force Misty\n` +
    `Force Foggy Sunny\n` +
    `Force Sunny\n` +
    `Force Foggy Stormy\n` +
    `To change season use:\n` +
    `Force Summer\n` +
    `Force Autumn\n` +
    `Force Winter\n` +
    `Force Spring\n` +
    `Force Late Autumn\n` +
    `Force Early Spring\n`;
exports.winterForecast = `This is Bolt Lightning!  Your number one weather man in Tarkov.\n` +
    `Current season is: ${utlis_1.seasonText}\n` +
    `Current weather is: ${weathertypes_1.winterWeatherMap[utlis_1.savedWeather]}`;
exports.notWinterForecast = `This is Bolt Lightning!  Your number one weather man in Tarkov.\n` +
    `Current season is: ${utlis_1.seasonText}\n` +
    `Current weather is: \n${weathertypes_1.weatherMap[utlis_1.savedWeather]}`;
//# sourceMappingURL=WeatherResponses.js.map