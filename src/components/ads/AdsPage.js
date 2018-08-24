// Compt for copying as a template
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import moment from 'moment'
import QueueAnim from 'rc-queue-anim';
import TweenOne from 'rc-tween-one'
import { withRouter } from 'react-router-dom'
import {
	List,
	Button,
	Input,
	Icon,
} from 'antd'

class AdsPage extends Component {

	constructor() {
		super()
		this.state = {
			search_string: ''
		}
	}

	renderAdsList() {
		const filtered_ads = this.props.all_ads.filter((ad) => {
			 return ad.ad_title.toLowerCase().indexOf(this.state.search_string.toLowerCase()) > -1 ||
							ad.formatted_address.toLowerCase().indexOf(this.state.search_string.toLowerCase()) > -1
			})
		return (
			<div>
				<div style={comStyles().headerContainer}>
					<h2>{`${filtered_ads.length} Advertisement${filtered_ads.length === 1 ? '' : 's'}`}</h2>
					<Input
						placeholder='Search...'
						value={this.state.search_string}
						onChange={e => this.setState({ search_string: e.target.value })}
						style={{ maxWidth :'50%' }}
						prefix={<Icon type='search' />}
					/>
				</div>
				<br />
				<List
					itemLayout='horizontal'
					loading={!this.props.stage_one_complete}
					size='large'
				>
					<QueueAnim type='bottom' component='div'>
						{
							filtered_ads.map((item) => {
								// console.log(moment(moment.utc(item.created_at)).local())
								return (
									<List.Item
										key={item.ad_id}
										onClick={() => this.props.history.push(`${window.location.pathname}/${item.ad_id}`)}
										actions={[<a>VIEW</a>]}
									>
										<List.Item.Meta
											title={`${item.ad_title ? item.ad_title : item.formatted_address}`}
											description={`${item.ad_title ? item.formatted_address : ''}`}
										/>
									</List.Item>
								)
							})
						}
					</QueueAnim>
				</List>
			</div>
		)
	}

	render() {
		return (
			<div id='AdsPage' style={comStyles().scroll} className='pretty_scrollbar'>
				{
					this.renderAdsList()
				}
			</div>
		)
	}
}

// defines the types of variables in this.props
AdsPage.propTypes = {
	history: PropTypes.object.isRequired,
	all_ads: PropTypes.array.isRequired,
	stage_one_complete: PropTypes.bool.isRequired,
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
		stage_one_complete: redux.app.stage_one_complete,
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
		},
		headerContainer: {
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'space-between',
			alignItems: 'center',
		},
		scroll: {
			display: 'flex',
			flexDirection: 'column',
			// flexWrap: 'wrap',
			// maxHeight: '100%',
			minWidth: '100%',
			maxWidth: '100%',
			height: '100%',
			overflowY: 'scroll',
			// padding: '15px',
			justifyContent: 'flex-start',
		  padding: '20px',
		},
	}
}
