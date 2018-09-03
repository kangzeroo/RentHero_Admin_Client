// Compt for copying as a template
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import {
  Button,
  message,
} from 'antd'
import { saveOperatorsToRedux, saveAgentsToRedux, } from '../../actions/agents/agents_actions'
import { getOperators, removeOperatorFromIntelligence, getAgents, } from '../../api/agents/agents_api'


class SelectedOperator extends Component {

  constructor() {
    super()
    this.state = {
      saving: false,
    }
  }

  deleteOperatorAssociation() {
    this.setState({
      saving: true,
    })
    removeOperatorFromIntelligence(this.props.agent.agent_id, this.props.operator.operator_id)
      .then((data) => {
        message.success(data)
        return this.refreshAgents()
      })
      .then((data) => {
        this.props.closeModal()
      })
      .catch((err) => {
        console.log(err)
        this.setState({
          saving: false,
        })
      })
  }

  refreshAgents() {
    const p = new Promise((res, rej) => {
      getAgents()
        .then((data) => {
          this.props.saveAgentsToRedux(data)
          return getOperators()
        })
        .then((data) => {
          this.props.saveOperatorsToRedux(data)
          res('Refreshed')
        })
        .catch((err) => {
          console.log(err)
          rej(err)
        })
    })
    return p
  }

	render() {
		return (
			<div id='SelectedOperator' style={comStyles().container}>
				<h1>{`${this.props.operator.first_name} ${this.props.operator.last_name}`}</h1>
        <p>{`Email: ${this.props.operator.email}`}</p>
        <p>{`Phone: ${this.props.operator.phone}`}</p>
        <br />
        <Button type='danger' onClick={() => this.deleteOperatorAssociation()} loading={this.state.saving} disabled={this.state.saving}>
          REMOVE FROM INTELLIGENCE GROUP
        </Button>
			</div>
		)
	}
}

// defines the types of variables in this.props
SelectedOperator.propTypes = {
	history: PropTypes.object.isRequired,
  saveOperatorsToRedux: PropTypes.func.isRequired,
  saveAgentsToRedux: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,      // passed in
  agent: PropTypes.object.isRequired,         // passed in
  operator: PropTypes.object.isRequired,      // passed in
}

// for all optional props, define a default value
SelectedOperator.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(SelectedOperator)

// Get access to state from the Redux store
const mapReduxToProps = (redux) => {
	return {

	}
}

// Connect together the Redux store with this React component
export default withRouter(
	connect(mapReduxToProps, {
    saveOperatorsToRedux,
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
		}
	}
}
