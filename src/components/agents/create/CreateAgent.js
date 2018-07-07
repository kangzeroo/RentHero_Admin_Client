// Compt for copying as a template
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import {
  Input,
  Button,
  message,
} from 'antd'
import { saveAgentsToRedux } from '../../../actions/agents/agents_actions'
import { insertAgent, getAgents, } from '../../../api/agents/agents_api'

class CreateAgent extends Component {

  constructor() {
    super()
    this.state = {
      agent_email: '',
      saving: false,
    }
  }

  createAgent() {
    insertAgent(this.state.agent_email)
      .then((data) => {
        message.success(data.message)
        getAgents()
          .then((data) => {
            this.props.saveAgentsToRedux(data)
            this.props.history.push('/app/agents')
          })
      })
      .catch((err) => {
        message.error(err.response.data)
      })
  }

	render() {
		return (
			<div id='CreateAgent' style={comStyles().container}>
				<h1>Create New Agent</h1>
        <p>This will not send an invite to the email yet...</p>
        <p>This will only insert into the database so that the agent can log into the Agent Portal</p>

        <Input
          placeholder='something@gmail.com'
          value={this.state.agent_email}
          onChange={e => this.setState({ agent_email: e.target.value })}
          onPressEnter={this.state.agent_email.length === 0 ? () => {} : () => this.createAgent()}
        />
        <br />
        <Button type='primary' icon='user-add' onClick={() => this.createAgent()} loading={this.state.saving} disabled={this.state.agent_email.length === 0}>
          Create Agent
        </Button>
			</div>
		)
	}
}

// defines the types of variables in this.props
CreateAgent.propTypes = {
	history: PropTypes.object.isRequired,
  saveAgentsToRedux: PropTypes.func.isRequired,
}

// for all optional props, define a default value
CreateAgent.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(CreateAgent)

// Get access to state from the Redux store
const mapReduxToProps = (redux) => {
	return {

	}
}

// Connect together the Redux store with this React component
export default withRouter(
	connect(mapReduxToProps, {
    saveAgentsToRedux,
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
