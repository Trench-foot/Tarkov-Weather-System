/* eslint-disable @typescript-eslint/indent */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/quotes */
/* eslint-disable no-mixed-spaces-and-tabs */
// Attempt at moving weatherservice response text from the functions
//import { enable, enableSeasons, enableWeather } from ".../config/config.json";
import { 
  SeasonValues, 
  savedWeather, 
  savedSeason, 
  seasonText
  } from "../utlis";
import { weatherMap, winterWeatherMap } from "../weathertypes";

export const testText = `This is Bolt Lightning with a list of commands!  Your number one weather man in Tarkov.\n` +
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

// eslint-disable-next-line @typescript-eslint/quotes
export const winterForecast = `This is Bolt Lightning!  Your number one weather man in Tarkov.\n` +
							  // eslint-disable-next-line no-mixed-spaces-and-tabs
							  `Current season is: ${seasonText}\n` +
							  `Current weather is: ${winterWeatherMap[savedWeather]}`;

export const notWinterForecast = `This is Bolt Lightning!  Your number one weather man in Tarkov.\n` +
								 `Current season is: ${seasonText}\n` +
								 `Current weather is: \n${weatherMap[savedWeather]}`;