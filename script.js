// Script to download a multispectral image to Google Drive, 
// through Earth Engine - Code Editor

// Create geometry
var geometry = ee.Geometry.Polygon(
          [[[-48.6064338684082,-26.22352298843246],
            [-48.55304718017578,-26.22352298843246],
            [-48.55304718017578,-26.185018250078308],
            [-48.6064338684082,-26.185018250078308],
            [-48.6064338684082,-26.22352298843246]]]);

// Chose the image (you first need to know the image ID)
// see how: https://github.com/laispool/ImageCollection_table 
var image = ee.Image('COPERNICUS/S2_SR/20220703T132239_20220703T132238_T22JGS') // create the variable that contains the image
  .select(['B8', 'B4', 'B3', 'B2']) // select the bands you want to show after - in case you want to visualize it
  .clip(geometry); // clio from geometry

// Retrieve the projection information from a band of the original image.
// Call getInfo() on the projection to request a client-side object containing
// the crs and transform information needed for the client-side Export function.

var projection = image.select('B3').projection().getInfo();  

//create a visualization parameter in false color
var vis_false = { 
  max: 3000,
  bands: ['B8', 'B3', 'B2'],
};
//create a visualization parameter in true color
var vis_rgb = {
  max: 6000,
  bands: ['B4', 'B3', 'B2'],
};

// Display the image.
Map.centerObject(geometry, 13), //Babitonga Bay (SC-Brazil) location
Map.addLayer(image, vis_rgb, 'true color composition');
Map.addLayer(image, vis_false, 'false color composition');

// Export the image, specifying the CRS, transform, and region.
//this will download the image to your root path
Export.image.toDrive({ 
  image: image,
  description: 'S2_20220703', //you can change the name of the file
  crs: projection.crs,
  crsTransform: projection.transform,
  region: geometry,
  fileFormat: 'GeoTIFF',
  formatOptions: {
    cloudOptimized: true}
});
