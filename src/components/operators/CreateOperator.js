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
  Select,
  message,
  Divider,
} from 'antd'
const Option = Select.Option
import { saveOperatorsToRedux, saveAgentsToRedux, } from '../../actions/agents/agents_actions'
import { insertOperator, getOperators, selectOperatorForIntelligence, getAgents, } from '../../api/agents/agents_api'


class CreateOperator extends Component {

  constructor() {
    super()
    this.state = {
      operator_email: '',
      saving: false,


      search_string: '',
      selected_operators: [],
    }
  }

  componentWillMount() {
    console.log(this.props.all_operators)
  }

  createOperator() {
    insertOperator(this.state.operator_email, this.props.agent.agent_id)
      .then((data) => {
        message.success(data.message)
        return this.refreshAgents()
      })
      .then(() => {
        // this.props.history.push(`/app/agents/${this.props.agent_id}`)
        this.props.closeModal()
      })
      .catch((err) => {
        message.error(err.response.data)
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

  renderExistingOperators() {
    const filtered_operators = this.props.all_operators.filter((op) => {
      console.log(op)
      return op.first_name && op.first_name.toLowerCase().indexOf(this.state.search_string.toLowerCase()) > -1 ||
             op.last_name && op.last_name.toLowerCase().indexOf(this.state.search_string.toLowerCase()) > -1 ||
             op.email && op.email.toLowerCase().indexOf(this.state.search_string.toLowerCase()) > -1
    })
    const onCancel = () => {
      this.setState({
        selected_operators: [],
        search_string: '',
      })
    }
    const onSave = () => {
      const operators = this.state.selected_operators.map(op => { return op.substring(2).replace('=2', ':') })
      console.log(operators)
      selectOperatorForIntelligence(this.props.agent.agent_id, operators)
        .then((data) => {
          message.success(data.message)
          return this.refreshAgents()
        })
        .then((data) => {
          console.log(data)
          // this.props.history.push(`/app/agents/${this.props.agent_id}`)
          this.props.closeModal()
        })
        .catch((err) => {
          console.log(err)
          message.error(err.response.data)
        })
    }
    return (
      <div>
        <h1>Select Existing Operator</h1>
        <p>Add an existing operator to this intelligence group</p>
        <Select
          mode="multiple"
          showSearch
          style={{ width: '100%', }}
          placeholder='Select existing operator'
          value={this.state.selected_operators}
          onSearch={e => this.setState({ search_string: e, })}
          onChange={(selections, v) => this.setState({ selected_operators: selections, }, () => console.log(this.state.selected_operators))}
          disabled={this.state.saving}
        >
          {
            filtered_operators.map((operator) => {
              return (
                <Option key={operator.operator_id}>
                  {`${operator.first_name} ${operator.last_name} -- ${operator.email}`}
                </Option>
              )
            })
          }
        </Select>
        <br /><br />
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <Button type='default' onClick={() => onCancel()} disabled={this.state.saving} style={{ marginRight: '10px' }}>
            CANCEL
          </Button>
          <Button type='primary' onClick={() => onSave()} disabled={this.state.saving} loading={this.state.saving} disabled={this.state.saving || this.state.selected_operators.length === 0}>
            SELECT OPERATORS
          </Button>
        </div>
        <Divider />
      </div>
    )
  }

	render() {
		return (
			<div id='CreateOperator' style={comStyles().container}>
        {
          this.props.all_operators && this.props.all_operators.length > 0
          ?
          this.renderExistingOperators()
          :
          null
        }
				<h1>Invite New Operator</h1>
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
  saveAgentsToRedux: PropTypes.func.isRequired,
  all_operators: PropTypes.array.isRequired,
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
    all_operators: redux.agents.all_operators,
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
      padding: '20px',
		}
	}
}
