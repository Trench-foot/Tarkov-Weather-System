"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setWeather = exports.setSeason = exports.savedDate = exports.savedTime = exports.savedSeason = exports.savedWeatherTime = exports.weatherDuration = exports.weatherStartDate = exports.savedWeatherText = exports.savedWeather = exports.weather = exports.seasonPath = exports.weatherPath = void 0;
const config_json_1 = require("../config/config.json");
const weathertypes_1 = require("./weathertypes");
const seasons_1 = require("./seasons");
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
// Path to the save databases
exports.weatherPath = path.resolve(path.dirname(__filename), "./db/weather.json");
exports.seasonPath = path.resolve(path.dirname(__filename), "./db/season.json");
// Reading the weather database file
const dbWeather = readJsonFile(exports.weatherPath);
exports.savedWeather = dbWeather.savedcurrentweather;
exports.savedWeatherText = dbWeather.savedweathertext;
exports.weatherStartDate = dbWeather.weatherstart;
exports.weatherDuration = dbWeather.weatherlength;
exports.savedWeatherTime = dbWeather.weatherleft;
// Reading the seasons database file
const dbSeason = readJsonFile(exports.seasonPath);
exports.savedSeason = dbSeason.season;
exports.savedTime = dbSeason.seasonleft;
exports.savedDate = dbSeason.seasonstart;
// Used to clamp the bottom of time left on weather to 0
let weatherLowerClamp = 0;
// Set season
const setSeason = (SeasonValues) => {
    const currentSeason = seasons_1.seasonMap[SeasonValues.overrideSeason];
    switch (config_json_1.enableSeasons) {
        case (config_json_1.foreverSummer):
            exports.savedTime = 2000;
            SeasonValues["last"] = Date.now();
            SeasonValues.overrideSeason = 0;
            config_json_1.consoleMessages &&
                console.log("[TWS]  Bask in the glow of an endless summer.");
            break;
        case (config_json_1.endlessWinter):
            exports.savedTime = 2000;
            SeasonValues["last"] = Date.now();
            SeasonValues.overrideSeason = 2;
            config_json_1.consoleMessages &&
                console.log("[TWS]  Freeze in an endless winter.");
            break;
        case Date.now() - SeasonValues["last"] >=
            config_json_1.seasonLength[currentSeason] * 60000
            && SeasonValues.overrideSeason === 4:
            SeasonValues["last"] = Date.now();
            SeasonValues.overrideSeason = 2;
            config_json_1.consoleMessages &&
                console.log("[TWS] The season has changed! It is now:", seasons_1.seasonMap[SeasonValues.overrideSeason]);
            break;
        case Date.now() - SeasonValues["last"] >=
            config_json_1.seasonLength[currentSeason] * 60000
            && SeasonValues.overrideSeason === 2:
            SeasonValues["last"] = Date.now();
            SeasonValues.overrideSeason = 5;
            config_json_1.consoleMessages &&
                console.log("[TWS] The season has changed! It is now:", seasons_1.seasonMap[SeasonValues.overrideSeason]);
            break;
        case Date.now() - SeasonValues["last"] >=
            config_json_1.seasonLength[currentSeason] * 60000
            && SeasonValues.overrideSeason === 5:
            SeasonValues["last"] = Date.now();
            SeasonValues.overrideSeason = 3;
            config_json_1.consoleMessages &&
                console.log("[TWS] The season has changed! It is now:", seasons_1.seasonMap[SeasonValues.overrideSeason]);
            break;
        case Date.now() - SeasonValues["last"] >=
            config_json_1.seasonLength[currentSeason] * 60000
            && SeasonValues.overrideSeason === 3:
            SeasonValues["last"] = Date.now();
            SeasonValues.overrideSeason = 0;
            config_json_1.consoleMessages &&
                console.log("[TWS] The season has changed! It is now:", seasons_1.seasonMap[SeasonValues.overrideSeason]);
            break;
        case Date.now() - SeasonValues["last"] >=
            config_json_1.seasonLength[currentSeason] * 60000
            && SeasonValues.overrideSeason === 0:
            SeasonValues["last"] = Date.now();
            SeasonValues.overrideSeason = 1;
            config_json_1.consoleMessages &&
                console.log("[TWS] The season has changed! It is now:", seasons_1.seasonMap[SeasonValues.overrideSeason]);
            break;
        case Date.now() - SeasonValues["last"] >=
            config_json_1.seasonLength[currentSeason] * 60000
            && SeasonValues.overrideSeason === 1:
            SeasonValues["last"] = Date.now();
            SeasonValues.overrideSeason = 4;
            config_json_1.consoleMessages &&
                console.log("[TWS] The season has changed! It is now:", seasons_1.seasonMap[SeasonValues.overrideSeason]);
            break;
        default:
            config_json_1.consoleMessages &&
                console.log("[TWS] The season is still", seasons_1.seasonMap[SeasonValues.overrideSeason] + ".", "Time until next season:", exports.savedTime = Math.round((config_json_1.seasonLength[currentSeason] * 60000 -
                    (Date.now() - SeasonValues["last"])) /
                    60000), "Minutes.");
            break;
    }
    // Begin season save data
    const newSeasonData = {
        season: SeasonValues.overrideSeason,
        seasontext: seasons_1.seasonMap[SeasonValues.overrideSeason],
        seasonstart: SeasonValues["last"],
        seasonlength: config_json_1.seasonLength[currentSeason],
        seasonleft: exports.savedTime
    };
    fs.writeFileSync(exports.seasonPath, JSON.stringify(newSeasonData, null, 4));
    // End season save data
};
exports.setSeason = setSeason;
// Set weather
const setWeather = (WeatherValues, randomWeather) => {
    let currentWeather = randomWeather;
    switch (config_json_1.enableWeather) {
        case exports.savedWeatherTime == weatherLowerClamp
            && currentWeather == 0:
            exports.weatherDuration = getRandomWeatherDuration(config_json_1.minWeatherDuration, config_json_1.maxWeatherDuration);
            exports.savedWeatherTime = exports.weatherDuration;
            exports.weatherStartDate = Date.now();
            exports.savedWeather = currentWeather;
            exports.savedWeatherText = "...stormyDefault";
            WeatherValues.weather = {
                ...WeatherValues.weather,
                ...weathertypes_1.stormyDefault,
            };
            config_json_1.consoleMessages &&
                console.log("[TWS] Setting stormy");
            break;
        case exports.savedWeatherTime == weatherLowerClamp
            && currentWeather == 1:
            exports.weatherDuration = getRandomWeatherDuration(config_json_1.minWeatherDuration, config_json_1.maxWeatherDuration);
            exports.savedWeatherTime = exports.weatherDuration;
            exports.weatherStartDate = Date.now();
            exports.savedWeather = currentWeather;
            exports.savedWeatherText = "...foggyDefault";
            WeatherValues.weather = {
                ...WeatherValues.weather,
                ...weathertypes_1.foggyDefault,
            };
            config_json_1.consoleMessages &&
                console.log("[TWS] Setting foggy");
            break;
        case exports.savedWeatherTime == weatherLowerClamp
            && currentWeather == 2:
            exports.weatherDuration = getRandomWeatherDuration(config_json_1.minWeatherDuration, config_json_1.maxWeatherDuration);
            exports.savedWeatherTime = exports.weatherDuration;
            exports.weatherStartDate = Date.now();
            exports.savedWeather = currentWeather;
            exports.savedWeatherText = "...windyDefault";
            WeatherValues.weather = {
                ...WeatherValues.weather,
                ...weathertypes_1.windyDefault,
            };
            config_json_1.consoleMessages &&
                console.log("[TWS] Setting windy");
            break;
        case exports.savedWeatherTime == weatherLowerClamp
            && currentWeather == 3:
            exports.weatherDuration = getRandomWeatherDuration(config_json_1.minWeatherDuration, config_json_1.maxWeatherDuration);
            exports.savedWeatherTime = exports.weatherDuration;
            exports.weatherStartDate = Date.now();
            exports.savedWeather = currentWeather;
            exports.savedWeatherText = "...mistyDefault";
            WeatherValues.weather = {
                ...WeatherValues.weather,
                ...weathertypes_1.mistyDefault,
            };
            config_json_1.consoleMessages &&
                console.log("[TWS] Setting moody");
            break;
        case exports.savedWeatherTime == weatherLowerClamp
            && currentWeather == 4:
            exports.weatherDuration = getRandomWeatherDuration(config_json_1.minWeatherDuration, config_json_1.maxWeatherDuration);
            exports.savedWeatherTime = exports.weatherDuration;
            exports.weatherStartDate = Date.now();
            exports.savedWeather = currentWeather;
            exports.savedWeatherText = "...foggySunnyDefault";
            WeatherValues.weather = {
                ...WeatherValues.weather,
                ...weathertypes_1.foggySunnyDefault,
            };
            config_json_1.consoleMessages &&
                console.log("[TWS] Setting sunny fog");
            break;
        case exports.savedWeatherTime == weatherLowerClamp
            && currentWeather == 5:
            exports.weatherDuration = getRandomWeatherDuration(config_json_1.minWeatherDuration, config_json_1.maxWeatherDuration);
            exports.savedWeatherTime = exports.weatherDuration;
            exports.weatherStartDate = Date.now();
            exports.savedWeather = currentWeather;
            exports.savedWeatherText = "...sunnyDefault";
            WeatherValues.weather = {
                ...WeatherValues.weather,
                ...weathertypes_1.sunnyDefault,
            };
            config_json_1.consoleMessages &&
                console.log("[TWS] Setting sunny");
            break;
        case exports.savedWeatherTime == weatherLowerClamp
            && currentWeather == 7:
            exports.weatherDuration = getRandomWeatherDuration(config_json_1.minWeatherDuration, config_json_1.maxWeatherDuration);
            exports.savedWeatherTime = exports.weatherDuration;
            exports.weatherStartDate = Date.now();
            exports.savedWeather = currentWeather;
            exports.savedWeatherText = "...blizzardDefault";
            WeatherValues.weather = {
                ...WeatherValues.weather,
                ...weathertypes_1.blizzardDefault,
            };
            config_json_1.consoleMessages &&
                console.log("[TWS] Setting blizzard");
            break;
        case config_json_1.resetWeather:
            exports.weatherDuration = getRandomWeatherDuration(config_json_1.minWeatherDuration, config_json_1.maxWeatherDuration);
            exports.savedWeatherTime = exports.weatherDuration;
            exports.weatherStartDate = Date.now();
            exports.savedWeather = currentWeather;
            exports.savedWeatherText = "...defaultWeather";
            WeatherValues.weather = {
                ...WeatherValues.weather,
                ...weathertypes_1.defaultWeather,
            };
            config_json_1.consoleMessages &&
                console.log("[TWS] Setting test weather");
            break;
        default:
            let tempWeatherTime = Math.round((exports.weatherDuration * 60000 -
                (Date.now() - exports.weatherStartDate)) /
                60000);
            // Attempt to prevent weather from going crazy negative and breaking weather
            exports.savedWeatherTime = clamp(tempWeatherTime, weatherLowerClamp, config_json_1.maxWeatherDuration);
            ;
            config_json_1.consoleMessages &&
                console.log("[TWS] Current weather is still", weathertypes_1.weatherMap[exports.savedWeather] + ".", "Time until next weather front:", exports.savedWeatherTime, "Minutes.");
            //console.log(savedWeather);
            break;
    }
    // Begin weather save data
    const newWeatherData = {
        savedcurrentweather: exports.savedWeather,
        savedweathertext: exports.savedWeatherText,
        weatherstart: exports.weatherStartDate,
        weatherlength: exports.weatherDuration,
        weatherleft: exports.savedWeatherTime
    };
    fs.writeFileSync(exports.weatherPath, JSON.stringify(newWeatherData, null, 4));
    // End weather save data
};
exports.setWeather = setWeather;
// Read JSON files
function readJsonFile(filePath) {
    try {
        return JSON.parse(fs.readFileSync(filePath, "utf-8"));
    }
    catch (error) {
        console.error(`Error reading or parsing JSON file: ${error.message}`);
        throw error; // Re-throw the error to propagate it to the caller
    }
}
;
// Get a random number
function getRandomWeatherDuration(min, max) {
    max = Math.ceil(max);
    min = Math.floor(min);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
;
// THE CLAMP!!!!!
function clamp(num, min, max) {
    return Math.min(Math.max(num, min), max);
}
;
//# sourceMappingURL=utlis.js.map