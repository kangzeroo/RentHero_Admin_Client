// Compt for copying as a template
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'


class RudimentaryMap extends Component {

  constructor() {
    super()
    this.blue_map_pin = 'https://s3.amazonaws.com/rentburrow-static-assets/Icons/blue-dot.png'
  }

  componentDidMount() {
    this.mountGoogleMap(this.props.coordinates.gps_x, this.props.coordinates.gps_y)
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.coordinates.gps_x !== nextProps.coordinates.gps_x && this.props.coordinates.gps_y !== nextProps.coordinates.gps_y) {
      console.log('REFRESH MAP')
      console.log(nextProps.coordinates.gps_x, nextProps.coordinates.gps_y)
      this.mountGoogleMap(nextProps.coordinates.gps_x, nextProps.coordinates.gps_y)
    }
  }

  mountGoogleMap(gps_x, gps_y) {
		const mapOptions = {
      center: {
        lat: parseFloat(gps_x),
        lng: parseFloat(gps_y),
      },
      zoom: 14,
      zoomControlOptions: {
          position: google.maps.ControlPosition.RIGHT_TOP
      },
			streetViewControlOptions: {
          position: google.maps.ControlPosition.RIGHT_TOP
      },
    }
		const mapTarget = new google.maps.Map(document.getElementById('mapTarget'), mapOptions)
    const marker = new google.maps.Marker({
        position: new google.maps.LatLng(gps_x, gps_y),
        pin_type: 'building',
        icon: this.blue_map_pin,
        zIndex: 10,
    })
    marker.setMap(mapTarget)
	}

	render() {
		return (
			<div id='RudimentaryMap' style={comStyles().container}>
        <div id='mapTarget' style={this.props.map_styles}></div>
			</div>
		)
	}
}

// defines the types of variables in this.props
RudimentaryMap.propTypes = {
	history: PropTypes.object.isRequired,
	coordinates: PropTypes.object.isRequired,				// passed in
  map_styles: PropTypes.object,        // passed in
}

// for all optional props, define a default value
RudimentaryMap.defaultProps = {
  // coordinates: {
  //   gps_x: -34.397,
  //   gps_y: 150.644,
  // },
  map_styles: {
    height: '250px',
    width: '100%',
    zIndex: 20,
    borderRadius: '5px',
  }
}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(RudimentaryMap)

// Get access to state from the Redux store
const mapReduxToProps = (redux) => {
	return {

	}
}

// Connect together the Redux store with this React component
export default withRouter(
	connect(mapReduxToProps, {

	})(RadiumHOC)
)

// ===============================

// the JS function that returns Radium JS styling
const comStyles = () => {
	return {
		container: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
		},
	}
}
