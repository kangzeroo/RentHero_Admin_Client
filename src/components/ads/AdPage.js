// Compt for copying as a template
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import {

} from 'antd-mobile'


class AdPage extends Component {

  constructor() {
    super()
    this.state = {
      ad_id: '',
      ad: {},

      loading: true,
    }
  }

  componentWillMount() {
    const ad_id = this.props.location.pathname.slice('/app/ads/'.length)

    this.setState({
      ad_id: ad_id,
    })

    if (this.props.loading_complete) {
      this.refreshAd(ad_id)
    }
  }

  componentWillReceiveProps(nextProps) {
		if (this.props.all_ads !== nextProps.all_ads) {
			this.refreshAd(this.state.ad_id)
		}
	}

	refreshAd(ad_id) {
		const ad = this.props.all_ads.filter((ad) => { return ad.ad_id === ad_id })[0]
		if (ad) {
			this.setState({
        ad: ad,
        loading: false,
      })
		} else {
			this.props.history.push('/invalid')
		}
	}


	render() {
		return (
			<div id='AdPage' style={comStyles().container}>
				<h2>{`${this.state.ad.ad_title ? this.state.ad.ad_title : this.state.ad.formatted_address }`}</h2>
        <p>{`${this.state.ad.ad_title ? this.state.ad.formatted_address : ''}`}</p>
			</div>
		)
	}
}

// defines the types of variables in this.props
AdPage.propTypes = {
	history: PropTypes.object.isRequired,
  all_ads: PropTypes.array.isRequired,
  loading_complete: PropTypes.bool.isRequired,
}

// for all optional props, define a default value
AdPage.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(AdPage)

// Get access to state from the Redux store
const mapReduxToProps = (redux) => {
	return {
    all_ads: redux.ads.all_ads,
    loading_complete: redux.app.loading_complete,
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
      padding: '20px',
		}
	}
}
