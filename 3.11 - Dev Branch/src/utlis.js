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
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.forceWeather = exports.setWeather = exports.setSeason = exports.forceWeatherText = exports.forceWeatherType = exports.forceWeatherEnd = exports.forceSeasonType = exports.forceSeasonEnd = exports.SeasonValues = exports.WeatherValues = exports.savedDate = exports.savedTime = exports.seasonText = exports.savedSeason = exports.isWinter = exports.savedWeatherName = exports.savedWeatherTime = exports.weatherDuration = exports.weatherStartDate = exports.savedWeatherText = exports.savedWeather = exports.weather = exports.seasonPath = exports.weatherPath = void 0;
const config_json_1 = require("../config/config.json");
const weathertypes_1 = require("./weathertypes");
const seasons_1 = require("./seasons");
const weathertypes_2 = require("./weathertypes");
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
exports.savedWeatherName = dbWeather.savedweathername;
// Reading the seasons database file
const dbSeason = readJsonFile(exports.seasonPath);
exports.isWinter = dbSeason.iswinter;
exports.savedSeason = dbSeason.season;
exports.seasonText = dbSeason.seasontext;
exports.savedTime = dbSeason.seasonleft;
exports.savedDate = dbSeason.seasonstart;
// Used to clamp the bottom of time left on weather to 0
let weatherLowerClamp = 0;
// Used to force a season change with chatbot
exports.forceSeasonEnd = false;
// Used to force a weather change with chatbot
exports.forceWeatherEnd = false;
// Set season
const setSeason = (SeasonValues) => {
    const currentSeason = seasons_1.seasonMap[SeasonValues.overrideSeason];
    const forcedSeason = exports.forceSeasonType;
    switch (config_json_1.enableSeasons) {
        // Forces a change of season, luckily this works
        case exports.forceSeasonEnd:
            SeasonValues["last"] = Date.now();
            SeasonValues.overrideSeason = forcedSeason;
            config_json_1.consoleMessages &&
                console.log("[TWS] The season has changed! It is now:", seasons_1.seasonMap[SeasonValues.overrideSeason]);
            break;
        case (config_json_1.foreverSummer):
            exports.savedTime = 2000;
            SeasonValues["last"] = Date.now();
            SeasonValues.overrideSeason = 0;
            exports.isWinter = false;
            config_json_1.consoleMessages &&
                console.log("[TWS]  Bask in the glow of an endless summer.");
            break;
        case (config_json_1.endlessWinter):
            exports.savedTime = 2000;
            SeasonValues["last"] = Date.now();
            SeasonValues.overrideSeason = 2;
            exports.isWinter = true;
            config_json_1.consoleMessages &&
                console.log("[TWS]  Freeze in an endless winter.");
            break;
        case Date.now() - SeasonValues["last"] >=
            config_json_1.seasonLength[currentSeason] * 60000
            && SeasonValues.overrideSeason === 4:
            SeasonValues["last"] = Date.now();
            SeasonValues.overrideSeason = 2;
            exports.isWinter = true;
            config_json_1.consoleMessages &&
                console.log("[TWS] The season has changed! It is now:", seasons_1.seasonMap[SeasonValues.overrideSeason]);
            break;
        case Date.now() - SeasonValues["last"] >=
            config_json_1.seasonLength[currentSeason] * 60000
            && SeasonValues.overrideSeason === 2:
            SeasonValues["last"] = Date.now();
            SeasonValues.overrideSeason = 5;
            exports.isWinter = false;
            config_json_1.consoleMessages &&
                console.log("[TWS] The season has changed! It is now:", seasons_1.seasonMap[SeasonValues.overrideSeason]);
            break;
        case Date.now() - SeasonValues["last"] >=
            config_json_1.seasonLength[currentSeason] * 60000
            && SeasonValues.overrideSeason === 5:
            SeasonValues["last"] = Date.now();
            SeasonValues.overrideSeason = 3;
            exports.isWinter = false;
            config_json_1.consoleMessages &&
                console.log("[TWS] The season has changed! It is now:", seasons_1.seasonMap[SeasonValues.overrideSeason]);
            break;
        case Date.now() - SeasonValues["last"] >=
            config_json_1.seasonLength[currentSeason] * 60000
            && SeasonValues.overrideSeason === 3:
            SeasonValues["last"] = Date.now();
            SeasonValues.overrideSeason = 0;
            exports.isWinter = false;
            config_json_1.consoleMessages &&
                console.log("[TWS] The season has changed! It is now:", seasons_1.seasonMap[SeasonValues.overrideSeason]);
            break;
        case Date.now() - SeasonValues["last"] >=
            config_json_1.seasonLength[currentSeason] * 60000
            && SeasonValues.overrideSeason === 0:
            SeasonValues["last"] = Date.now();
            SeasonValues.overrideSeason = 1;
            exports.isWinter = false;
            config_json_1.consoleMessages &&
                console.log("[TWS] The season has changed! It is now:", seasons_1.seasonMap[SeasonValues.overrideSeason]);
            break;
        case Date.now() - SeasonValues["last"] >=
            config_json_1.seasonLength[currentSeason] * 60000
            && SeasonValues.overrideSeason === 1:
            SeasonValues["last"] = Date.now();
            SeasonValues.overrideSeason = 4;
            exports.isWinter = false;
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
        iswinter: exports.isWinter,
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
            config_json_1.consoleMessages && !exports.isWinter &&
                console.log("[TWS] Setting", weathertypes_1.weatherMap[exports.savedWeather]);
            config_json_1.consoleMessages && exports.isWinter &&
                console.log("[TWS] Setting", weathertypes_2.winterWeatherMap[exports.savedWeather]);
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
            config_json_1.consoleMessages && !exports.isWinter &&
                console.log("[TWS] Setting", weathertypes_1.weatherMap[exports.savedWeather]);
            config_json_1.consoleMessages && exports.isWinter &&
                console.log("[TWS] Setting", weathertypes_2.winterWeatherMap[exports.savedWeather]);
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
            config_json_1.consoleMessages && !exports.isWinter &&
                console.log("[TWS] Setting", weathertypes_1.weatherMap[exports.savedWeather]);
            config_json_1.consoleMessages && exports.isWinter &&
                console.log("[TWS] Setting", weathertypes_2.winterWeatherMap[exports.savedWeather]);
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
            config_json_1.consoleMessages && !exports.isWinter &&
                console.log("[TWS] Setting", weathertypes_1.weatherMap[exports.savedWeather]);
            config_json_1.consoleMessages && exports.isWinter &&
                console.log("[TWS] Setting", weathertypes_2.winterWeatherMap[exports.savedWeather]);
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
            config_json_1.consoleMessages && !exports.isWinter &&
                console.log("[TWS] Setting", weathertypes_1.weatherMap[exports.savedWeather]);
            config_json_1.consoleMessages && exports.isWinter &&
                console.log("[TWS] Setting", weathertypes_2.winterWeatherMap[exports.savedWeather]);
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
            config_json_1.consoleMessages && !exports.isWinter &&
                console.log("[TWS] Setting", weathertypes_1.weatherMap[exports.savedWeather]);
            config_json_1.consoleMessages && exports.isWinter &&
                console.log("[TWS] Setting", weathertypes_2.winterWeatherMap[exports.savedWeather]);
            break;
        case exports.savedWeatherTime == weatherLowerClamp
            && currentWeather == 6:
            exports.weatherDuration = getRandomWeatherDuration(config_json_1.minWeatherDuration, config_json_1.maxWeatherDuration);
            exports.savedWeatherTime = exports.weatherDuration;
            exports.weatherStartDate = Date.now();
            exports.savedWeather = currentWeather;
            exports.savedWeatherText = "...foggyStormDefault";
            WeatherValues.weather = {
                ...WeatherValues.weather,
                ...weathertypes_1.foggyStormDefault,
            };
            config_json_1.consoleMessages && !exports.isWinter &&
                console.log("[TWS] Setting", weathertypes_1.weatherMap[exports.savedWeather]);
            config_json_1.consoleMessages && exports.isWinter &&
                console.log("[TWS] Setting", weathertypes_2.winterWeatherMap[exports.savedWeather]);
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
            if (exports.isWinter === false) {
                exports.savedWeatherName = weathertypes_1.weatherMap[exports.savedWeather];
            }
            else if (exports.isWinter === true) {
                exports.savedWeatherName = weathertypes_2.winterWeatherMap[exports.savedWeather];
            }
            config_json_1.consoleMessages && !exports.isWinter &&
                console.log("[TWS] Current weather is still", weathertypes_1.weatherMap[exports.savedWeather] + ".", "Time until next weather front:", exports.savedWeatherTime, "Minutes.");
            config_json_1.consoleMessages && exports.isWinter &&
                console.log("[TWS] Current weather is still", weathertypes_2.winterWeatherMap[exports.savedWeather] + ".", "Time until next weather front:", exports.savedWeatherTime, "Minutes.");
            break;
    }
    // Begin weather save data
    const newWeatherData = {
        savedcurrentweather: exports.savedWeather,
        savedweathername: exports.savedWeatherName,
        savedweathertext: exports.savedWeatherText,
        weatherstart: exports.weatherStartDate,
        weatherlength: exports.weatherDuration,
        weatherleft: exports.savedWeatherTime
    };
    fs.writeFileSync(exports.weatherPath, JSON.stringify(newWeatherData, null, 4));
    // End weather save data
};
exports.setWeather = setWeather;
// Forces weather because I couldn't hook in to the setWeather very easily
const forceWeather = (WeatherValues, forcedWeather) => {
    let currentWeather = forcedWeather;
    switch (config_json_1.enableWeather) {
        case exports.forceWeatherEnd
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
            if (exports.isWinter === false) {
                exports.savedWeatherName = weathertypes_1.weatherMap[exports.savedWeather];
            }
            else if (exports.isWinter === true) {
                exports.savedWeatherName = weathertypes_2.winterWeatherMap[exports.savedWeather];
            }
            config_json_1.consoleMessages && !exports.isWinter &&
                console.log("[TWS] Setting", weathertypes_1.weatherMap[exports.savedWeather]);
            config_json_1.consoleMessages && exports.isWinter &&
                console.log("[TWS] Setting", weathertypes_2.winterWeatherMap[exports.savedWeather]);
            break;
        case exports.forceWeatherEnd
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
            if (exports.isWinter === false) {
                exports.savedWeatherName = weathertypes_1.weatherMap[exports.savedWeather];
            }
            else if (exports.isWinter === true) {
                exports.savedWeatherName = weathertypes_2.winterWeatherMap[exports.savedWeather];
            }
            config_json_1.consoleMessages && !exports.isWinter &&
                console.log("[TWS] Setting", weathertypes_1.weatherMap[exports.savedWeather]);
            config_json_1.consoleMessages && exports.isWinter &&
                console.log("[TWS] Setting", weathertypes_2.winterWeatherMap[exports.savedWeather]);
            break;
        case exports.forceWeatherEnd
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
            if (exports.isWinter === false) {
                exports.savedWeatherName = weathertypes_1.weatherMap[exports.savedWeather];
            }
            else if (exports.isWinter === true) {
                exports.savedWeatherName = weathertypes_2.winterWeatherMap[exports.savedWeather];
            }
            config_json_1.consoleMessages && !exports.isWinter &&
                console.log("[TWS] Setting", weathertypes_1.weatherMap[exports.savedWeather]);
            config_json_1.consoleMessages && exports.isWinter &&
                console.log("[TWS] Setting", weathertypes_2.winterWeatherMap[exports.savedWeather]);
            break;
        case exports.forceWeatherEnd
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
            if (exports.isWinter === false) {
                exports.savedWeatherName = weathertypes_1.weatherMap[exports.savedWeather];
            }
            else if (exports.isWinter === true) {
                exports.savedWeatherName = weathertypes_2.winterWeatherMap[exports.savedWeather];
            }
            config_json_1.consoleMessages && !exports.isWinter &&
                console.log("[TWS] Setting", weathertypes_1.weatherMap[exports.savedWeather]);
            config_json_1.consoleMessages && exports.isWinter &&
                console.log("[TWS] Setting", weathertypes_2.winterWeatherMap[exports.savedWeather]);
            break;
        case exports.forceWeatherEnd
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
            if (exports.isWinter === false) {
                exports.savedWeatherName = weathertypes_1.weatherMap[exports.savedWeather];
            }
            else if (exports.isWinter === true) {
                exports.savedWeatherName = weathertypes_2.winterWeatherMap[exports.savedWeather];
            }
            config_json_1.consoleMessages && !exports.isWinter &&
                console.log("[TWS] Setting", weathertypes_1.weatherMap[exports.savedWeather]);
            config_json_1.consoleMessages && exports.isWinter &&
                console.log("[TWS] Setting", weathertypes_2.winterWeatherMap[exports.savedWeather]);
            break;
        case exports.forceWeatherEnd
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
            if (exports.isWinter === false) {
                exports.savedWeatherName = weathertypes_1.weatherMap[exports.savedWeather];
            }
            else if (exports.isWinter === true) {
                exports.savedWeatherName = weathertypes_2.winterWeatherMap[exports.savedWeather];
            }
            config_json_1.consoleMessages && !exports.isWinter &&
                console.log("[TWS] Setting", weathertypes_1.weatherMap[exports.savedWeather]);
            config_json_1.consoleMessages && exports.isWinter &&
                console.log("[TWS] Setting", weathertypes_2.winterWeatherMap[exports.savedWeather]);
            break;
        case exports.forceWeatherEnd
            && currentWeather == 6:
            exports.weatherDuration = getRandomWeatherDuration(config_json_1.minWeatherDuration, config_json_1.maxWeatherDuration);
            exports.savedWeatherTime = exports.weatherDuration;
            exports.weatherStartDate = Date.now();
            exports.savedWeather = currentWeather;
            exports.savedWeatherText = "...foggyStormDefault";
            WeatherValues.weather = {
                ...WeatherValues.weather,
                ...weathertypes_1.foggyStormDefault,
            };
            if (exports.isWinter === false) {
                exports.savedWeatherName = weathertypes_1.weatherMap[exports.savedWeather];
            }
            else if (exports.isWinter === true) {
                exports.savedWeatherName = weathertypes_2.winterWeatherMap[exports.savedWeather];
            }
            config_json_1.consoleMessages && !exports.isWinter &&
                console.log("[TWS] Setting", weathertypes_1.weatherMap[exports.savedWeather]);
            config_json_1.consoleMessages && exports.isWinter &&
                console.log("[TWS] Setting", weathertypes_2.winterWeatherMap[exports.savedWeather]);
            break;
        default:
            let tempWeatherTime = Math.round((exports.weatherDuration * 60000 -
                (Date.now() - exports.weatherStartDate)) /
                60000);
            // Attempt to prevent weather from going crazy negative and breaking weather
            exports.savedWeatherTime = clamp(tempWeatherTime, weatherLowerClamp, config_json_1.maxWeatherDuration);
            ;
            if (exports.isWinter === false) {
                exports.savedWeatherName = weathertypes_1.weatherMap[exports.savedWeather];
            }
            else if (exports.isWinter === true) {
                exports.savedWeatherName = weathertypes_2.winterWeatherMap[exports.savedWeather];
            }
            config_json_1.consoleMessages && !exports.isWinter &&
                console.log("[TWS] Current weather is still", weathertypes_1.weatherMap[exports.savedWeather] + ".", "Time until next weather front:", exports.savedWeatherTime, "Minutes.");
            config_json_1.consoleMessages && exports.isWinter &&
                console.log("[TWS] Current weather is still", weathertypes_2.winterWeatherMap[exports.savedWeather] + ".", "Time until next weather front:", exports.savedWeatherTime, "Minutes.");
            break;
    }
    // Begin weather save data
    const newWeatherData = {
        savedcurrentweather: exports.savedWeather,
        savedweathername: exports.savedWeatherName,
        savedweathertext: exports.savedWeatherText,
        weatherstart: exports.weatherStartDate,
        weatherlength: exports.weatherDuration,
        weatherleft: exports.savedWeatherTime
    };
    fs.writeFileSync(exports.weatherPath, JSON.stringify(newWeatherData, null, 4));
    // End weather save data
};
exports.forceWeather = forceWeather;
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