import { IWeatherValues } from "@spt/models/spt/config/IWeatherConfig";

export const weatherMap = {
  0: "Stormy",
  1: "Foggy",
  2: "Windy",
  3: "Misty",
  4: "Sunny fog",
  5: "Sunny",
  6: "Foggy Storm",
  8: "Debug",
};

export const winterWeatherMap = {
  0: "Heavy Snow",
  1: "Foggy",
  2: "Windy",
  3: "Snow Flurries",
  4: "Sunny fog",
  5: "Sunny",
  6: "Blizzard",
  8: "Debug",
};

export const defaultWeather = {
  clouds: {
    values: [-1, -0.8, -0.5, 0.1, 0, 0.15, 0.4, 1],
    weights: [80, 22, 22, 15, 15, 15, 5, 4],
  },
  windSpeed: {
    values: [0, 1, 2, 3, 4],
    weights: [6, 3, 2, 1, 1],
  },
  windDirection: {
    values: [1, 2, 3, 4, 5, 6, 7, 8],
    weights: [1, 1, 1, 1, 1, 1, 1, 1],
  },
  windGustiness: {
    min: 0,
    max: 1,
  },
  rain: {
    values: [1, 2, 3, 4, 5],
    weights: [20, 1, 1, 1, 1],
  },
  rainIntensity: {
    min: 0,
    max: 1,
  },
  fog: {
    values: [0.0013, 0.0018, 0.002, 0.004, 0.006],
    weights: [35, 6, 4, 3, 1],
  },
  pressure: {
    min: 760,
    max: 780,
  },
  timePeriod: {
    values: [15, 30],
    weights: [1, 2],
  },
} as unknown as Partial<IWeatherValues>;

export const mistyDefault = {
  ...defaultWeather,
  clouds: {
    values: [-1, -0.8, -0.5, 0.1, 0, 0.15, 0.4, 1],
    weights: [0, 0, 0, 0, 0, 5, 10, 5],
  },
  windSpeed: {
    values: [0, 1, 2, 3, 4],
    weights: [1, 8, 4, 4, 2],
  },
  windDirection: {
    values: [1, 2, 3, 4, 5, 6, 7, 8],
    weights: [1, 1, 1, 1, 1, 1, 1, 1],
  },
  windGustiness: {
    min: 0,
    max: 0.5,
  },
  rain: {
    values: [1, 2, 3, 4, 5],
    weights: [0, 15, 10, 0, 0],
  },
  rainIntensity: {
    min: 0,
    max: 1,
  },
  fog: {
    values: [0.0013, 0.0018, 0.002, 0.004, 0.006],
    weights: [5, 8, 12, 16, 8],
  },
  pressure: {
    min: 770,
    max: 780,
  },
} as unknown as Partial<IWeatherValues>;

export const stormyDefault = {
  ...defaultWeather,
  clouds: {
    values: [-1, -0.8, -0.5, 0.1, 0, 0.4, 0.8, 1],
    weights: [0, 0, 0, 0, 0, 1, 1, 1],
  },
  windSpeed: {
    values: [0, 1, 2, 3, 4],
    weights: [0, 0, 0, 1, 1],
  },
  windDirection: {
    values: [1, 2, 3, 4, 5, 6, 7, 8],
    weights: [1, 1, 1, 1, 1, 1, 1, 1],
  },
  windGustiness: {
    min: 0.8,
    max: 1,
  },
  rain: {
    values: [1, 2, 3, 4, 5],
    weights: [0, 0, 0, 1, 1],
  },
  rainIntensity: {
    min: 0.6,
    max: 1,
  },
  fog: {
    values: [0.0013, 0.0018, 0.004, 0.006, 0.008],
    weights: [0, 0, 2, 3, 2],
  },
  pressure: {
    min: 770,
    max: 780,
  },
} as unknown as Partial<IWeatherValues>;

export const foggyDefault = {
  ...defaultWeather,
  clouds: {
    values: [-1, -0.8, -0.5, 0.1, 0, 0.4, 0.8, 1],
    weights: [0, 0, 0, 0, 0, 1, 1, 1],
  },
  windSpeed: {
    values: [0, 1, 2, 3, 4],
    weights: [1, 2, 1, 0, 0],
  },
  windDirection: {
    values: [1, 2, 3, 4, 5, 6, 7, 8],
    weights: [1, 1, 1, 1, 1, 1, 1, 1],
  },
  windGustiness: {
    min: 0,
    max: 0.5,
  },
  rain: {
    values: [1, 2, 3, 4, 5],
    weights: [0, 3, 2, 1, 0],
  },
  rainIntensity: {
    min: 0.3,
    max: 1,
  },
  fog: {
    values: [0.0013, 0.0018, 0.015, 0.02, 0.025],
    weights: [0, 0, 2, 3, 2],
  },
  pressure: {
    min: 770,
    max: 780,
  },
} as unknown as Partial<IWeatherValues>;

export const foggySunnyDefault = {
  ...defaultWeather,
  clouds: {
    values: [-1, -0.8, -0.5, 0.1, 0, 0.4, 0.8, 1],
    weights: [3, 2, 2, 0, 0, 0, 0, 0],
  },
  windSpeed: {
    values: [0, 1, 2, 3, 4],
    weights: [1, 2, 1, 0, 0],
  },
  windDirection: {
    values: [1, 2, 3, 4, 5, 6, 7, 8],
    weights: [1, 1, 1, 1, 1, 1, 1, 1],
  },
  windGustiness: {
    min: 0,
    max: 0.5,
  },
  rain: {
    values: [1, 2, 3, 4, 5],
    weights: [3, 0, 0, 0, 0],
  },
  rainIntensity: {
    min: 0,
    max: 1,
  },
  fog: {
    values: [0.0013, 0.0018, 0.015, 0.02, 0.025],
    weights: [0, 0, 2, 3, 2],
  },
  pressure: {
    min: 770,
    max: 780,
  },
} as unknown as Partial<IWeatherValues>;

export const windyDefault = {
  ...defaultWeather,
  clouds: {
    values: [-1, -0.8, -0.5, 0.1, 0, 0.4, 0.8, 1],
    weights: [15, 15, 15, 15, 22, 80, 22, 22],
  },
  windSpeed: {
    values: [0, 1, 2, 3, 4],
    weights: [0, 0, 0, 1, 2],
  },
  windDirection: {
    values: [1, 2, 3, 4, 5, 6, 7, 8],
    weights: [1, 1, 1, 1, 1, 1, 1, 1],
  },
  windGustiness: {
    min: 0.9,
    max: 1,
  },
  rain: {
    values: [1, 2, 3, 4, 5],
    weights: [1, 1, 0, 0, 0],
  },
  rainIntensity: {
    min: 0,
    max: 0.2,
  },
  fog: {
    values: [0.0015, 0.002, 0.008, 0.01, 0.03],
    weights: [2, 1, 0, 0, 0],
  },
  pressure: {
    min: 770,
    max: 780,
  },
} as unknown as Partial<IWeatherValues>;

export const foggyStormDefault = {
  ...defaultWeather,
  clouds: {
    values: [-1, -0.8, -0.5, 0.1, 0, 0.4, 0.8, 1],
    weights: [0, 0, 0, 0, 0, 1, 2, 3],
  },
  windSpeed: {
    values: [0, 1, 2, 3, 4],
    weights: [0, 0, 0, 1, 2],
  },
  windDirection: {
    values: [1, 2, 3, 4, 5, 6, 7, 8],
    weights: [1, 1, 1, 1, 1, 1, 1, 1],
  },
  windGustiness: {
    min: 0.9,
    max: 1,
  },
  rain: {
    values: [1, 2, 3, 4, 5],
    weights: [0, 0, 0, 1, 2],
  },
  rainIntensity: {
    min: 0.9,
    max: 1,
  },
  fog: {
    values: [0.0013, 0.0018, 0.02, 0.025, 0.03],
    weights: [0, 0, 2, 3, 2],
  },
  pressure: {
    min: 770,
    max: 780,
  },
} as unknown as Partial<IWeatherValues>;

export const sunnyDefault = {
  ...defaultWeather,
  clouds: {
    values: [-1, -0.8, -0.5, 0.1, 0, 0.4, 0.8, 1],
    weights: [15, 15, 15, 0, 0, 0, 0, 0],
  },
  windSpeed: {
    values: [0, 1, 2, 3, 4],
    weights: [14, 10, 5, 0, 0],
  },
  windDirection: {
    values: [1, 2, 3, 4, 5, 6, 7, 8],
    weights: [1, 1, 1, 1, 1, 1, 1, 1],
  },
  windGustiness: {
    min: 0,
    max: 1,
  },
  rain: {
    values: [1, 2, 3, 4, 5],
    weights: [1, 0, 0, 0, 0],
  },
  rainIntensity: {
    min: 0,
    max: 1,
  },
  fog: {
    values: [0.0015, 0.002, 0.008, 0.01, 0.03],
    weights: [2, 1, 0, 0, 0],
  },
  pressure: {
    min: 770,
    max: 780,
  },
} as unknown as Partial<IWeatherValues>;