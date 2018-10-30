import React, { Component } from 'react';
import {StaticMap} from 'react-map-gl';
import DeckGL, {PolygonLayer} from 'deck.gl';
import {TripsLayer} from '@deck.gl/experimental-layers';
import './App.css';

// Set your mapbox token here
const MAPBOX_TOKEN = 'pk.eyJ1IjoiZWR4ZSIsImEiOiJ5UzI3TVM0In0.M2rBJWFLY4sdkH9hjiRdUw';//process.env.MapboxAccessToken; // eslint-disable-line

// Source data CSV
const DATA_URL = {
    BUILDINGS:
        'https://raw.githubusercontent.com/uber-common/deck.gl-data/master/examples/trips/buildings.json', // eslint-disable-line
    TRIPS:
        '/data.json' // eslint-disable-line
};

const LIGHT_SETTINGS = {
    lightsPosition: [-66.0801442, 18.4419477, 8000, -65.5, 17, 5000],
    ambientRatio: 0.05,
    diffuseRatio: 0.6,
    specularRatio: 0.8,
    lightsStrength: [2.0, 0.0, 0.0, 0.0],
    numberOfLights: 2
};

export const INITIAL_VIEW_STATE = {
    longitude: -66.0801442,
    latitude: 18.4419477,
    zoom: 14,
    maxZoom: 17,
    minZoom: 12,
    pitch: 55,
    bearing: 0
};

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            time: 0
        };
    }

    componentDidMount() {
        this._animate();
    }

    componentWillUnmount() {
        if (this._animationFrame) {
            window.cancelAnimationFrame(this._animationFrame);
        }
    }

    routeColor(vendor){
        switch(vendor){
            case '1W4H5JXC96A7': return [255,65,68];
            case '4HLDQ36XZ7GY': return [23, 184, 190];
            case 'BQ1D8WAVEHYO': return [55,159,90];
            case 'CKRMGXZ3DW2T': return [242,134,27];
            case 'HYRAWL5USQ49': return [253, 128, 93];
            case 'KNP3VCQEUDF9': return [217,106,166];
            case 'L6IA23FBORJH': return [29,114,176];
            case 'QB4LRVZ2PCGS': return [65,117,5];
        }
    }

    _animate() {
        const {
            loopLength = 40933, // unit corresponds to the timestamp in source data
            animationSpeed = 30 // unit time per second
        } = this.props;
        const timestamp = Date.now() / 1000;
        const loopTime = loopLength / animationSpeed;

        this.setState({
            time: ((timestamp % loopTime) / loopTime) * loopLength
        });
        this._animationFrame = window.requestAnimationFrame(this._animate.bind(this));
    }

    _renderLayers() {
        const {buildings = DATA_URL.BUILDINGS, trips = DATA_URL.TRIPS, trailLength = 800} = this.props;

        return [
            new TripsLayer({
                id: 'trips',
                data: trips,
                getPath: d => d.segments,
                getColor: d => this.routeColor(d.vendor),
                opacity: 1,
                strokeWidth: 1000,
                trailLength,
                currentTime: this.state.time
            }),
            // new PolygonLayer({
            //   id: 'buildings',
            //   data: buildings,
            //   extruded: true,
            //   wireframe: false,
            //   fp64: true,
            //   opacity: 0.5,
            //   getPolygon: f => f.polygon,
            //   getElevation: f => f.height,
            //   getFillColor: [74, 80, 87],
            //   lightSettings: LIGHT_SETTINGS
            // })
        ];
    }


  render() {

      const {viewState, controller = true, baseMap = true} = this.props;
    return (
        <DeckGL
            layers={this._renderLayers()}
            initialViewState={INITIAL_VIEW_STATE}
            viewState={viewState}
            controller={controller}
        >
            {baseMap && (
                <StaticMap
                    reuseMaps
                    mapStyle="mapbox://styles/mapbox/dark-v9"
                    preventStyleDiffing={true}
                    mapboxApiAccessToken={MAPBOX_TOKEN}
                />
            )}
        </DeckGL>
    );
  }
}

export default App;
