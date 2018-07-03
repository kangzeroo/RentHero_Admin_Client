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


class AssistantPage extends Component {

  constructor() {
    super()
    this.state = {
      assistant_id: '',
      assistant: {},

      loading: true,
    }
  }

  componentWillMount() {
    const assistant_id = this.props.location.pathname.slice('/app/assistants/'.length)
    this.setState({
      assistant_id: assistant_id,
    })

    if (this.props.loading_complete) {
      this.refreshAssistant(assistant_id)
    }
  }

  componentWillReceiveProps(nextProps) {
		if (this.props.all_assistants !== nextProps.all_assistants) {
			this.refreshAssistant(this.state.assistant_id)
		}
	}

	refreshAssistant(assistant_id) {
		const assistant = this.props.all_assistants.filter((ass) => { return ass.assistant_id === assistant_id })[0]
		if (assistant) {
			this.setState({
        assistant: assistant,
        loading: false,
      })
		} else {
			this.props.history.push('/invalid')
		}
	}


	render() {
		return (
			<div id='AssistantPage' style={comStyles().container}>
				<h2>{`${this.state.assistant.first_name ? `${this.state.assistant.first_name} ${this.state.assistant.last_name}` : this.state.assistant.email }`}</h2>
        <p>{`${this.state.assistant.first_name ? this.state.assistant.email : ''}`}</p>
			</div>
		)
	}
}

// defines the types of variables in this.props
AssistantPage.propTypes = {
	history: PropTypes.object.isRequired,
  all_assistants: PropTypes.array.isRequired,
  loading_complete: PropTypes.bool.isRequired,
}

// for all optional props, define a default value
AssistantPage.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(AssistantPage)

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
		}
	}
}
