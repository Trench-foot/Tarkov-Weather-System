/* eslint-disable @typescript-eslint/naming-convention */
import { DependencyContainer } from "tsyringe";
import { IPreSptLoadMod } from "@spt/models/external/IPreSptLoadMod";
import { IPostDBLoadMod } from "@spt/models/external/IPostDBLoadMod";
import { DialogueController } from "@spt/controllers/DialogueController";
import { CustomChatBot } from "./CustomChatBot";
import { ILogger } from "@spt/models/spt/utils/ILogger";
import { LogTextColor } from "@spt/models/spt/logging/LogTextColor";
import { LogBackgroundColor } from "@spt/models/spt/logging/LogBackgroundColor";
import { ConfigServer } from "@spt/servers/ConfigServer";
import { ConfigTypes } from "@spt/models/enums/ConfigTypes";
import { IWeatherConfig } from "@spt/models/spt/config/IWeatherConfig";
import { StaticRouterModService } from "@spt/services/mod/staticRouter/StaticRouterModService";
import * as fs from "fs";

// various config files
import {
	enable,
	foreverSummer,
	endlessWinter,
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

// imports from other ts files
import { 
	serverStarted,
	WeatherValues,
	SeasonValues,
	isWinter,
	savedSeason,
	savedDate,
	setSeason, 
	setWeather,
	forceWeather,
	weather,
	weatherDuration,
	savedWeatherTime,
	savedWeather,
	forceWeatherEnd,
	forceWeatherType,
	forceSeasonEnd,
	weatherDurationBool,
	Default_Stormy,
	Default_Foggy,
	Default_Windy,
	Default_Misty,
	Default_SunFog,
	Default_Sunny,
	Default_FStorm,
} from "./utlis";
import { seasonMap, seasonDates } from "./seasons";
import { weatherMap, winterWeatherMap } from "./weathertypes";
import { WeatherService } from "./chatbot/WeatherService";


class TarkovWeatherSystem implements IPreSptLoadMod, IPostDBLoadMod {
  
  // Logger instance
  private logger: ILogger;
  
  preSptLoad(container: DependencyContainer): void {
	this.logger = container.resolve<ILogger>("WinstonLogger");
	
    const configServer = container.resolve<ConfigServer>("ConfigServer");
    let WeatherValues = configServer.getConfig<IWeatherConfig>(
      ConfigTypes.WEATHER
    );
	let SeasonValues = configServer.getConfig<IWeatherConfig>(
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
	
	// Force previously saved weather at server start
	if(!forceWeatherEnd){
		serverStarted = true;
		forceWeatherEnd = true;
		forceWeather(WeatherValues, savedWeather);
	}
	
	forceWeatherEnd = false;
	serverStarted = false;
	
	if(savedSeason == 2) {
		isWinter = true;
	} else {
		isWinter = false;
	}
	
	enable && weatherDurationBool &&
	  this.logger.error(`[TWS] minWeatherDuration or maxWeatherDuration out of bounds, setting to 30 and 120.`);
	
	enable && !foreverSummer && !endlessWinter &&
	  this.logger.log(
        `[TWS] Loaded....`
		LogTextColor.YELLOW);
		
	enable && foreverSummer &&
	  this.logger.log(
        `[TWS] Oh you sweet summer child....`
		LogTextColor.YELLOW);
		
	enable && endlessWinter &&
	  this.logger.log(
        `[TWS] Brace yourself, winter is here....`
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
	  
	// Set weather and season during client/mail/msg/send callback
	// if forcing weather and season with chatbot
	enable &&
      staticRouterModService.registerStaticRouter(
        "[TWS] /client/mail/msg/send",
        [
          {
            url: "/client/mail/msg/send",
            action: async (_url, info, sessionId, output) => {
			
			if (forceWeatherEnd && enableWeather) {
				let weather = forceWeatherType;
			
				forceWeather(WeatherValues, weather);
			
				consoleMessages &&
				  console.log(weather);
				}
				
			if (forceSeasonEnd && enableSeasons) {
				setSeason(SeasonValues);
				}
				
			forceSeasonEnd = false;
				
			forceWeatherEnd = false;
			
			return output;
            },
          },
        ],
        "[TWS] /client/mail/msg/send",
      );

	// Set season and weather during /launcher/server/version callback
	// for debugging
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
  
	public postDBLoad(container: DependencyContainer): void {
		
		// We register and re-resolve the dependency so the 
		// container takes care of filling in the command dependencies
		container.register<WeatherService>("WeatherService", WeatherService);
		
		container
		  .resolve<DialogueController>("DialogueController")
		  .registerChatBot(container.resolve<WeatherService>("WeatherService"));
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
			
        // Check if any value in weatherWeights is not a number or is negative, and set a default weight if so
		if (weatherWeights.some(weight => typeof weight !== "number" || weight < 0)) {
            this.logger.error(`[TWS] Invalid season weights in config. All weights must be non-negative numbers.\n` +
							  `Default weather weights of 20 set.`);
			
			weatherWeights = [ Default_Stormy, 
							   Default_Foggy, 
							   Default_Windy, 
							   Default_Misty, 
							   Default_SunFog, 
							   Default_Sunny, 
							   Default_FStorm ];
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
