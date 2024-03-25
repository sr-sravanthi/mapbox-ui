
import * as moment from 'moment';

const TRASH_CATEGORIES: { [key: string]: string } = {
  '1': 'Net',
  '2': 'Plastic',
  '3': 'Oil Spill',
  '4': 'Others'
};
const MAP_ZOOM = 13;
const MAP_STYLE = 'mapbox://styles/msuteu/cllnjn3u5001f01pe07y3e03b';
const MAP_VECTOR = 'mapbox://styles/msuteu/cllnj782v52ri2no83n7mq4jk-2xowa';
const MAP_MINZOOM = 6;//10
const MAP_MAXZOOM = 18;

const MAPBOX_lng = -74.5;


const MAX_FILE_SIZE = 10;

const getCurrentDateTimeTrasanctionID = (): number => {
  return Number(moment(new Date()).format("yyyyMMDDHHmmssSSS"));
}

export { TRASH_CATEGORIES, MAP_ZOOM, MAP_STYLE, MAX_FILE_SIZE, MAP_VECTOR, MAP_MINZOOM, MAP_MAXZOOM, getCurrentDateTimeTrasanctionID };