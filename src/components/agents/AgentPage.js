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


class AgentPage extends Component {

  constructor() {
    super()
    this.state = {
      agent_id: '',
      agent: {},

      loading: true,
    }
  }

  componentWillMount() {
    const agent_id = this.props.location.pathname.slice('/app/agents/'.length)
    this.setState({
      agent_id: agent_id,
    })

    if (this.props.loading_complete) {
      this.refreshAgent(agent_id)
    }
  }

  componentWillReceiveProps(nextProps) {
		if (this.props.all_agents !== nextProps.all_agents) {
			this.refreshAgent(this.state.agent_id)
		}
	}

	refreshAgent(agent_id) {
		const agent = this.props.all_agents.filter((ass) => { return ass.agent_id === agent_id })[0]
		if (agent) {
			this.setState({
        agent: agent,
        loading: false,
      })
		} else {
      console.log('invalid')
			this.props.history.push('/invalid')
		}
	}


	render() {
		return (
			<div id='AgentPage' style={comStyles().container}>
				<h2>{`${this.state.agent.first_name ? `${this.state.agent.first_name} ${this.state.agent.last_name}` : this.state.agent.email }`}</h2>
        <p>{`${this.state.agent.first_name ? this.state.agent.email : ''}`}</p>
			</div>
		)
	}
}

// defines the types of variables in this.props
AgentPage.propTypes = {
	history: PropTypes.object.isRequired,
  all_agents: PropTypes.array.isRequired,
  loading_complete: PropTypes.bool.isRequired,
}

// for all optional props, define a default value
AgentPage.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(AgentPage)

// Get access to state from the Redux store
const mapReduxToProps = (redux) => {
	return {
    all_agents: redux.agents.all_agents,
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
