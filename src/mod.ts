/* eslint-disable @typescript-eslint/naming-convention */
import { DependencyContainer } from "tsyringe";
import { IPreSptLoadMod } from "@spt/models/external/IPreSptLoadMod";
import { ILogger } from "@spt/models/spt/utils/ILogger";
import { LogTextColor } from "@spt/models/spt/logging/LogTextColor";
import { LogBackgroundColor } from "@spt/models/spt/logging/LogBackgroundColor";
import {
	enable,
	enableSeasons,
	enableWeather,
	consoleMessages,
	debugEnable,
	resetWeather,
} from "../config/config.json";
import { S_Stormy, S_Foggy, S_Windy, S_Misty, S_SunFog, S_Sunny, S_FStorm } from "../weather/summer.json";
import { A_Stormy, A_Foggy, A_Windy, A_Misty, A_SunFog, A_Sunny, A_FStorm } from "../weather/autumn.json";
import { Sr_Stormy, Sr_Foggy, Sr_Windy, Sr_Misty, Sr_SunFog, Sr_Sunny, Sr_FStorm } from "../weather/spring.json";
import { W_HSnow, W_Foggy, W_Windy, W_Flurry, W_SunFog, W_Sunny, W_Blizzard } from "../weather/winter.json";
import { Al_Stormy, Al_Foggy, Al_Windy, Al_Misty, Al_SunFog, Al_Sunny, Al_FStorm } from "../weather/autumn_late.json";
import { Se_Stormy, Se_Foggy, Se_Windy, Se_Misty, Se_SunFog, Se_Sunny, Se_FStorm } from "../weather/spring_early.json";
import { ConfigServer } from "@spt/servers/ConfigServer";
import { ConfigTypes } from "@spt/models/enums/ConfigTypes";
import { IWeatherConfig } from "@spt/models/spt/config/IWeatherConfig";
import { StaticRouterModService } from "@spt/services/mod/staticRouter/StaticRouterModService";
import { 
	isWinter,
	savedSeason,
	savedDate,
	setSeason, 
	setWeather, 
	weather,
	savedWeatherTime,
	savedWeather,
} from "./utlis";
import { seasonMap, seasonDates } from "./seasons";
import { weatherMap, winterWeatherMap } from "./weathertypes";
import * as fs from "fs";

class TarkovWeatherSystem implements IPreSptLoadMod {
  
  // Logger instance
  private logger: ILogger;
  
  preSptLoad(container: DependencyContainer): void {
	this.logger = container.resolve<ILogger>("WinstonLogger");
	
    const configServer = container.resolve<ConfigServer>("ConfigServer");
    const WeatherValues = configServer.getConfig<IWeatherConfig>(
      ConfigTypes.WEATHER
    );
	const SeasonValues = configServer.getConfig<IWeatherConfig>(
      ConfigTypes.WEATHER
    );
	
	// Values to attempt to set a delayed transition of seasons when gaming sessions have long separations
	let differenceSeasonDate = (Date.now() - savedDate);
	let serverSeasonDate = (Date.now() - differenceSeasonDate);
	
    WeatherValues.seasonDates = seasonDates;
    SeasonValues.seasonDates = seasonDates;
	
    const staticRouterModService = container.resolve<StaticRouterModService>(
      "StaticRouterModService"
    );
	
	// Make sure the saved season is set by the mod on load
    WeatherValues["last"] = serverSeasonDate;
    SeasonValues["last"] = serverSeasonDate;
    WeatherValues.overrideSeason = savedSeason;
	SeasonValues.overrideSeason = savedSeason;
	
	// Resets the weather value back to default
	resetWeather &&
      setWeather(WeatherValues, 8);
	  
	  
	//setSeason(SeasonValues);
	
	if(savedSeason == 2) {
		isWinter = true;
	} else {
		isWinter = false;
	}
	
	enable &&
	  this.logger.log(
        `[TWS] Loaded....`
		LogTextColor.YELLOW);
	
	enableSeasons &&
	  this.logger.log(
        `[TWS] Current season is: ${seasonMap[SeasonValues.overrideSeason]}`
		LogTextColor.CYAN);
	
	enableWeather && !isWinter &&
	  this.logger.log(
		`[TWS] Last weather front was: ${weatherMap[savedWeather]}`
		LogTextColor.CYAN);
	
	enableWeather && isWinter &&
	  this.logger.log(
		`[TWS] Last weather front was: ${winterWeatherMap[savedWeather]}`
		LogTextColor.CYAN);
	
	// Set season and weather during client/items callback
	enable &&
      staticRouterModService.registerStaticRouter(
        "[TWS] /client/items",
        [
          {
            url: "/client/items",
            action: async (_url, info, sessionId, output) => {
			  
			  let weather = this.getRandomWeather(container, SeasonValues);
			  
			  if(enableWeather) {
				setWeather(WeatherValues, weather);
				}
			  
			  consoleMessages &&
			    console.log(weather);
			
			  if(enableSeasons) {
				setSeason(SeasonValues);
				}
			  
              return output;
            },
          },
        ],
        "[TWS] /client/items",
      );
	
	// Set season and weather during client/game/logout callback
	enable &&
      staticRouterModService.registerStaticRouter(
        "[TWS] /client/game/logout",
        [
          {
            url: "/client/game/logout",
            action: async (_url, info, sessionId, output) => {
			  
			  let weather = this.getRandomWeather(container, SeasonValues);
			  
			  if(enableWeather) {
				setWeather(WeatherValues, weather);
				}
			  
			  consoleMessages &&
			    console.log(weather);
			
			  if(enableSeasons) {
				setSeason(SeasonValues);
				}
			  
              return output;
            },
          },
        ],
        "[TWS] /client/game/logout",
      );
	// Set season and weather during client/game/keepalive callback
	enable &&
      staticRouterModService.registerStaticRouter(
        "[TWS] /client/game/keepalive",
        [
          {
            url: "/client/game/keepalive",
            action: async (_url, info, sessionId, output) => {
			  
			  let weather = this.getRandomWeather(container, SeasonValues);
			  
			  if(enableWeather) {
				setWeather(WeatherValues, weather);
				}
			  
			  consoleMessages &&
			    console.log(weather);
			
			  if(enableSeasons) {
				setSeason(SeasonValues);
				}
			  
              return output;
            },
          },
        ],
        "[TWS] /client/game/keepalive",
      );
	
	// Set season during client/match/local/end callback
    enable && enableSeasons &&
      staticRouterModService.registerStaticRouter(
        "[TWS] /client/match/local/end",
        [
          {
            url: "/client/match/local/end",
            action: async (_url, info, sessionId, output) => {

			  setSeason(SeasonValues);			  
			  
              return output;
            },
          },
        ],
        "[TWS] /client/match/local/end",
      );
	
	// Set weather during client/weather callback
	enable && enableWeather &&
      staticRouterModService.registerStaticRouter(
        "[TWS] /client/weather",
        [
          {
            url: "/client/weather",
            action: async (_url, info, sessionId, output) => {
			  
			  let weather = this.getRandomWeather(container, SeasonValues);
			  
			  setWeather(WeatherValues, weather);			  
			  
			  consoleMessages &&
			    console.log(weather);
			  
              return output;
            },
          },
        ],
        "[TWS] /client/weather",
      );
	  
	// Set season and weather during client/items callback
	enable && debugEnable &&
      staticRouterModService.registerStaticRouter(
        "[TWS] /launcher/server/version",
        [
          {
            url: "/launcher/server/version",
            action: async (_url, info, sessionId, output) => {
			  
			  let weather = this.getRandomWeather(container, SeasonValues);
			  
			  if(enableWeather) {
				setWeather(WeatherValues, weather);
				}
			  
			  consoleMessages &&
			    console.log(weather);
			
			  if(enableSeasons) {
				setSeason(SeasonValues);
				}
			  
              return output;
            },
          },
        ],
        "[TWS] /launcher/server/version",
      );
  }
	// 95% of this function comes from random season ripoff, I hope bushtail doesn't mind
    private getRandomWeather(container: DependencyContainer, SeasonValues: IWeatherConfig): number {
		
		// Get weather weights and store them in an array
		let weatherWeights: number[];
		
		// Prevent selecting a new weather if the current one hasn't run its course yet
		if(savedWeatherTime >= 1) {
			consoleMessages &&
			  console.log("1 or higher");
			return savedWeather;
		}
		
		// Select which seasons weather to use
		if (SeasonValues.overrideSeason === 0){
			consoleMessages &&
			  console.log("Setting Summer Weather");
			  weatherWeights = [ S_Stormy, S_Foggy, S_Windy, S_Misty, S_SunFog, S_Sunny, S_FStorm ];
			}
		else if (SeasonValues.overrideSeason === 1){
			consoleMessages &&
			  console.log("Setting Autumn Weather");
			  weatherWeights = [ A_Stormy, A_Foggy, A_Windy, A_Misty, A_SunFog, A_Sunny, A_FStorm ];
			}
		else if (SeasonValues.overrideSeason === 2){
			consoleMessages &&
			  console.log("Setting Winter Weather");
			  weatherWeights = [ W_HSnow, W_Foggy, W_Windy, W_Flurry, W_SunFog, W_Sunny, W_Blizzard ];
			}
		else if (SeasonValues.overrideSeason === 3){
			consoleMessages &&
			  console.log("Setting Spring Weather");
			  weatherWeights = [ Sr_Stormy, Sr_Foggy, Sr_Windy, Sr_Misty, Sr_SunFog, Sr_Sunny, Sr_FStorm ];
			}
		else if (SeasonValues.overrideSeason === 4){
			consoleMessages &&
			  console.log("Setting Autumn_late Weather");
			  weatherWeights = [ Al_Stormy, Al_Foggy, Al_Windy, Al_Misty, Al_SunFog, Al_Sunny, Al_FStorm ];
			}
		else if (SeasonValues.overrideSeason === 5){
			consoleMessages &&
			  console.log("Setting Spring_early Weather");
			  weatherWeights = [ Se_Stormy, Se_Foggy, Se_Windy, Se_Misty, Se_SunFog, Se_Sunny, Se_FStorm ];
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
            if(random < cumulativeWeight) {
                // Return the index of the first weather where the random number is less than the cumulative weight
                return i;
            }
        }
        throw new Error("Failed to select a weather based on weightings.")
    }
}

module.exports = { mod: new TarkovWeatherSystem() };
