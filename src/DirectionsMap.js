import React from 'react';

const { compose, withProps, lifecycle } = require("recompose");
const {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  DirectionsRenderer,
} = require("react-google-maps");

export const DirectionsMap = compose(
  withProps({
    googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyAxm62zSoAzobkGBoVyOjKFgMAJL5z6iXM&v=3.exp&libraries=geometry,drawing,places",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `400px`,display: 'flex', justifyContent: 'center' }} />,
    mapElement: <div style={{ height: `100%`, width: '60%' ,border: '1px solid #b0b3b7' }} />,
  }),
  withScriptjs,
  withGoogleMap,
  lifecycle({
    componentDidMount() {
      console.log('CDM fired')
      
        const google = window.google;
      const DirectionsService = new google.maps.DirectionsService();
        console.log('Inside cdm dm',this.props.destLat)
      DirectionsService.route({
        origin: new google.maps.LatLng(this.props.startingLat, this.props.startingLon),
        destination: new google.maps.LatLng(this.props.destLat, this.props.destLon),
        travelMode: google.maps.TravelMode.DRIVING,
      }, (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          this.setState({
            directions: result,
          });
        } else {
          console.error(`error fetching directions ${result}`);
        }
      });
    
    },

    componentWillReceiveProps(nextProps){
      
      if(nextProps != this.props){
      const google = window.google;
      const DirectionsService = new google.maps.DirectionsService();
        
      DirectionsService.route({
        origin: new google.maps.LatLng(nextProps.startingLat, nextProps.startingLon),
        destination: new google.maps.LatLng(nextProps.destLat, nextProps.destLon),
        travelMode: google.maps.TravelMode.DRIVING,
      }, (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          this.setState({
            directions: result,
          });
        } else {
          console.error(`error fetching directions ${result}`);
        }
      });
    }
  }

  })
)(props =>
    <div>
  <GoogleMap 
    defaultZoom={15}    
    center={{ lat: props.startingLat, lng: props.startingLon }}
  >
  
    {props.directions && <DirectionsRenderer directions={props.directions} />}
  </GoogleMap>
    </div>
);


//defaultCenter={new google.maps.LatLng(props.startingLat, props.startingLon)}
/*
 origin: new google.maps.LatLng(this.props.startingLat, this.props.startingLon),
        destination: new google.maps.LatLng(this.props.destLat, this.props.destLon),
        */