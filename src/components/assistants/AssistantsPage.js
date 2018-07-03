// Compt for copying as a template
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import {
	message,
	List,
	Avatar,
	Button,
} from 'antd'
import { getAssistants } from '../../api/assistants/assistants_api'

class AssistantsPage extends Component {

	constructor() {
		super()
		this.state = {
			// assistants: [],
			loading: true,
		}
	}
  //
	// componentWillMount() {
	// 	getAssistants()
	// 		.then((assistants) => {
	// 			console.log(assistants)
	// 			this.setState({
	// 				assistants,
	// 				loading: false,
	// 			})
	// 		})
	// 		.catch((err) => {
	// 			message.error(err.response.data)
	// 		})
	// }

	render() {
		return (
			<div id='AssistantsPage' style={comStyles().container}>
				<div style={comStyles().headerContainer}>
					<h2>{`${this.props.all_assistants.length} Assistants`}</h2>
					<Button type='primary' icon='user-add' onClick={() => this.props.history.push('/app/assistants/create')}>
						Add New Assistant
					</Button>
				</div>
				<List
					itemLayout='horizontal'
					loading={!this.props.loading_complete}
					dataSource={this.props.all_assistants}
					renderItem={(item) => {
						return (
							<List.Item
								key={item.assistant_id}
								actions={[<a>edit</a>]}
								onClick={() => this.props.history.push(`${window.location.pathname}/${item.assistant_id}`)}
							>
								<List.Item.Meta
									avatar={<Avatar style={{ backgroundColor: '#ffa751', verticalAlign: 'middle' }}>{item.email.toUpperCase()[0]}</Avatar>}
									title={<a href=''>{`${item.first_name ? item.first_name : item.email } ${item.last_name ? item.last_name : ''}`}</a>}
									description={`Email: ${item.email}`}
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
AssistantsPage.propTypes = {
	history: PropTypes.object.isRequired,
  all_assistants: PropTypes.array.isRequired,
  loading_complete: PropTypes.bool.isRequired,
}

// for all optional props, define a default value
AssistantsPage.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(AssistantsPage)

// Get access to state from the Redux store
const mapReduxToProps = (redux) => {
	return {
    all_assistants: redux.assistants.all_assistants,
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
		},
		headerContainer: {
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'space-between',
			alignItems: 'center',
		}
	}
}
