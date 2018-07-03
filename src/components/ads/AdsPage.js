// Compt for copying as a template
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import {
	List,
} from 'antd'


class AdsPage extends Component {

	render() {
		return (
			<div id='AdsPage' style={comStyles().container}>
				<h2>{`${this.props.all_ads.length} Advertisements`}</h2>
				<List
					loading={!this.props.loading_complete}
					itemLayout='horizontal'
					dataSource={this.props.all_ads}
					renderItem={(item) => {
						return (
							<List.Item
								key={item.ad_id}
								actions={[<a>VIEW</a>]}
							>
								<List.Item.Meta
									title={`Title: ${item.ad_title}`}
									description={`Address: ${item.formatted_address}`}
								/>
							</List.Item>
						)
					}}
				/>
			</div>
		)
	}
}

// defines the types of variables in this.props
AdsPage.propTypes = {
	history: PropTypes.object.isRequired,
	all_ads: PropTypes.array.isRequired,
	loading_complete: PropTypes.bool.isRequired,
}

// for all optional props, define a default value
AdsPage.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(AdsPage)

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
