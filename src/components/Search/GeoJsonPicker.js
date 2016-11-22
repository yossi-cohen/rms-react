import React from 'react';
import CesiumComponent from 'components/Cesium/CesiumComponent';
import CityList from 'components/Cesium/cities.js';

export default class GeoJsonPicker extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cities: require('assets/top10cities.json')
        };
    }

    //lilox
    // <img src="http://lorempixel.com/600/337/nature/" />
                // <CityList cities={this.state.cities} onChange={this.onCheckboxChange.bind(this)} />
    render() {
        return (
            <div className="geoJsonPicker">
                <CesiumComponent cities={this.state.cities} />
            </div>
        );
    }

    onCheckboxChange(event) {
        let cities = this.state.cities;
        let newCities = cities.map((city) => {
            let visible = (city.id === event.target.value) ? event.target.checked : city.visible;
            return {
                id: city.id,
                name: city.name,
                state: city.state,
                latitude: city.latitude,
                longitude: city.longitude,
                visible: visible
            }
        });
        this.setState({
            cities: newCities
        })
    }
}
