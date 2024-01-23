'use strict';

const TRASH_CATEGORIES: { [key: string]: string } = {
  '1': 'Net',
  '2': 'Plastic',
  '3': 'Oil Spill',
};


const MAPBOX_ZOOM = 13;
const MAPBOX_STYLE = 'mapbox://styles/msuteu/cllnjn3u5001f01pe07y3e03b';
const MAPBOX_LAT = -74.5;
const MAPBOX_LNG = -74.5;

const MAX_FILE_SIZE = 10;

export { TRASH_CATEGORIES, MAPBOX_ZOOM, MAPBOX_STYLE, MAX_FILE_SIZE };