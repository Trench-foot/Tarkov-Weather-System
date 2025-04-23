import { ISeasonDateTimes } from "@spt/models/spt/config/IWeatherConfig";

export const seasonMap = {
  0: "SUMMER",
  1: "AUTUMN",
  2: "WINTER",
  3: "SPRING",
  4: "AUTUMN_LATE",
  5: "SPRING_EARLY",
  6: "STORM",
};

export const seasonDates: ISeasonDateTimes[] = [
  {
    seasonType: 0,
    name: "SUMMER",
    startDay: 1,
    startMonth: 1,
    endDay: 31,
    endMonth: 1,
  },

  {
    seasonType: 1,
    name: "AUTUMN",
    startDay: 1,
    startMonth: 1,
    endDay: 31,
    endMonth: 1,
  },
  
  {
    seasonType: 4,
    name: "AUTUMN_LATE",
    startDay: 1,
    startMonth: 1,
    endDay: 31,
    endMonth: 1,
  },
  
  {
    seasonType: 2,
    name: "WINTER",
    startDay: 1,
    startMonth: 1,
    endDay: 31,
    endMonth: 1,
  },

  {
    seasonType: 5,
    name: "SPRING_EARLY",
    startDay: 1,
    startMonth: 1,
    endDay: 31,
    endMonth: 1,
  },
  
  {
    seasonType: 3,
    name: "SPRING",
    startDay: 1,
    startMonth: 1,
    endDay: 31,
    endMonth: 1,
  },

  {
    seasonType: 6,
    name: "STORM",
    startDay: 1,
    startMonth: 1,
    endDay: 31,
    endMonth: 1,
  },
];