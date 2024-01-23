import * as moment from "moment";

const TRASH_CATEGORIES: { [key: string]: string } = {
  '1': 'Net',
  '2': 'Plastic',
  '3': 'Oil Spill',
};
const MAP_ZOOM = 13;
const MAP_STYLE = 'mapbox://styles/msuteu/cllnjn3u5001f01pe07y3e03b';
const MAPBOX_lat = -74.5;
const MAPBOX_lng = -74.5;

const MAX_FILE_SIZE = 10;

const getCurrentDateTimeTrasanctionID = (): number => {
  return Number(moment(new Date()).format("yyyyMMDDHHmmssSSS"));
}

export { TRASH_CATEGORIES, MAP_ZOOM, MAP_STYLE, MAX_FILE_SIZE, getCurrentDateTimeTrasanctionID };