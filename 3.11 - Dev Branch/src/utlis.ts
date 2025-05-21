/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/comma-dangle */
/* eslint-disable no-case-declarations */
/* eslint-disable no-extra-semi */
/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/keyword-spacing */
/* eslint-disable @typescript-eslint/brace-style */
/* eslint-disable @typescript-eslint/indent */
import { Season } from "@spt/models/enums/Season";
import {
	enable,
	enableSeasons,
	enableWeather,
	foreverSummer,
	endlessWinter,
	seasonLength,
	resetWeather,
	consoleMessages,
	minWeatherDuration,
	maxWeatherDuration,
	enableChatbot,
} from "../config/config.json";
import { IWeatherConfig } from "@spt/models/spt/config/IWeatherConfig";
import { 
	weatherMap, 
	winterWeatherMap,
	defaultWeather, 
	mistyDefault, 
	stormyDefault, 
	foggyDefault, 
	foggySunnyDefault,
	sunnyDefault,
	windyDefault, 
	foggyStormDefault 
} from "./weathertypes";
import { seasonMap, seasonNameMap, seasonDates } from "./seasons";
import * as path from "path";
import * as fs from "fs";

class ExportVariables {
	public isWinter;
	public forceWeatherEnd;
	public forceWeatherType;
	public forceWeatherText;
	public serverStarted;
	public forceSeasonEnd;
	public forceSeasonType;

	constructor(isWinter: any, 
				forceWeatherEnd: boolean, 
				forceWeatherType: number, 
				forceWeatherText: string,
				serverStarted: boolean,
				forceSeasonEnd: boolean,
				forceSeasonType: number)
	{
		this.isWinter = isWinter;
		this.forceWeatherEnd = forceWeatherEnd;
		this.forceWeatherType = forceWeatherType;
		this.forceWeatherText = forceWeatherText;
		this.serverStarted = serverStarted;
		this.forceSeasonEnd = forceSeasonEnd;
		this.forceSeasonType = forceSeasonType;
	}
}

export const exportVariables = new ExportVariables(false, false, 0, "...Default_FStorm", false, false, 0);

// Path to the save databases
export const weatherPath = path.resolve(path.dirname(__filename), "./db/weather.json");
export const seasonPath = path.resolve(path.dirname(__filename), "./db/season.json");

// For whatever reason this not being here breaks the mod, just go with it
export let weather;
export let testedSeason;

// Get system Date
const currentDate = new Date();
const month = currentDate.getMonth() + 1; // getMonth() returns 0-11, so add 1

// Set season based on system date for people who don't use the season setting
export const defaultSeason = getSeasonBasedOnDate();

// To send some config settings to the chatbot, I couldn't figure out how to have
// the chatbot pull from the config itself
export const seasonsEnabled = enableSeasons;
export const weatherEnabled = enableWeather;
export const chatbotEnabled = enableChatbot;

// Reading the weather database file
const dbWeather = readJsonFile(weatherPath);
export let savedWeather = dbWeather.savedcurrentweather;
export let savedWeatherText = dbWeather.savedweathertext;
export let weatherStartDate = dbWeather.weatherstart;
export let weatherDuration = dbWeather.weatherlength;
export let savedWeatherTime = dbWeather.weatherleft;
export let savedWeatherName = dbWeather.savedweathername;

// Reading the seasons database file
const dbSeason = readJsonFile(seasonPath);
exportVariables.isWinter = dbSeason.iswinter;
export let savedSeason = dbSeason.season;
export let seasonText = dbSeason.seasontext
export let savedTime = dbSeason.seasonleft;
export let savedDate = dbSeason.seasonstart;

// Used to clamp the bottom of time left on weather to 0
const weatherLowerClamp = 0;

export let WeatherValues;
export let SeasonValues;

// Default weather weights if the user set negative numbers
export const Default_Stormy = 20;
export const Default_Foggy = 20;
export const Default_Windy = 20;
export const Default_Misty = 20;
export const Default_SunFog = 20;
export const Default_Sunny = 20;
export const Default_FStorm = 20;

// Used to force a season change with chatbot
exportVariables.forceSeasonEnd;
exportVariables.forceSeasonType;

// Used to force a weather change with chatbot
exportVariables.forceWeatherEnd;
exportVariables.forceWeatherType;
exportVariables.forceWeatherText;

// Variables for error checking min/max weather numbers
export let weatherDurationBool = false;
let minWeatherNumber = minWeatherDuration;
let maxWeatherNumber = maxWeatherDuration;

// Variables for use when first starting the server
exportVariables.serverStarted;
const minForcedWeather = 0;
const maxForcedWeather = savedWeatherTime;

// Some error checking for weather duration numbers
if(maxWeatherDuration <= minWeatherDuration){
	weatherDurationBool = true;
	consoleMessages &&
	  console.log("minWeatherDuration out of bounds with maxWeatherDuration, setting to 30 and 120.")
	minWeatherNumber = 30;
	maxWeatherNumber = 120;
} else if(maxWeatherDuration < 0 || minWeatherDuration < 0){
	weatherDurationBool = true;
	consoleMessages &&
	  console.log("minWeatherDuration or maxWeatherDuration detected negative numbers, setting to 30 and 120.")
	minWeatherNumber = 30;
	maxWeatherNumber = 120;
}else{
	weatherDurationBool = false;
	minWeatherNumber = minWeatherDuration;
	maxWeatherNumber = maxWeatherDuration;
};
// Set season
export const setSeason = (SeasonValues: IWeatherConfig, testedSeason: number): void => {

	const currentSeason = seasonMap[SeasonValues.overrideSeason];
	const forcedSeason = exportVariables.forceSeasonType;
	const testSeason = testedSeason;
	switch (enableSeasons) {
		// Forces a change of season, luckily this works
		case exportVariables.forceSeasonEnd:
             SeasonValues["last"] = Date.now();
			 SeasonValues.overrideSeason = forcedSeason;
			 seasonText = seasonNameMap[SeasonValues.overrideSeason];
			 savedTime = seasonLength[currentSeason];
                  
             consoleMessages &&
				console.log(
                "[TWS] The season was forced to changed! It is now:",
                seasonNameMap[SeasonValues.overrideSeason]
                );
                break;
		
		case (foreverSummer):
			 savedTime = 2000;
             SeasonValues["last"] = Date.now();
			 SeasonValues.overrideSeason = 0;
			 seasonText = seasonNameMap[SeasonValues.overrideSeason];
			 exportVariables.isWinter = false;

                  
             consoleMessages &&
				console.log(
                "[TWS]  Bask in the glow of an endless summer."
                );
                break;
				
		case (endlessWinter):
			 savedTime = 2000;
             SeasonValues["last"] = Date.now();
			 SeasonValues.overrideSeason = 2;
			 seasonText = seasonNameMap[SeasonValues.overrideSeason];
			 exportVariables.isWinter = true;

                  
             consoleMessages &&
				console.log(
                "[TWS]  Freeze in an endless winter."
                );
                break;
	
		case savedTime == weatherLowerClamp
			 && 4 === testSeason:
             SeasonValues["last"] = Date.now();
			 SeasonValues.overrideSeason = 2;
			 seasonText = seasonNameMap[SeasonValues.overrideSeason];
			 savedTime = seasonLength[currentSeason];
			 exportVariables.isWinter = true;

                  
             consoleMessages &&
				console.log(
                "[TWS] The season has changed! It is now:",
                seasonNameMap[SeasonValues.overrideSeason]
                );
                break;

		case savedTime == weatherLowerClamp
			 && 2 === testSeason:
             SeasonValues["last"] = Date.now();
		     SeasonValues.overrideSeason = 5;
			 seasonText = seasonNameMap[SeasonValues.overrideSeason];
			 savedTime = seasonLength[currentSeason];				
			 exportVariables.isWinter = false;

                  
             consoleMessages &&
			    console.log(
                "[TWS] The season has changed! It is now:",
                seasonNameMap[SeasonValues.overrideSeason]
                );
                break;
				  
		case savedTime == weatherLowerClamp
			 && 5 === testSeason:
             SeasonValues["last"] = Date.now();
		     SeasonValues.overrideSeason = 3;
			 seasonText = seasonNameMap[SeasonValues.overrideSeason];
			 savedTime = seasonLength[currentSeason];
			 exportVariables.isWinter = false;

                  
             consoleMessages &&
				console.log(
                "[TWS] The season has changed! It is now:",
                seasonNameMap[SeasonValues.overrideSeason]
                );
                break;
				  
		case savedTime == weatherLowerClamp
			 && 3 === testSeason:
             SeasonValues["last"] = Date.now();
			 SeasonValues.overrideSeason = 0;
			 seasonText = seasonNameMap[SeasonValues.overrideSeason];
			 savedTime = seasonLength[currentSeason];
			 exportVariables.isWinter = false;

                  
             consoleMessages &&
				console.log(
                "[TWS] The season has changed! It is now:",
                seasonNameMap[SeasonValues.overrideSeason]
                );
                break;
				  
		case savedTime == weatherLowerClamp
			 && 0 === testSeason:
             SeasonValues["last"] = Date.now();
			 SeasonValues.overrideSeason = 1;
			 seasonText = seasonNameMap[SeasonValues.overrideSeason];
			 savedTime = seasonLength[currentSeason];						
			 exportVariables.isWinter = false;

                  
             consoleMessages &&
				console.log(
                "[TWS] The season has changed! It is now:",
                seasonNameMap[SeasonValues.overrideSeason]
                );
                break;
				  
		case savedTime == weatherLowerClamp
			 && 1 === testSeason:
             SeasonValues["last"] = Date.now();
			 SeasonValues.overrideSeason = 4;
			 seasonText = seasonNameMap[SeasonValues.overrideSeason];
			 savedTime = seasonLength[currentSeason];					
			 exportVariables.isWinter = false;

                 
             consoleMessages &&
				console.log(
                "[TWS] The season has changed! It is now:",
                seasonNameMap[SeasonValues.overrideSeason]
                );
                break;
				  
        default:
                 const tempSeasonTime = Math.round(
					(seasonLength[currentSeason] * 60000 -
					(Date.now() - SeasonValues["last"])) /
					60000);
			
				// Attempt to prevent weather from going crazy negative and breaking weather
				savedTime = clamp(tempSeasonTime, weatherLowerClamp, seasonLength[currentSeason]);
             consoleMessages &&
				console.log(
                "[TWS] The season is still",
                seasonNameMap[SeasonValues.overrideSeason] + ".",
                "Time until next season:",
                savedTime, "Minutes."
                );
                break;
        }
			// Begin season save data
			const newSeasonData = {
				iswinter: exportVariables.isWinter,
				season: SeasonValues.overrideSeason,
				seasontext: seasonNameMap[SeasonValues.overrideSeason],
				seasonstart: SeasonValues["last"],
				seasonlength: seasonLength[currentSeason],
				seasonleft: savedTime
				}

            fs.writeFileSync(seasonPath, JSON.stringify(newSeasonData, null, 4));
			// End season save data
};

// Set weather
export const setWeather = (WeatherValues: IWeatherConfig, randomWeather: number): void => {
	const currentWeather = randomWeather;
	
	switch (enableWeather) {
		
		case 	savedWeatherTime == weatherLowerClamp
				&& currentWeather == 0:
				weatherDuration = getRandomWeatherDuration(minWeatherNumber, maxWeatherNumber);
				savedWeatherTime = weatherDuration;
				weatherStartDate = Date.now();	
				savedWeather = currentWeather;		
				savedWeatherText =  "...stormyDefault";
				WeatherValues.weather = {
				...WeatherValues.weather,
				...stormyDefault,
				};		
				consoleMessages && !exportVariables.isWinter &&
				  console.log("[TWS] Setting", weatherMap[savedWeather]);
				  
				consoleMessages && exportVariables.isWinter &&
				  console.log("[TWS] Setting", winterWeatherMap[savedWeather]);
				break;
	  
		case 	savedWeatherTime == weatherLowerClamp
				&& currentWeather == 1:
				weatherDuration = getRandomWeatherDuration(minWeatherNumber, maxWeatherNumber);
				savedWeatherTime = weatherDuration;
				weatherStartDate = Date.now();	
				savedWeather = currentWeather;
				savedWeatherText =  "...foggyDefault";
				WeatherValues.weather = {
				...WeatherValues.weather,
				...foggyDefault,
				};				
				consoleMessages && !exportVariables.isWinter &&
				  console.log("[TWS] Setting", weatherMap[savedWeather]);
				  
				consoleMessages && exportVariables.isWinter &&
				  console.log("[TWS] Setting", winterWeatherMap[savedWeather]);
				break;
	  
		case	savedWeatherTime == weatherLowerClamp
				&& currentWeather == 2:
				weatherDuration = getRandomWeatherDuration(minWeatherNumber, maxWeatherNumber);
				savedWeatherTime = weatherDuration;
				weatherStartDate = Date.now();	
				savedWeather = currentWeather;
				savedWeatherText =  "...windyDefault";
				WeatherValues.weather = {
				...WeatherValues.weather,
				...windyDefault,
				};
				consoleMessages && !exportVariables.isWinter &&
				  console.log("[TWS] Setting", weatherMap[savedWeather]);
				  
				consoleMessages && exportVariables.isWinter &&
				  console.log("[TWS] Setting", winterWeatherMap[savedWeather]);
				break;
	  
		case 	savedWeatherTime == weatherLowerClamp
				&& currentWeather == 3:
				weatherDuration = getRandomWeatherDuration(minWeatherNumber, maxWeatherNumber);
				savedWeatherTime = weatherDuration;
				weatherStartDate = Date.now();
				savedWeather = currentWeather;
				savedWeatherText =  "...mistyDefault";
				WeatherValues.weather = {
				...WeatherValues.weather,
				...mistyDefault,
				};
				consoleMessages && !exportVariables.isWinter &&
				  console.log("[TWS] Setting", weatherMap[savedWeather]);
				  
				consoleMessages && exportVariables.isWinter &&
				  console.log("[TWS] Setting", winterWeatherMap[savedWeather]);
				break;
	  
		case 	savedWeatherTime == weatherLowerClamp
				&& currentWeather == 4:
				weatherDuration = getRandomWeatherDuration(minWeatherNumber, maxWeatherNumber);
				savedWeatherTime = weatherDuration;
				weatherStartDate = Date.now();
				savedWeather = currentWeather;
				savedWeatherText =  "...foggySunnyDefault";
				WeatherValues.weather = {
				...WeatherValues.weather,
				...foggySunnyDefault,
				};
				consoleMessages && !exportVariables.isWinter &&
				  console.log("[TWS] Setting", weatherMap[savedWeather]);
				  
				consoleMessages && exportVariables.isWinter &&
				  console.log("[TWS] Setting", winterWeatherMap[savedWeather]);
				break;
		
		case 	savedWeatherTime == weatherLowerClamp
				&& currentWeather == 5:
				weatherDuration = getRandomWeatherDuration(minWeatherNumber, maxWeatherNumber);
				savedWeatherTime = weatherDuration;
				weatherStartDate = Date.now();
				savedWeather = currentWeather;
				savedWeatherText =  "...sunnyDefault";
				WeatherValues.weather = {
				...WeatherValues.weather,
				...sunnyDefault,
				};
				consoleMessages && !exportVariables.isWinter &&
				  console.log("[TWS] Setting", weatherMap[savedWeather]);
				  
				consoleMessages && exportVariables.isWinter &&
				  console.log("[TWS] Setting", winterWeatherMap[savedWeather]);
				break;
		
		case 	savedWeatherTime == weatherLowerClamp
				&& currentWeather == 6:
				weatherDuration = getRandomWeatherDuration(minWeatherNumber, maxWeatherNumber);
				savedWeatherTime = weatherDuration;
				weatherStartDate = Date.now();
				savedWeather = currentWeather;
				savedWeatherText =  "...foggyStormDefault";
				WeatherValues.weather = {
				...WeatherValues.weather,
				...foggyStormDefault,
				};
				consoleMessages && !exportVariables.isWinter &&
				  console.log("[TWS] Setting", weatherMap[savedWeather]);
				  
				consoleMessages && exportVariables.isWinter &&
				  console.log("[TWS] Setting", winterWeatherMap[savedWeather]);
				break;
	  
		case 	resetWeather:
				weatherDuration = getRandomWeatherDuration(minWeatherNumber, maxWeatherNumber);
				savedWeatherTime = weatherDuration;
				weatherStartDate = Date.now();
				savedWeather = currentWeather;
				savedWeatherText =  "...defaultWeather";
				WeatherValues.weather = {
				...WeatherValues.weather,
				...defaultWeather,
				};
				consoleMessages &&
				  console.log("[TWS] Setting test weather");
				break;
	  
		default:
				let tempWeatherTime = Math.round(
					(weatherDuration * 60000 -
					(Date.now() - weatherStartDate)) /
					60000);
			
				// Attempt to prevent weather from going crazy negative and breaking weather
				savedWeatherTime = clamp(tempWeatherTime, weatherLowerClamp, maxWeatherNumber);
				
				if(exportVariables.isWinter === false) {
					savedWeatherName = weatherMap[savedWeather];
				} else if(exportVariables.isWinter === true) {
					savedWeatherName = winterWeatherMap[savedWeather];
				}
		
				consoleMessages && !exportVariables.isWinter &&
					console.log(
					"[TWS] Current weather is still", 
					weatherMap[savedWeather] + ".",
					"Time until next weather front:",
					savedWeatherTime, "Minutes."
					);
					
				consoleMessages && exportVariables.isWinter &&
					console.log(
					"[TWS] Current weather is still", 
					winterWeatherMap[savedWeather] + ".",
					"Time until next weather front:",
					savedWeatherTime, "Minutes."
					);
				break;
		}
			// Begin weather save data
			const newWeatherData = {
				savedcurrentweather: savedWeather,
				savedweathername: savedWeatherName,
				savedweathertext: savedWeatherText,
				weatherstart: weatherStartDate,
				weatherlength: weatherDuration,
				weatherleft: savedWeatherTime
				}

			fs.writeFileSync(weatherPath, JSON.stringify(newWeatherData, null, 4));
			// End weather save data
};

// Forces weather because I couldn't hook in to the setWeather very easily
export const forceWeather = (WeatherValues: IWeatherConfig, forcedWeather: number): void => {
	const currentWeather = forcedWeather;
	
	switch (enableWeather) {
		
		case 	exportVariables.forceWeatherEnd 
				&& currentWeather == 0:
				
				if(exportVariables.serverStarted){
					weatherDuration = getRandomWeatherDuration(minForcedWeather, maxForcedWeather);
				} else {
					weatherDuration = getRandomWeatherDuration(minWeatherNumber, maxWeatherNumber);
				}
				
				savedWeatherTime = weatherDuration;
				weatherStartDate = Date.now();	
				savedWeather = currentWeather;		
				savedWeatherText =  "...stormyDefault";
				WeatherValues.weather = {
				...WeatherValues.weather,
				...stormyDefault,
				};
				
				
				
				if(exportVariables.isWinter === false) {
					savedWeatherName = weatherMap[savedWeather];
				} else if(exportVariables.isWinter === true) {
					savedWeatherName = winterWeatherMap[savedWeather];
				}
				
				consoleMessages && !exportVariables.isWinter &&
				  console.log("[TWS] Setting", weatherMap[savedWeather]);
				  
				consoleMessages && exportVariables.isWinter &&
				  console.log("[TWS] Setting", winterWeatherMap[savedWeather]);
				break;
	  
		case 	exportVariables.forceWeatherEnd 
				&& currentWeather == 1:
				
				if(exportVariables.serverStarted){
					weatherDuration = getRandomWeatherDuration(minForcedWeather, maxForcedWeather);
				} else {
					weatherDuration = getRandomWeatherDuration(minWeatherNumber, maxWeatherNumber);
				}
				
				savedWeatherTime = weatherDuration;
				weatherStartDate = Date.now();	
				savedWeather = currentWeather;
				savedWeatherText =  "...foggyDefault";
				WeatherValues.weather = {
				...WeatherValues.weather,
				...foggyDefault,
				};

				if(exportVariables.isWinter === false) {
					savedWeatherName = weatherMap[savedWeather];
				} else if(exportVariables.isWinter === true) {
					savedWeatherName = winterWeatherMap[savedWeather];
				}
				
				consoleMessages && !exportVariables.isWinter &&
				  console.log("[TWS] Setting", weatherMap[savedWeather]);
				  
				consoleMessages && exportVariables.isWinter &&
				  console.log("[TWS] Setting", winterWeatherMap[savedWeather]);
				break;
	  
		case	exportVariables.forceWeatherEnd 
				&& currentWeather == 2:
				
				if(exportVariables.serverStarted){
					weatherDuration = getRandomWeatherDuration(minForcedWeather, maxForcedWeather);
				} else {
					weatherDuration = getRandomWeatherDuration(minWeatherNumber, maxWeatherNumber);
				}
				
				savedWeatherTime = weatherDuration;
				weatherStartDate = Date.now();	
				savedWeather = currentWeather;
				savedWeatherText =  "...windyDefault";
				WeatherValues.weather = {
				...WeatherValues.weather,
				...windyDefault,
				};
				
				if(exportVariables.isWinter === false) {
					savedWeatherName = weatherMap[savedWeather];
				} else if(exportVariables.isWinter === true) {
					savedWeatherName = winterWeatherMap[savedWeather];
				}
				
				consoleMessages && !exportVariables.isWinter &&
				  console.log("[TWS] Setting", weatherMap[savedWeather]);
				  
				consoleMessages && exportVariables.isWinter &&
				  console.log("[TWS] Setting", winterWeatherMap[savedWeather]);
				break;
	  
		case 	exportVariables.forceWeatherEnd 
				&& currentWeather == 3:
				
				if(exportVariables.serverStarted){
					weatherDuration = getRandomWeatherDuration(minForcedWeather, maxForcedWeather);
				} else {
					weatherDuration = getRandomWeatherDuration(minWeatherNumber, maxWeatherNumber);
				}
				
				savedWeatherTime = weatherDuration;
				weatherStartDate = Date.now();
				savedWeather = currentWeather;
				savedWeatherText =  "...mistyDefault";
				WeatherValues.weather = {
				...WeatherValues.weather,
				...mistyDefault,
				};
				
				if(exportVariables.isWinter === false) {
					savedWeatherName = weatherMap[savedWeather];
				} else if(exportVariables.isWinter === true) {
					savedWeatherName = winterWeatherMap[savedWeather];
				}
				
				consoleMessages && !exportVariables.isWinter &&
				  console.log("[TWS] Setting", weatherMap[savedWeather]);
				  
				consoleMessages && exportVariables.isWinter &&
				  console.log("[TWS] Setting", winterWeatherMap[savedWeather]);
				break;
	  
		case 	exportVariables.forceWeatherEnd 
				&& currentWeather == 4:
				
				if(exportVariables.serverStarted){
					weatherDuration = getRandomWeatherDuration(minForcedWeather, maxForcedWeather);
				} else {
					weatherDuration = getRandomWeatherDuration(minWeatherNumber, maxWeatherNumber);
				}
				
				savedWeatherTime = weatherDuration;
				weatherStartDate = Date.now();
				savedWeather = currentWeather;
				savedWeatherText =  "...foggySunnyDefault";
				WeatherValues.weather = {
				...WeatherValues.weather,
				...foggySunnyDefault,
				};
				
				if(exportVariables.isWinter === false) {
					savedWeatherName = weatherMap[savedWeather];
				} else if(exportVariables.isWinter === true) {
					savedWeatherName = winterWeatherMap[savedWeather];
				}
				
				consoleMessages && !exportVariables.isWinter &&
				  console.log("[TWS] Setting", weatherMap[savedWeather]);
				  
				consoleMessages && exportVariables.isWinter &&
				  console.log("[TWS] Setting", winterWeatherMap[savedWeather]);
				break;
		
		case 	exportVariables.forceWeatherEnd 
				&& currentWeather == 5:
				
				if(exportVariables.serverStarted){
					weatherDuration = getRandomWeatherDuration(minForcedWeather, maxForcedWeather);
				} else {
					weatherDuration = getRandomWeatherDuration(minWeatherNumber, maxWeatherNumber);
				}
				
				savedWeatherTime = weatherDuration;
				weatherStartDate = Date.now();
				savedWeather = currentWeather;
				savedWeatherText =  "...sunnyDefault";
				WeatherValues.weather = {
				...WeatherValues.weather,
				...sunnyDefault,
				};
				
				if(exportVariables.isWinter === false) {
					savedWeatherName = weatherMap[savedWeather];
				} else if(exportVariables.isWinter === true) {
					savedWeatherName = winterWeatherMap[savedWeather];
				}
				
				consoleMessages && !exportVariables.isWinter &&
				  console.log("[TWS] Setting", weatherMap[savedWeather]);
				  
				consoleMessages && exportVariables.isWinter &&
				  console.log("[TWS] Setting", winterWeatherMap[savedWeather]);
				break;
		
		case 	exportVariables.forceWeatherEnd 
				&& currentWeather == 6:
				
				if(exportVariables.serverStarted){
					weatherDuration = getRandomWeatherDuration(minForcedWeather, maxForcedWeather);
				} else {
					weatherDuration = getRandomWeatherDuration(minWeatherNumber, maxWeatherNumber);
				}
				
				savedWeatherTime = weatherDuration;
				weatherStartDate = Date.now();
				savedWeather = currentWeather;
				savedWeatherText =  "...foggyStormDefault";
				WeatherValues.weather = {
				...WeatherValues.weather,
				...foggyStormDefault,
				};
				
				if(exportVariables.isWinter === false) {
					savedWeatherName = weatherMap[savedWeather];
				} else if(exportVariables.isWinter === true) {
					savedWeatherName = winterWeatherMap[savedWeather];
				}
				
				consoleMessages && !exportVariables.isWinter &&
				  console.log("[TWS] Setting", weatherMap[savedWeather]);
				  
				consoleMessages && exportVariables.isWinter &&
				  console.log("[TWS] Setting", winterWeatherMap[savedWeather]);
				break;
	  
		default:
				const tempWeatherTime = Math.round(
					(weatherDuration * 60000 -
					(Date.now() - weatherStartDate)) /
					60000);
			
				// Attempt to prevent weather from going crazy negative and breaking weather
				savedWeatherTime = clamp(tempWeatherTime, weatherLowerClamp, maxWeatherNumber);
				
				if(exportVariables.isWinter === false) {
					savedWeatherName = weatherMap[savedWeather];
				} else if(exportVariables.isWinter === true) {
					savedWeatherName = winterWeatherMap[savedWeather];
				}
		
				consoleMessages && !exportVariables.isWinter &&
					console.log(
					"[TWS] Current weather is still", 
					weatherMap[savedWeather] + ".",
					"Time until next weather front:",
					savedWeatherTime, "Minutes."
					);
					
				consoleMessages && exportVariables.isWinter &&
					console.log(
					"[TWS] Current weather is still", 
					winterWeatherMap[savedWeather] + ".",
					"Time until next weather front:",
					savedWeatherTime, "Minutes."
					);
				break;
		}
			// Begin weather save data
			const newWeatherData = {
				savedcurrentweather: savedWeather,
				savedweathername: savedWeatherName,
				savedweathertext: savedWeatherText,
				weatherstart: weatherStartDate,
				weatherlength: weatherDuration,
				weatherleft: savedWeatherTime
				}

			fs.writeFileSync(weatherPath, JSON.stringify(newWeatherData, null, 4));
			// End weather save data
};

// Shamelessly stolen from the Southern Hemisphere mod, hope they don't mind
function getSeasonBasedOnDate(): number {

    // Summer: June - August
    if (month === 6 || month === 7 || month === 8) 
	{
        return 0; // Summer
    }
    // Autumn: September - October
    else if (month === 9 || month === 10) 
	{
        return 1; // Autumn
    }
    // Late Autumn: November
    else if (month === 11) 
	{
        return 4; // Late Autumn
    }
    // Winter: December - Febuary
    else if (month === 12 || month === 1 || month === 2) 
	{
        return 2; // Winter
    }
    // Early Spring: March
    else if (month === 3) 
	{
        return 5; // Early Spring
    }
    // Spring: April - May
    else if (month === 4 || month === 5) 
	{
        return 3; // Spring
    }

    // Default to Summer if no season matches (should not happen)
    return 0;
};

// Read JSON files
function readJsonFile(filePath: string) {
	try {
		return JSON.parse(fs.readFileSync(filePath, "utf-8"));
	} catch (error: any) {
		console.error(`Error reading or parsing JSON file: ${error.message}`);
		throw error; // Re-throw the error to propagate it to the caller
	}
};

// Get a random number
function getRandomWeatherDuration(min: number, max: number): number {
	max = Math.ceil(max);
	min = Math.floor(min);
	
	return Math.floor(Math.random() * (max - min + 1)) + min;
};

// THE CLAMP!!!!!
function clamp(num: number, min: number, max: number): number{
	return Math.min(Math.max(num, min), max);
};
