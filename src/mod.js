"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const LogTextColor_1 = require("C:/snapshot/project/obj/models/spt/logging/LogTextColor");
const config_json_1 = require("../config/config.json");
const summer_json_1 = require("../weather/summer.json");
const autumn_json_1 = require("../weather/autumn.json");
const spring_json_1 = require("../weather/spring.json");
const winter_json_1 = require("../weather/winter.json");
const autumn_late_json_1 = require("../weather/autumn_late.json");
const spring_early_json_1 = require("../weather/spring_early.json");
const ConfigTypes_1 = require("C:/snapshot/project/obj/models/enums/ConfigTypes");
const utlis_1 = require("./utlis");
const seasons_1 = require("./seasons");
const weathertypes_1 = require("./weathertypes");
class TarkovWeatherSystem {
    // Logger instance
    logger;
    preSptLoad(container) {
        this.logger = container.resolve("WinstonLogger");
        const configServer = container.resolve("ConfigServer");
        const WeatherValues = configServer.getConfig(ConfigTypes_1.ConfigTypes.WEATHER);
        const SeasonValues = configServer.getConfig(ConfigTypes_1.ConfigTypes.WEATHER);
        // Values to attempt to set a delayed transition of seasons when gaming sessions have long separations
        let differenceSeasonDate = (Date.now() - utlis_1.savedDate);
        let serverSeasonDate = (Date.now() - differenceSeasonDate);
        WeatherValues.seasonDates = seasons_1.seasonDates;
        SeasonValues.seasonDates = seasons_1.seasonDates;
        const staticRouterModService = container.resolve("StaticRouterModService");
        // Make sure the saved season is set by the mod on load
        WeatherValues["last"] = serverSeasonDate;
        SeasonValues["last"] = serverSeasonDate;
        WeatherValues.overrideSeason = utlis_1.savedSeason;
        SeasonValues.overrideSeason = utlis_1.savedSeason;
        // Resets the weather value back to default
        config_json_1.resetWeather &&
            (0, utlis_1.setWeather)(WeatherValues, 8);
        //setSeason(SeasonValues);
        if (utlis_1.savedSeason == 2) {
            utlis_1.isWinter = true;
        }
        else {
            utlis_1.isWinter = false;
        }
        config_json_1.enable &&
            this.logger.log(`[TWS] Loaded....`, LogTextColor_1.LogTextColor.YELLOW);
        config_json_1.enableSeasons &&
            this.logger.log(`[TWS] Current season is: ${seasons_1.seasonMap[SeasonValues.overrideSeason]}`, LogTextColor_1.LogTextColor.CYAN);
        config_json_1.enableWeather && !utlis_1.isWinter &&
            this.logger.log(`[TWS] Last weather front was: ${weathertypes_1.weatherMap[utlis_1.savedWeather]}`, LogTextColor_1.LogTextColor.CYAN);
        config_json_1.enableWeather && utlis_1.isWinter &&
            this.logger.log(`[TWS] Last weather front was: ${weathertypes_1.winterWeatherMap[utlis_1.savedWeather]}`, LogTextColor_1.LogTextColor.CYAN);
        // Set season and weather during client/items callback
        config_json_1.enable &&
            staticRouterModService.registerStaticRouter("[TWS] /client/items", [
                {
                    url: "/client/items",
                    action: async (_url, info, sessionId, output) => {
                        let weather = this.getRandomWeather(container, SeasonValues);
                        if (config_json_1.enableWeather) {
                            (0, utlis_1.setWeather)(WeatherValues, weather);
                        }
                        config_json_1.consoleMessages &&
                            console.log(weather);
                        if (config_json_1.enableSeasons) {
                            (0, utlis_1.setSeason)(SeasonValues);
                        }
                        return output;
                    },
                },
            ], "[TWS] /client/items");
        // Set season and weather during client/game/logout callback
        config_json_1.enable &&
            staticRouterModService.registerStaticRouter("[TWS] /client/game/logout", [
                {
                    url: "/client/game/logout",
                    action: async (_url, info, sessionId, output) => {
                        let weather = this.getRandomWeather(container, SeasonValues);
                        if (config_json_1.enableWeather) {
                            (0, utlis_1.setWeather)(WeatherValues, weather);
                        }
                        config_json_1.consoleMessages &&
                            console.log(weather);
                        if (config_json_1.enableSeasons) {
                            (0, utlis_1.setSeason)(SeasonValues);
                        }
                        return output;
                    },
                },
            ], "[TWS] /client/game/logout");
        // Set season and weather during client/game/keepalive callback
        config_json_1.enable &&
            staticRouterModService.registerStaticRouter("[TWS] /client/game/keepalive", [
                {
                    url: "/client/game/keepalive",
                    action: async (_url, info, sessionId, output) => {
                        let weather = this.getRandomWeather(container, SeasonValues);
                        if (config_json_1.enableWeather) {
                            (0, utlis_1.setWeather)(WeatherValues, weather);
                        }
                        config_json_1.consoleMessages &&
                            console.log(weather);
                        if (config_json_1.enableSeasons) {
                            (0, utlis_1.setSeason)(SeasonValues);
                        }
                        return output;
                    },
                },
            ], "[TWS] /client/game/keepalive");
        // Set season during client/match/local/end callback
        config_json_1.enable && config_json_1.enableSeasons &&
            staticRouterModService.registerStaticRouter("[TWS] /client/match/local/end", [
                {
                    url: "/client/match/local/end",
                    action: async (_url, info, sessionId, output) => {
                        (0, utlis_1.setSeason)(SeasonValues);
                        return output;
                    },
                },
            ], "[TWS] /client/match/local/end");
        // Set weather during client/weather callback
        config_json_1.enable && config_json_1.enableWeather &&
            staticRouterModService.registerStaticRouter("[TWS] /client/weather", [
                {
                    url: "/client/weather",
                    action: async (_url, info, sessionId, output) => {
                        let weather = this.getRandomWeather(container, SeasonValues);
                        (0, utlis_1.setWeather)(WeatherValues, weather);
                        config_json_1.consoleMessages &&
                            console.log(weather);
                        return output;
                    },
                },
            ], "[TWS] /client/weather");
        // Set season and weather during client/items callback
        config_json_1.enable && config_json_1.debugEnable &&
            staticRouterModService.registerStaticRouter("[TWS] /launcher/server/version", [
                {
                    url: "/launcher/server/version",
                    action: async (_url, info, sessionId, output) => {
                        let weather = this.getRandomWeather(container, SeasonValues);
                        if (config_json_1.enableWeather) {
                            (0, utlis_1.setWeather)(WeatherValues, weather);
                        }
                        config_json_1.consoleMessages &&
                            console.log(weather);
                        if (config_json_1.enableSeasons) {
                            (0, utlis_1.setSeason)(SeasonValues);
                        }
                        return output;
                    },
                },
            ], "[TWS] /launcher/server/version");
    }
    // 95% of this function comes from random season ripoff, I hope bushtail doesn't mind
    getRandomWeather(container, SeasonValues) {
        // Get weather weights and store them in an array
        let weatherWeights;
        // Prevent selecting a new weather if the current one hasn't run its course yet
        if (utlis_1.savedWeatherTime >= 1) {
            config_json_1.consoleMessages &&
                console.log("1 or higher");
            return utlis_1.savedWeather;
        }
        // Select which seasons weather to use
        if (SeasonValues.overrideSeason === 0) {
            config_json_1.consoleMessages &&
                console.log("Setting Summer Weather");
            weatherWeights = [summer_json_1.S_Stormy, summer_json_1.S_Foggy, summer_json_1.S_Windy, summer_json_1.S_Misty, summer_json_1.S_SunFog, summer_json_1.S_Sunny, summer_json_1.S_FStorm];
        }
        else if (SeasonValues.overrideSeason === 1) {
            config_json_1.consoleMessages &&
                console.log("Setting Autumn Weather");
            weatherWeights = [autumn_json_1.A_Stormy, autumn_json_1.A_Foggy, autumn_json_1.A_Windy, autumn_json_1.A_Misty, autumn_json_1.A_SunFog, autumn_json_1.A_Sunny, autumn_json_1.A_FStorm];
        }
        else if (SeasonValues.overrideSeason === 2) {
            config_json_1.consoleMessages &&
                console.log("Setting Winter Weather");
            weatherWeights = [winter_json_1.W_HSnow, winter_json_1.W_Foggy, winter_json_1.W_Windy, winter_json_1.W_Flurry, winter_json_1.W_SunFog, winter_json_1.W_Sunny, winter_json_1.W_Blizzard];
        }
        else if (SeasonValues.overrideSeason === 3) {
            config_json_1.consoleMessages &&
                console.log("Setting Spring Weather");
            weatherWeights = [spring_json_1.Sr_Stormy, spring_json_1.Sr_Foggy, spring_json_1.Sr_Windy, spring_json_1.Sr_Misty, spring_json_1.Sr_SunFog, spring_json_1.Sr_Sunny, spring_json_1.Sr_FStorm];
        }
        else if (SeasonValues.overrideSeason === 4) {
            config_json_1.consoleMessages &&
                console.log("Setting Autumn_late Weather");
            weatherWeights = [autumn_late_json_1.Al_Stormy, autumn_late_json_1.Al_Foggy, autumn_late_json_1.Al_Windy, autumn_late_json_1.Al_Misty, autumn_late_json_1.Al_SunFog, autumn_late_json_1.Al_Sunny, autumn_late_json_1.Al_FStorm];
        }
        else if (SeasonValues.overrideSeason === 5) {
            config_json_1.consoleMessages &&
                console.log("Setting Spring_early Weather");
            weatherWeights = [spring_early_json_1.Se_Stormy, spring_early_json_1.Se_Foggy, spring_early_json_1.Se_Windy, spring_early_json_1.Se_Misty, spring_early_json_1.Se_SunFog, spring_early_json_1.Se_Sunny, spring_early_json_1.Se_FStorm];
        }
        // Check if any value in weatherWeights is not a number or is negative, and returns if so
        if (weatherWeights.some(weight => typeof weight !== "number" || weight < 0)) {
            this.logger.error(`[TWS] Invalid season weights in config. All weights must be non-negative numbers.`);
            console.log("error");
            return;
        }
        // Calculate total of all weather weights by summing up values in weatherWeights
        const totalWeight = weatherWeights.reduce((sum, weight) => sum + weight, 0);
        // Generate a random number between 0 and the total weight to select a weather based on the weights
        const random = Math.random() * totalWeight;
        // Iterate through the weatherWeights array, keeping a running total (cumulativeWeight)
        let cumulativeWeight = 0;
        for (let i = 0; i < weatherWeights.length; i++) {
            cumulativeWeight += weatherWeights[i];
            if (random < cumulativeWeight) {
                // Return the index of the first weather where the random number is less than the cumulative weight
                return i;
            }
        }
        throw new Error("Failed to select a weather based on weightings.");
    }
}
module.exports = { mod: new TarkovWeatherSystem() };
//# sourceMappingURL=mod.js.map