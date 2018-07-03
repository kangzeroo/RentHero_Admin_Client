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
import { saveAssistantsToRedux } from '../../../actions/assistants/assistants_actions'
import { insertAssistant, getAssistants, } from '../../../api/assistants/assistants_api'

class CreateAssistant extends Component {

  constructor() {
    super()
    this.state = {
      assistant_email: '',
      saving: false,
    }
  }

  createAssistant() {
    insertAssistant(this.state.assistant_email)
      .then((data) => {
        message.success(data.message)
        getAssistants()
          .then((data) => {
            this.props.saveAssistantsToRedux(data)
            this.props.history.push('/app/assistants')
          })
      })
      .catch((err) => {
        message.error(err.response.data)
      })
  }

	render() {
		return (
			<div id='CreateAssistant' style={comStyles().container}>
				<h1>Create New Assistant</h1>
        <p>This will not send an invite to the email yet...</p>
        <p>This will only insert into the database so that the assistant can log into the Assistant Portal</p>

        <Input
          placeholder='something@gmail.com'
          value={this.state.assistant_email}
          onChange={e => this.setState({ assistant_email: e.target.value })}
          onPressEnter={this.state.assistant_email.length === 0 ? () => {} : () => this.createAssistant()}
        />
        <br />
        <Button type='primary' icon='user-add' onClick={() => this.createAssistant()} loading={this.state.saving} disabled={this.state.assistant_email.length === 0}>
          Create Assistant
        </Button>
			</div>
		)
	}
}

// defines the types of variables in this.props
CreateAssistant.propTypes = {
	history: PropTypes.object.isRequired,
  saveAssistantsToRedux: PropTypes.func.isRequired,
}

// for all optional props, define a default value
CreateAssistant.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(CreateAssistant)

// Get access to state from the Redux store
const mapReduxToProps = (redux) => {
	return {

	}
}

// Connect together the Redux store with this React component
export default withRouter(
	connect(mapReduxToProps, {
    saveAssistantsToRedux,
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
