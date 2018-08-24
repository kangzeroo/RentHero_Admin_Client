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
import { saveOperatorsToRedux } from '../../actions/agents/agents_actions'
import { insertOperator, getOperators, } from '../../api/agents/agents_api'

class CreateOperator extends Component {

  constructor() {
    super()
    this.state = {
      operator_email: '',
      saving: false,
    }
  }

  createOperator() {
    insertOperator(this.state.operator_email, this.props.agent.agent_id)
      .then((data) => {
        message.success(data.message)
        return getOperators()
      })
      .then((data) => {
        this.props.saveOperatorsToRedux(data)
        this.props.history.push(`/app/agents/${this.props.agent_id}`)
        this.props.closeModal()
      })
      .catch((err) => {
        message.error(err.response.data)
      })
  }

	render() {
		return (
			<div id='CreateOperator' style={comStyles().container}>
				<h1>Create New Operator</h1>
        <p>This will not send an invite to the email...</p>

        <p style={{ fontWeight: 'bold' }}>Email Address</p>
        <Input
          placeholder='something@gmail.com'
          value={this.state.operator_email}
          onChange={e => this.setState({ operator_email: e.target.value })}
          onPressEnter={this.state.operator_email.length === 0 ? () => {} : () => this.createOperator()}
        />
        <br />
        <Button type='primary' icon='user-add' onClick={() => this.createOperator()} loading={this.state.saving} disabled={this.state.operator_email.length === 0}>
          Create Operator
        </Button>
			</div>
		)
	}
}

// defines the types of variables in this.props
CreateOperator.propTypes = {
	history: PropTypes.object.isRequired,
  saveOperatorsToRedux: PropTypes.func.isRequired,
  agent: PropTypes.object.isRequired,             // passed in
  closeModal: PropTypes.func.isRequired,          // passed in
}

// for all optional props, define a default value
CreateOperator.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(CreateOperator)

// Get access to state from the Redux store
const mapReduxToProps = (redux) => {
	return {

	}
}

// Connect together the Redux store with this React component
export default withRouter(
	connect(mapReduxToProps, {
    saveOperatorsToRedux,
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
