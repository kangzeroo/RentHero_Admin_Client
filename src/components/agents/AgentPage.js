// Compt for copying as a template
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import moment from 'moment'
import { withRouter } from 'react-router-dom'
import {
  Divider,
  Button,
  Modal,
  Table,
  Card,
} from 'antd'
import CreateOperator from '../operators/CreateOperator'
import SelectedOperator from '../operators/SelectedOperator'

class AgentPage extends Component {

  constructor() {
    super()
    this.state = {
      agent_id: '',
      agent: {},

      loading: true,

      toggle_modal: false,
      modal_name: '',              // name of the modal
      context: {},
    }
  }

  componentWillMount() {
    const agent_id = this.props.location.pathname.slice('/app/agents/'.length)
    this.setState({
      agent_id: agent_id,
    })

    console.log(agent_id)

    if (this.props.stage_one_complete) {
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
    console.log(agent)
    console.log(this.state.agent_id)
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

  toggleModal(bool, attr, context) {
    if (bool && attr) {
      history.pushState(null, null, `${this.props.location.pathname}?show=${attr}`)
    } else {
      history.pushState(null, null, `${this.props.location.pathname}`)
    }
    this.setState({
      toggle_modal: bool,
      modal_name: attr,
      context,
    })
  }

  renderAppropriateModal(modal_name, context) {
    if (modal_name === 'create_operator') {
      return this.renderModal()
    } else if (modal_name === 'selected_operator') {
      return this.renderSelectModal(context)
    }
  }

  renderModal() {
    const closeModal = () => {
      this.toggleModal(false)
      this.refreshAgent(this.state.agent_id)
    }
    return (
      <Modal
        wrapClassName='vertical-center-modal'
        visible={this.state.toggle_modal}
        footer=''
        onCancel={() => this.toggleModal(false)}
        width='80%'
      >
        <CreateOperator
          agent={this.state.agent}
          closeModal={() => closeModal()}
        />
      </Modal>
    )
  }

  renderSelectModal(operator) {
    const closeModal = () => {
      this.toggleModal(false)
      this.refreshAgent(this.state.agent_id)
    }
    return (
      <Modal
        wrapClassName='vertical-center-modal'
        visible={this.state.toggle_modal}
        footer=''
        onCancel={() => this.toggleModal(false)}
        width='80%'
      >
        <SelectedOperator
          agent={this.state.agent}
          operator={operator}
          closeModal={() => closeModal()}
        />
      </Modal>
    )
  }

  renderOperators() {
    return (
      <div>
        <div style={comStyles().row_container}>
          <h2>{`${this.state.agent && this.state.agent.operator_ids ? this.state.agent.operator_ids.length : 0} Operators`}</h2>
          <Button type='primary' onClick={() => this.toggleModal(true, 'create_operator')}>
            INVITE OPERATOR
          </Button>
        </div>
        {
          this.renderOperatorsTable()
        }
      </div>
    )
  }

  renderOperatorsTable() {
    const columns = [{
      title: 'ID',
      dataIndex: 'operator_id',
      width: '25%',
    }, {
      title: 'Name',
      width: '25%',
      render: (operator) => `${operator.first_name} ${operator.last_name}`
    }, {
      title: 'Email',
      dataIndex: 'email',
      width: '25%',
    }, {
      title: 'Created On',
      dataIndex: 'created_at',
      render: (operation) => `${moment(operation.created_at).format('LLL')}`,
      width: '25%',
    }]
    return (
      <Table
        columns={columns}
        dataSource={this.state.agent && this.state.agent.operator_ids
                      ?
                      this.state.agent.operator_ids.map((op) => {
                                                        return this.props.all_operators.filter((aop) => {
                                                          return aop.operator_id === op
                                                        })[0]
                                                      })
                      :
                      []
                    }
        loading={this.state.loading}
        onRow={(record) => {
          console.log(record)
          return {
            onClick: () => {
              this.toggleModal(true, 'selected_operator', record)
            },       // click row
          };
        }}
      />
    )
  }



	render() {
		return (
			<div id='AgentPage' style={comStyles().container}>
				<h2>{`${this.state.agent.first_name ? `${this.state.agent.first_name} ${this.state.agent.last_name}` : this.state.agent.email }`}</h2>
        <p>{`${this.state.agent.first_name ? this.state.agent.email : ''}`}</p>
        <Divider />
        {
          this.props.stage_one_complete
          ?
          this.renderOperators()
          :
          <Card loading bordered={false} />
        }
        {
          this.renderAppropriateModal(this.state.modal_name, this.state.context)
        }
			</div>
		)
	}
}

// defines the types of variables in this.props
AgentPage.propTypes = {
	history: PropTypes.object.isRequired,
  all_agents: PropTypes.array.isRequired,
  all_operators: PropTypes.array.isRequired,
  stage_one_complete: PropTypes.bool.isRequired,
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
    all_operators: redux.agents.all_operators,
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
    row_container: {
      width: '100%',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    }
	}
}
