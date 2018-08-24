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
import { getAgents } from '../../api/agents/agents_api'

class AgentsPage extends Component {

	constructor() {
		super()
		this.state = {
			// agents: [],
			loading: true,
		}
	}
  //
	// componentWillMount() {
	// 	getAgents()
	// 		.then((agents) => {
	// 			console.log(agents)
	// 			this.setState({
	// 				agents,
	// 				loading: false,
	// 			})
	// 		})
	// 		.catch((err) => {
	// 			message.error(err.response.data)
	// 		})
	// }

	render() {
		return (
			<div id='AgentsPage' style={comStyles().container}>
				<div style={comStyles().headerContainer}>
					<h2>{`${this.props.all_agents.length} Agents (Intelligence Groups)`}</h2>
					<Button type='primary' icon='user-add' onClick={() => this.props.history.push('/app/agents/create')}>
						Add New Agent
					</Button>
				</div>
        <br /><br />
				<List
					itemLayout='horizontal'
					loading={!this.props.stage_one_complete}
					dataSource={this.props.all_agents}
					renderItem={(item) => {
						return (
							<List.Item
								key={item.agent_id}
								actions={[<div>{`${item.operator_ids ? item.operator_ids.length : 0} Operators`}</div>, <a>edit</a>]}
								onClick={() => this.props.history.push(`${window.location.pathname}/${item.agent_id}`)}
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
AgentsPage.propTypes = {
	history: PropTypes.object.isRequired,
  all_agents: PropTypes.array.isRequired,
  stage_one_complete: PropTypes.bool.isRequired,
}

// for all optional props, define a default value
AgentsPage.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(AgentsPage)

// Get access to state from the Redux store
const mapReduxToProps = (redux) => {
	return {
    all_agents: redux.agents.all_agents,
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
		}
	}
}
