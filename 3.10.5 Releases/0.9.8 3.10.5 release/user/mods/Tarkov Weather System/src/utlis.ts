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
	defaultWeather, 
	mistyDefault, 
	stormyDefault, 
	foggyDefault, 
	foggySunnyDefault,
	sunnyDefault,
	windyDefault, 
	foggyStormDefault 
} from "./weathertypes";
import { seasonMap, seasonDates } from "./seasons";
import { weatherMap, winterWeatherMap } from "./weathertypes";
import * as path from "path";
import * as fs from "fs";

// Path to the save databases
export const weatherPath = path.resolve(path.dirname(__filename), "./db/weather.json");
export const seasonPath = path.resolve(path.dirname(__filename), "./db/season.json");

// For whatever reason this not being here breaks the mod, just go with it
export const weather;

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
export let isWinter = dbSeason.iswinter;
export let savedSeason = dbSeason.season;
export let seasonText = dbSeason.seasontext
export let savedTime = dbSeason.seasonleft;
export let savedDate = dbSeason.seasonstart;

// Used to clamp the bottom of time left on weather to 0
let weatherLowerClamp = 0;

export const WeatherValues;
export const SeasonValues;

// Default weather weights if the user set negative numbers
export const Default_Stormy = 20;
export const Default_Foggy = 20;
export const Default_Windy = 20;
export const Default_Misty = 20;
export const Default_SunFog = 20;
export const Default_Sunny = 20;
export const Default_FStorm = 20;

// Used to force a season change with chatbot
export const forceSeasonEnd = false;
export const forceSeasonType;

// Used to force a weather change with chatbot
export const forceWeatherEnd = false;
export const forceWeatherType;
export const forceWeatherText;

// Variables for error checking min/max weather numbers
export let weatherDurationBool = false;
let minWeatherNumber = minWeatherDuration;
let maxWeatherNumber = maxWeatherDuration;

// Variables for use when first starting the server
export const serverStarted = false;
let minForcedWeather = minWeatherDuration / 2;
let maxForcedWeather = maxWeatherDuration / 2;

// Some error checking for weather duration numbers
if(maxWeatherDuration <= minWeatherDuration){
	weatherDurationBool = true;
	//console.log("minWeatherDuration out of bounds with maxWeatherDuration, setting to 30 and 120.")
	minWeatherNumber = 30;
	maxWeatherNumber = 120;
	minForcedWeather = 15;
	maxForcedWeather = 60;
} else if(maxWeatherDuration < 0 || minWeatherDuration < 0){
	weatherDurationBool = true;
	//console.log("minWeatherDuration or maxWeatherDuration detected negative numbers, setting to 30 and 120.")
	minWeatherNumber = 30;
	maxWeatherNumber = 120;
	minForcedWeather = 15;
	maxForcedWeather = 60;
}else{
	weatherDurationBool = false;
	minWeatherNumber = minWeatherDuration;
	maxWeatherNumber = maxWeatherDuration;
	minForcedWeather = minWeatherDuration / 2;
	maxForcedWeather = maxWeatherDuration / 2;
};

 

// Set season
export const setSeason = (SeasonValues: IWeatherConfig) => {

	const currentSeason = seasonMap[SeasonValues.overrideSeason];
	const forcedSeason = forceSeasonType;
	
	switch (enableSeasons) {
		// Forces a change of season, luckily this works
		case forceSeasonEnd:
             SeasonValues["last"] = Date.now();
			 SeasonValues.overrideSeason = forcedSeason;
			 seasonText = seasonMap[SeasonValues.overrideSeason];
                  
             consoleMessages &&
				console.log(
                "[TWS] The season has changed! It is now:",
                seasonMap[SeasonValues.overrideSeason]
                );
                break;
		
		case (foreverSummer)
			 savedTime = 2000;
             SeasonValues["last"] = Date.now();
			 SeasonValues.overrideSeason = 0;
			 seasonText = seasonMap[SeasonValues.overrideSeason];
			 isWinter = false;

                  
             consoleMessages &&
				console.log(
                "[TWS]  Bask in the glow of an endless summer."
                );
                break;
				
		case (endlessWinter)
			 savedTime = 2000;
             SeasonValues["last"] = Date.now();
			 SeasonValues.overrideSeason = 2;
			 seasonText = seasonMap[SeasonValues.overrideSeason];
			 isWinter = true;

                  
             consoleMessages &&
				console.log(
                "[TWS]  Freeze in an endless winter."
                );
                break;
	
		case Date.now() - SeasonValues["last"] >=
             seasonLength[currentSeason] * 60000
			 && SeasonValues.overrideSeason === 4:
             SeasonValues["last"] = Date.now();
			 SeasonValues.overrideSeason = 2;
			 seasonText = seasonMap[SeasonValues.overrideSeason];
			 isWinter = true;

                  
             consoleMessages &&
				console.log(
                "[TWS] The season has changed! It is now:",
                seasonMap[SeasonValues.overrideSeason]
                );
                break;

		case Date.now() - SeasonValues["last"] >=
             seasonLength[currentSeason] * 60000
             && SeasonValues.overrideSeason === 2:
             SeasonValues["last"] = Date.now();
		     SeasonValues.overrideSeason = 5;
			 seasonText = seasonMap[SeasonValues.overrideSeason];
			 isWinter = false;

                  
             consoleMessages &&
			    console.log(
                "[TWS] The season has changed! It is now:",
                seasonMap[SeasonValues.overrideSeason]
                );
                break;
				  
		case Date.now() - SeasonValues["last"] >=
             seasonLength[currentSeason] * 60000
             && SeasonValues.overrideSeason === 5:
             SeasonValues["last"] = Date.now();
		     SeasonValues.overrideSeason = 3;
			 seasonText = seasonMap[SeasonValues.overrideSeason];
			 isWinter = false;

                  
             consoleMessages &&
				console.log(
                "[TWS] The season has changed! It is now:",
                seasonMap[SeasonValues.overrideSeason]
                );
                break;
				  
		case Date.now() - SeasonValues["last"] >=
             seasonLength[currentSeason] * 60000
             && SeasonValues.overrideSeason === 3:
             SeasonValues["last"] = Date.now();
			 SeasonValues.overrideSeason = 0;
			 seasonText = seasonMap[SeasonValues.overrideSeason];
			 isWinter = false;

                  
             consoleMessages &&
				console.log(
                "[TWS] The season has changed! It is now:",
                seasonMap[SeasonValues.overrideSeason]
                );
                break;
				  
		case Date.now() - SeasonValues["last"] >=
             seasonLength[currentSeason] * 60000
             && SeasonValues.overrideSeason === 0:
             SeasonValues["last"] = Date.now();
			 SeasonValues.overrideSeason = 1;
			 seasonText = seasonMap[SeasonValues.overrideSeason];
			 isWinter = false;

                  
             consoleMessages &&
				console.log(
                "[TWS] The season has changed! It is now:",
                seasonMap[SeasonValues.overrideSeason]
                );
                break;
				  
		case Date.now() - SeasonValues["last"] >=
             seasonLength[currentSeason] * 60000
             && SeasonValues.overrideSeason === 1:
             SeasonValues["last"] = Date.now();
			 SeasonValues.overrideSeason = 4;
			 seasonText = seasonMap[SeasonValues.overrideSeason];
			 isWinter = false;

                 
             consoleMessages &&
				console.log(
                "[TWS] The season has changed! It is now:",
                seasonMap[SeasonValues.overrideSeason]
                );
                break;
				  
        default:
                 
             consoleMessages &&
				console.log(
                "[TWS] The season is still",
                seasonMap[SeasonValues.overrideSeason] + ".",
                "Time until next season:",
                savedTime = Math.round(
                (seasonLength[currentSeason] * 60000 -
                (Date.now() - SeasonValues["last"])) /
                60000),
                "Minutes."
                );
                break;
        }
			// Begin season save data
			const newSeasonData = {
				iswinter: isWinter,
				season: SeasonValues.overrideSeason,
				seasontext: seasonMap[SeasonValues.overrideSeason],
				seasonstart: SeasonValues["last"],
				seasonlength: seasonLength[currentSeason],
				seasonleft: savedTime
				}

            fs.writeFileSync(seasonPath, JSON.stringify(newSeasonData, null, 4));
			// End season save data
};

// Set weather
export const setWeather = (WeatherValues: IWeatherConfig, randomWeather: number) => {
	let currentWeather = randomWeather;
	
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
				consoleMessages && !isWinter &&
				  console.log("[TWS] Setting" weatherMap[savedWeather]);
				  
				consoleMessages && isWinter &&
				  console.log("[TWS] Setting" winterWeatherMap[savedWeather]);
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
				consoleMessages && !isWinter &&
				  console.log("[TWS] Setting" weatherMap[savedWeather]);
				  
				consoleMessages && isWinter &&
				  console.log("[TWS] Setting" winterWeatherMap[savedWeather]);
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
				consoleMessages && !isWinter &&
				  console.log("[TWS] Setting" weatherMap[savedWeather]);
				  
				consoleMessages && isWinter &&
				  console.log("[TWS] Setting" winterWeatherMap[savedWeather]);
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
				consoleMessages && !isWinter &&
				  console.log("[TWS] Setting" weatherMap[savedWeather]);
				  
				consoleMessages && isWinter &&
				  console.log("[TWS] Setting" winterWeatherMap[savedWeather]);
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
				consoleMessages && !isWinter &&
				  console.log("[TWS] Setting" weatherMap[savedWeather]);
				  
				consoleMessages && isWinter &&
				  console.log("[TWS] Setting" winterWeatherMap[savedWeather]);
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
				consoleMessages && !isWinter &&
				  console.log("[TWS] Setting" weatherMap[savedWeather]);
				  
				consoleMessages && isWinter &&
				  console.log("[TWS] Setting" winterWeatherMap[savedWeather]);
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
				consoleMessages && !isWinter &&
				  console.log("[TWS] Setting" weatherMap[savedWeather]);
				  
				consoleMessages && isWinter &&
				  console.log("[TWS] Setting" winterWeatherMap[savedWeather]);
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
				savedWeatherTime = clamp(tempWeatherTime, weatherLowerClamp, maxWeatherNumber));
				
				if(isWinter === false) {
					savedWeatherName = weatherMap[savedWeather];
				} else if(isWinter === true) {
					savedWeatherName = winterWeatherMap[savedWeather];
				}
		
				consoleMessages && !isWinter &&
					console.log(
					"[TWS] Current weather is still", 
					weatherMap[savedWeather] + "."
					"Time until next weather front:",
					savedWeatherTime, "Minutes."
					);
					
				consoleMessages && isWinter &&
					console.log(
					"[TWS] Current weather is still", 
					winterWeatherMap[savedWeather] + "."
					"Time until next weather front:",
					savedWeatherTime, "Minutes."
					);
				break;
		}
			// Begin weather save data
			const newWeatherData = {
				savedcurrentweather: savedWeather,
				savedweathername: savedWeatherName
				savedweathertext: savedWeatherText,
				weatherstart: weatherStartDate,
				weatherlength: weatherDuration,
				weatherleft: savedWeatherTime
				}

			fs.writeFileSync(weatherPath, JSON.stringify(newWeatherData, null, 4));
			// End weather save data
};

// Forces weather because I couldn't hook in to the setWeather very easily
export const forceWeather = (WeatherValues: IWeatherConfig, forcedWeather: number) => {
	let currentWeather = forcedWeather;
	
	switch (enableWeather) {
		
		case 	forceWeatherEnd 
				&& currentWeather == 0:
				
				if(serverStarted){
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

				if(isWinter === false) {
					savedWeatherName = weatherMap[savedWeather];
				} else if(isWinter === true) {
					savedWeatherName = winterWeatherMap[savedWeather];
				}
				
				consoleMessages && !isWinter &&
				  console.log("[TWS] Setting" weatherMap[savedWeather]);
				  
				consoleMessages && isWinter &&
				  console.log("[TWS] Setting" winterWeatherMap[savedWeather]);
				break;
	  
		case 	forceWeatherEnd 
				&& currentWeather == 1:
				
				if(serverStarted){
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

				if(isWinter === false) {
					savedWeatherName = weatherMap[savedWeather];
				} else if(isWinter === true) {
					savedWeatherName = winterWeatherMap[savedWeather];
				}
				
				consoleMessages && !isWinter &&
				  console.log("[TWS] Setting" weatherMap[savedWeather]);
				  
				consoleMessages && isWinter &&
				  console.log("[TWS] Setting" winterWeatherMap[savedWeather]);
				break;
	  
		case	forceWeatherEnd 
				&& currentWeather == 2:
				
				if(serverStarted){
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
				
				if(isWinter === false) {
					savedWeatherName = weatherMap[savedWeather];
				} else if(isWinter === true) {
					savedWeatherName = winterWeatherMap[savedWeather];
				}
				
				consoleMessages && !isWinter &&
				  console.log("[TWS] Setting" weatherMap[savedWeather]);
				  
				consoleMessages && isWinter &&
				  console.log("[TWS] Setting" winterWeatherMap[savedWeather]);
				break;
	  
		case 	forceWeatherEnd 
				&& currentWeather == 3:
				
				if(serverStarted){
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
				
				if(isWinter === false) {
					savedWeatherName = weatherMap[savedWeather];
				} else if(isWinter === true) {
					savedWeatherName = winterWeatherMap[savedWeather];
				}
				
				consoleMessages && !isWinter &&
				  console.log("[TWS] Setting" weatherMap[savedWeather]);
				  
				consoleMessages && isWinter &&
				  console.log("[TWS] Setting" winterWeatherMap[savedWeather]);
				break;
	  
		case 	forceWeatherEnd 
				&& currentWeather == 4:
				
				if(serverStarted){
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
				
				if(isWinter === false) {
					savedWeatherName = weatherMap[savedWeather];
				} else if(isWinter === true) {
					savedWeatherName = winterWeatherMap[savedWeather];
				}
				
				consoleMessages && !isWinter &&
				  console.log("[TWS] Setting" weatherMap[savedWeather]);
				  
				consoleMessages && isWinter &&
				  console.log("[TWS] Setting" winterWeatherMap[savedWeather]);
				break;
		
		case 	forceWeatherEnd 
				&& currentWeather == 5:
				
				if(serverStarted){
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
				
				if(isWinter === false) {
					savedWeatherName = weatherMap[savedWeather];
				} else if(isWinter === true) {
					savedWeatherName = winterWeatherMap[savedWeather];
				}
				
				consoleMessages && !isWinter &&
				  console.log("[TWS] Setting" weatherMap[savedWeather]);
				  
				consoleMessages && isWinter &&
				  console.log("[TWS] Setting" winterWeatherMap[savedWeather]);
				break;
		
		case 	forceWeatherEnd 
				&& currentWeather == 6:
				
				if(serverStarted){
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
				
				if(isWinter === false) {
					savedWeatherName = weatherMap[savedWeather];
				} else if(isWinter === true) {
					savedWeatherName = winterWeatherMap[savedWeather];
				}
				
				consoleMessages && !isWinter &&
				  console.log("[TWS] Setting" weatherMap[savedWeather]);
				  
				consoleMessages && isWinter &&
				  console.log("[TWS] Setting" winterWeatherMap[savedWeather]);
				break;
	  
		default:
				let tempWeatherTime = Math.round(
					(weatherDuration * 60000 -
					(Date.now() - weatherStartDate)) /
					60000);
			
				// Attempt to prevent weather from going crazy negative and breaking weather
				savedWeatherTime = clamp(tempWeatherTime, weatherLowerClamp, maxWeatherNumber));
				
				if(isWinter === false) {
					savedWeatherName = weatherMap[savedWeather];
				} else if(isWinter === true) {
					savedWeatherName = winterWeatherMap[savedWeather];
				}
		
				consoleMessages && !isWinter &&
					console.log(
					"[TWS] Current weather is still", 
					weatherMap[savedWeather] + "."
					"Time until next weather front:",
					savedWeatherTime, "Minutes."
					);
					
				consoleMessages && isWinter &&
					console.log(
					"[TWS] Current weather is still", 
					winterWeatherMap[savedWeather] + "."
					"Time until next weather front:",
					savedWeatherTime, "Minutes."
					);
				break;
		}
			// Begin weather save data
			const newWeatherData = {
				savedcurrentweather: savedWeather,
				savedweathername: savedWeatherName
				savedweathertext: savedWeatherText,
				weatherstart: weatherStartDate,
				weatherlength: weatherDuration,
				weatherleft: savedWeatherTime
				}

			fs.writeFileSync(weatherPath, JSON.stringify(newWeatherData, null, 4));
			// End weather save data
};

// Read JSON files
private function readJsonFile(filePath: string) {
	try {
		return JSON.parse(fs.readFileSync(filePath, "utf-8"));
	} catch (error: any) {
		console.error(`Error reading or parsing JSON file: ${error.message}`);
		throw error; // Re-throw the error to propagate it to the caller
	}
};

// Get a random number
private function getRandomWeatherDuration(min: number, max: number): number {
	max = Math.ceil(max);
	min = Math.floor(min);
	
	return Math.floor(Math.random() * (max - min + 1)) + min;
};

// THE CLAMP!!!!!
private function clamp(num: number, min: number, max: number): number{
	return Math.min(Math.max(num, min), max);
};
