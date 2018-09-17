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
  message,
  Input,
} from 'antd'
import CreateOperator from '../operators/CreateOperator'
import SelectedOperator from '../operators/SelectedOperator'
import SelectedProxyPopup from '../proxy/SelectedProxyPopup'
import { updateAgent } from '../../api/agents/agents_api'

class AgentPage extends Component {

  constructor() {
    super()
    this.state = {
      agent_id: '',
      agent: {},

      intel_group_name: '',

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
        intel_group_name: agent.friendly_name,
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
    } else if (modal_name === 'selected_proxy') {
      return this.renderSelectProxyModal(context)
    } else if (modal_name === 'add_proxy') {
      return this.renderAddProxyModal(context)
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

  renderSelectProxyModal(proxy) {
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
        <SelectedProxyPopup
          proxy={proxy}
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

  renderProxies() {
    return (
      <div>
        <div style={comStyles().row_container}>
          <h2>{`${this.state.agent && this.state.agent.proxies ? this.state.agent.proxies.length : 0} Proxies`}</h2>
          <Button type='primary' onClick={() => this.toggleModal(true, 'add_proxy')}>
            ADD PROXY
          </Button>
        </div>
        {
          this.renderProxiesTable()
        }
      </div>
    )
  }

  renderProxiesTable() {
    const columns = [{
      title: 'Proxy ID',
      dataIndex: 'proxy_id',
      width: '25%',
    }, {
      title: 'Corporation Name',
      width: '25%',
      render: (proxy) => `${this.props.all_corps.filter((corp) => corp.corporation_id === proxy.corporation_id)[0].corporation_name}`
    }, {
      title: 'Proxy Email',
      dataIndex: 'proxy_email',
      width: '25%',
    }, {
      title: 'Proxy Phone',
      dataIndex: 'proxy_phone',
      width: '25%',
    }]
    return (
      <Table
        columns={columns}
        dataSource={this.state.agent.proxies}
        loading={this.state.loading}
        onRow={(record) => {
          console.log(record)
          return {
            onClick: () => {
              this.toggleModal(true, 'selected_proxy', record)
            },       // click row
          };
        }}
      />
    )
  }

  renderHeader() {
    const updateAgentName = () => {
      updateAgent({
        agent_id: this.state.agent.agent_id,
        friendly_name: this.state.intel_group_name,
        email: this.state.agent.email,
        actual_email: this.state.actual_email,
      })
      .then((data) => {
        message.success(data.message)
        this.setState({
          agent: data.agent,
          editable: false,
        })
      })
      .catch((err) => {
        console.log(err)
        message.error(err.response.data)
      })
    }
    if (this.state.editable) {
      return (
        <div>
          <p style={{ fontWeight: 'bold' }}>Intelligence Group Name</p>
          <Input
            value={this.state.intel_group_name}
            onChange={e => this.setState({ intel_group_name: e.target.value })}
          />
          <br /><br />
          <div style={{ display: 'flex', flexDirection: 'row'}}>
            <Button type='default' onClick={() => this.setState({ intel_group_name: this.state.agent.friendly_name, editable: false, })} style={{ marginRight: '10px' }}>
              CANCEL
            </Button>
            <Button type='primary' onClick={() => updateAgentName()}>
              SAVE
            </Button>
          </div>
        </div>
      )
    } else {
      return (
        <div>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
  				    <h2>{`${this.state.agent.friendly_name ? this.state.agent.friendly_name : this.state.agent.email }`}</h2>
              <Button type='default' onClick={() => this.setState({ editable: true, })}>
                EDIT
              </Button>
          </div>
          <p>{`Actual Email: ${this.state.agent.actual_email}`}</p>
          <p>{`Alias Email: ${this.state.agent.email}`}</p>
        </div>
      )
    }
  }

	render() {
		return (
			<div id='AgentPage' style={comStyles().container}>
        {
          this.renderHeader()
        }
        <Divider />
        {
          this.props.stage_one_complete
          ?
          this.renderOperators()
          :
          <Card loading bordered={false} />
        }
        <Divider />
        {
          this.props.stage_one_complete
          ?
          this.renderProxies()
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
  all_corps: PropTypes.array.isRequired,
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
    all_corps: redux.corps.all_corps,
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
