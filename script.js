const APIKey="qla3hf2acmq";
let debug=1;

class birdsData
{
    constructor(spCode, comName, sciName, locId, locName, obsDt, hMany, lat, lng, obsValid, obsReviewed,locPrivate, sId, exo)
    {
        this.specCode = spCode;
        this.commonName = comName;
        this.scientificName = sciName;
        this.locationId = locId;
        this.locationName = locName;
        this.observationDt = obsDt;
        this.howManyBirds = hMany;
        this.latitude = lat;
        this.longitude = lng;
        this.observationValid = obsValid;
        this.observatinReviewed = obsReviewed;
        this.locPrivate = locPrivate;
        this.sId = sId;
        this.exotic = exo;
      }
}

class city
{    constructor(lat, lon)
{
    this.latitude = lat;  // [-90.0 ; 90.0]
    this.longitude = lon; // [-180.0 ; 180.0]
}
}

// view
var myview = new ol.View({
    center: [1350766.668508934, 5177943.850979362], // map.getView().getCenter()
    zoom: 2,
})

const centerCoordinates = ol.proj.fromLonLat([12.5674, 41.8719]); // Coordinate di Roma
const zoomLevel = 6;

var currentCity = new city();
var observedBirdsArray = [];  //array containing all BirdsData from JSON
var observedBirdsNamesArray = []; //array containing all birds names from json
var selectedBirdName;
var textToPrint = document.getElementById("content");
var combobox = document.getElementById('birdComboBox');
let decimals = 1;
var output;
var currentSelectedBirdObservation;

/**
 * reset current cityData
 */
function cleanCurrentCity()
{
    currentCity.longitude = 0;
    currentCity.latitude = 0;
}

/**
 * Listener for combobox Element Change
 */
combobox.addEventListener("change", function() {
    selectedBirdName = combobox.value;
    console.log("Selected Bird: ", selectedBirdName);
    updateGUI();
});

/**
 * FUnction used to avoid unexpected fill of data
 */
function clearDataStructures()
{
    while(observedBirdsArray.length > 0) {
        observedBirdsArray.pop();
    }

    while(observedBirdsNamesArray.length > 0) {
        observedBirdsNamesArray.pop();
    }
}

/**
 * Get data from JS
 * @param allBirds
 * Need to put ot the right side of the foreach the name of the field that you see on the console
 */
function saveBirdsObservation(allBirds)
{
    clearDataStructures()

    allBirds.forEach((obsBird) =>
    {
        let singleBirdObs = new birdsData();
        singleBirdObs.specCode = obsBird.speciesCode;
        singleBirdObs.commonName = obsBird.comName;
        singleBirdObs.scientificName = obsBird.sciName;
        singleBirdObs.locationId = obsBird.locId;
        singleBirdObs.locationName = obsBird.locName;
        singleBirdObs.observationDt = obsBird.obsDt;
        singleBirdObs.howManyBirds = obsBird.howMany;
        singleBirdObs.latitude = obsBird.lat;
        singleBirdObs.longitude = obsBird.lng;
        singleBirdObs.observationValid = obsBird.obsValid;
        singleBirdObs.observatinReviewed = obsBird.obsReviewed;
        singleBirdObs.locPrivate = obsBird.locationPrivate;
        singleBirdObs.sId = obsBird.subId;
        singleBirdObs.exotic = obsBird.exoticCategory;

        observedBirdsArray.push(singleBirdObs);
        observedBirdsNamesArray.push(singleBirdObs.commonName);
    })

    //populate combobox
    loadFoundBirds();

    if (debug === 1) console.log("Birds Names")
    if (debug === 1) console.log(observedBirdsNamesArray);

    if (debug === 1) console.log("Saved Birds")
    if (debug === 1) console.log(observedBirdsArray);
}

/**
 * carica tutti i nomi nella combobox
 */
function loadFoundBirds()
{
    combobox.innerHTML = '';

    //Rimuovi tutti gli elementi precedenti dalla combobox
    while (combobox.options.length > 0) {
        combobox.remove();
    }

    //add default val
    let noName = "Seleziona un volatile:";
    let noOption = document.createElement('option');
    noOption.text = noName;
    combobox.add(noOption);

    for (let i = 0; i < observedBirdsNamesArray.length; i++) {
      let name = observedBirdsNamesArray[i];
      let option = document.createElement('option');

      option.text = name;
      combobox.add(option);
      if(debug === 1) console.log("Carico: " + name);
    }

    for (var i = 0; i < combobox.options.length; i++)
    {
        if (combobox.options[i].value === "Seleziona un volatile:")
        {
            combobox.selectedIndex = i;
            break;
        }
    }
}


/**
 * get bird data to print
 */
function getSelectedBirdData()
{
    if(debug === 1) console.log("SelectedBirdName", selectedBirdName);

    currentSelectedBirdObservation = observedBirdsArray.find(bird => bird.commonName === selectedBirdName);

    if(debug === 1) console.log("SelectedBird");
    if(debug === 1) console.log(currentSelectedBirdObservation);
}


/**
 * This function updates GUI with obs birds data
 */
function updateGUI()
{
    getSelectedBirdData();
    console.log("Selected name: ",selectedBirdName);
    console.log("Selected data: ",currentSelectedBirdObservation);

    textToPrint.innerHTML = `<ul>
    <li>${"Nome comune: <a href=\"https://ebird.org/species/" + currentSelectedBirdObservation.specCode +"?siteLanguage=it\">" + currentSelectedBirdObservation.commonName}</a></li>
    <li>${"Nome scientifico:  <a href=\"https://ebird.org/species/" + currentSelectedBirdObservation.specCode +"?siteLanguage=it\">" + currentSelectedBirdObservation.scientificName}</a></li><hr />
    <li>${"Data di avvistamento: " + currentSelectedBirdObservation.observationDt}</li><hr />
    <li>${"Numero di esemplari avvistati: " + currentSelectedBirdObservation.howManyBirds}</li><hr />
    <li>${"Latitudine: " + currentSelectedBirdObservation.latitude.toFixed(6)} </li>
    <li>${"Longitudine: " + currentSelectedBirdObservation.longitude.toFixed(6)} </li>
    <li>${"Nome luogo avvistamento: " + currentSelectedBirdObservation.locationName}</li><hr />    
    <li>${"SubId del luogo: " + currentSelectedBirdObservation.sId} </li>
	<li>${"ID luogo: " + currentSelectedBirdObservation.locationId}</li>    
    `;
}

/**
 *  API get for all birds on a specific coordinate
 */
async function getBirdsByCoordinates ()
{
    console.log("Avvio get dalle coordinate");

    //headers setup
    var myHeaders = new Headers();
    myHeaders.append("X-eBirdApiToken", APIKey);

    const locationBaseUrl = "https://api.ebird.org/v2/data/obs/geo/recent?";
    const query = `lat=${currentCity.latitude.toFixed(2)}&lng=${currentCity.longitude.toFixed(2)}&key=${APIKey}`;
    if (debug === 1)console.log(query);
    if (debug === 1)console.log(locationBaseUrl + query);
    const res = await fetch(locationBaseUrl + query);
    const allBirds = await res.json()
    if (debug === 1) console.log(allBirds);
    const {LocalizedName, Key} = allBirds;

    //fill our city info
    currentCity.cityName = LocalizedName;
    currentCity.cityCode = Key;
    if (debug === 1) console.log(currentCity);

    //salvo gli uccelli trovati
    saveBirdsObservation(allBirds);
}

window.onload = init(); // Call init() when we open the window

/**
 * Initialize GUI
 */
function init() {
    const map = new ol.Map({
        target: 'map',
        layers: [
            new ol.layer.Tile({
                source: new ol.source.OSM()
            })
        ],
        view: new ol.View({
            center: centerCoordinates,
            zoom: zoomLevel
        })
    });

    // The following is to create three different layers. openStreetMapStandard, openStreetMapHumanitarian and stamenTerrain
    const openStreetMapStandard = new ol.layer.Tile({
        source: new ol.source.OSM(), // open street map
        visible: true,
        title: 'OSMStandard'
    })

    map.addLayer(openStreetMapStandard);

    // Vector Layers
    var styles = [
        new ol.style.Style({
            fill: new ol.style.Fill({
                color: [125, 45, 45, 0.15]
            }),
            stroke: new ol.style.Stroke({
                color: 'red', // '#3399CC'
                width: 1.2
            }),

            image: new ol.style.Circle({
                fill: new ol.style.Fill({
                    color: "blue"
                }),
                radius: 3.5,
                stroke: new ol.style.Stroke({
                    color: 'red', // '#3399CC'
                    width: 1.2
                }),

            }),

        })
    ];

    // Manually created geojson of italy by http://geojson.io/#map=7/51.529/-0.110
    var ItalyGeoJSON = new ol.layer.VectorImage({
        source: new ol.source.Vector({
            format: new ol.format.GeoJSON(),
            url: './data/vector_data/italyFix.geojson'
        }),
        visible: true,
        title: 'ITALY',
        style: styles
    })
    map.addLayer(ItalyGeoJSON);

    // Vector feature popup
    const overlayContainerElement = document.querySelector(".overlay-container");
    const overlayLayer = new ol.Overlay({
        element: overlayContainerElement
    })
    map.addOverlay(overlayLayer);
    const overlayFeatureName = document.getElementById('feature-name');
    const overlayFeatureAdditionalINFO = document.getElementById('feature-additional-info');

    map.on('click', function (i) { // create a click event ;
        overlayLayer.setPosition(undefined);
        map.forEachFeatureAtPixel(i.pixel, function (feature, layer) {
                let clickedCoordinate = i.coordinate;
                let lonLatCoordinate = ol.proj.toLonLat(clickedCoordinate) // longitude as 1st and latitude as 2nd element
                let clickedFeatureName = feature.get('NAME');
                let clickedFeatureAdditionalINFO = feature.get('additionalinfo');
                overlayLayer.setPosition(clickedCoordinate);
                overlayFeatureName.innerHTML = clickedFeatureName;
                overlayFeatureAdditionalINFO.innerHTML = clickedFeatureAdditionalINFO;
            },
            {
                layerFilter: function (layerCandidate) { // it's a filter that select the geojson you want to use
                    return layerCandidate.get("title") === 'ITALY'
                }
            })
    })


    // Create a click event to call getMapCoordOnClick()
    map.on("click", (e) => getMapCoordOnClick(e));
}


/**
 * Get the weather info when click on the map
 * @param evt click event
 */
const getMapCoordOnClick = (evt) =>
{
    console.log("getMapCoordOnClick invoked");
    //tuple of coordinates
    const lonLat = ol.proj.toLonLat(evt.coordinate);
    //prepare clean ambient
    cleanCurrentCity();

    currentCity.longitude = lonLat[0];
    currentCity.latitude = lonLat[1];
    console.log(currentCity);

    // Also only represent the city name on the console, can't print it and call it now; It's the problem of async and cannot get the OBJECT correctly
    getBirdsByCoordinates().then(loadFoundBirds);
}

/**
 * Function for zoom in the map to the specific city
 */
function zoomIn(Lat , Lon)
{
    myview.animate({
        center: [Lat , Lon],
        duration: 1800,
        zoom: 6
    })
}

