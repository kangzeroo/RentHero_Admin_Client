// Compt for copying as a template
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import {
  Divider,
  Table,
  Button,
  Select,
  message,
} from 'antd'
const Option = Select.Option

import { getProxies, saveProxyToIntGroup, removeProxyFromIntGroup } from '../../api/proxies/proxies_api'
import { saveProxiesToRedux } from '../../actions/proxies/proxies_actions'

class SelectedProxyPopup extends Component {

  constructor() {
    super()
    this.state = {
      // agents: [],
      corp: {},

      group_to_save: '',
      saving: false,

      removing: false,
    }
  }

  componentWillMount() {
    this.refreshProxyCorp()
    // this.setState({
    //   agents: this.props.proxy.agents,
    // })
  }

  // componentWillReceiveProps(nextProps) {
  //   if (this.props.proxy !== nextProps.proxy) {
  //     console.log(nextProps.proxy)
  //     this.setState({
  //       agents: nextProps.proxy.agents,
  //     })
  //   }
  // }

  refreshProxyCorp() {
    const corp = this.props.all_corps.filter((corp) => corp.corporation_id === this.props.proxy.corporation_id)[0]
    this.setState({
      corp: corp,
    }, () => console.log(this.state.corp))
  }

  refreshProxies() {
    getProxies()
      .then((data) => {
        console.log(data)
        this.props.saveProxiesToRedux(data)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  renderIntGroups() {
    const saveIntGroup = () => {
      this.setState({
        saving: true,
      }, () => {
        saveProxyToIntGroup({
          proxy_id: this.props.proxy.proxy_id,
          agent_id: this.state.group_to_save,
        })
        .then((data) => {
          message.success(data.message)
          this.refreshProxies()
          this.setState({
            saving: false,
            group_to_save: '',
          })
          this.props.closeModal()
        })
        .catch((err) => {
          console.log(err)
          message.error(err.response.data)
          this.setState({
            saving: false,
          })
        })
      })
    }
    return (
      <div>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
          <div>{`Part of ${this.props.proxy.agents && this.props.proxy.agents.length ? this.props.proxy.agents.length : 0} Intelligence Groups`}</div>
          <div style={{ display: 'flex', flexDirection: 'row',}}>
            <Select
              showSearch
              style={{ width: 200 }}
              placeholder="Add To Intelligence Group"
              optionFilterProp="children"
              onChange={(a) => this.setState({ group_to_save: a.substring(2) }, () => console.log(this.state.group_to_save))}
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >
              {
                this.props.all_agents.map((agent) => {
                  return (
                    <Option key={agent.agent_id}>{agent.friendly_name}</Option>
                  )
                })
              }
            </Select>
            <Button type='primary' onClick={() => saveIntGroup()} disabled={this.state.group_to_save.length === 0 || this.state.saving} loading={this.state.saving}>
              SAVE
            </Button>


          </div>
        </div>
        {
          this.renderAgentsTable()
        }
      </div>
    )
  }

  removeProxyInt(agent_id) {
    this.setState({
      removing: true,
    }, () => {
      console.log({
        proxy_id: this.props.proxy.proxy_id,
        agent_id: agent_id,
      })
      removeProxyFromIntGroup({
        proxy_id: this.props.proxy.proxy_id,
        agent_id: agent_id,
      })
        .then((data) => {
          message.success(data.message)
          this.refreshProxies()
          this.setState({
            removing: false,
          })
          this.props.closeModal()
        })
        .catch((err) => {
          console.log(err)
          message.error(err.response.data)
          this.setState({
            removing: false,
          })
        })
    })
  }

  renderAgentsTable() {
    const columns = [{
      title: 'Agent ID',
      dataIndex: 'agent_id',
      width: '25%',
    }, {
      title: 'Friendly Name',
      dataIndex: 'friendly_name',
      width: '25%',
    }, {
      title: 'Actual Email',
      dataIndex: 'actual_email',
      width: '25%',
    }, {
      title: 'Remove',
      width: '25%',
      render: (agent) => (
        <Button
          type='danger'
          onClick={() => this.removeProxyInt(agent.agent_id)}
          disabled={this.state.removing}
          loading={this.state.removing}>
          REMOVE
        </Button>
        ),
    }]
    return (
      <Table
        columns={columns}
        dataSource={this.props.proxy.agents}
        loading={this.state.loading}
      />
    )
  }



	render() {
		return (
			<div id='SelectedProxyPopup' style={comStyles().container}>
				<h2>{`PROXY_ID: ${this.props.proxy.proxy_id}`}</h2>
        <p>{`Proxy Email: ${this.props.proxy.proxy_email}`}</p>
        <p>{`Proxy Phone: ${this.props.proxy.proxy_phone}`}</p>
        <Divider>Corporation of Proxy</Divider>
        <h2>{`Corporation: ${this.state.corp.corporation_name}`}</h2>
        <Divider>Associated Intelligence Groups</Divider>
        {
          this.renderIntGroups()
        }
			</div>
		)
	}
}

// defines the types of variables in this.props
SelectedProxyPopup.propTypes = {
	history: PropTypes.object.isRequired,
  all_corps: PropTypes.array.isRequired,
  all_agents: PropTypes.array.isRequired,
  proxy: PropTypes.object.isRequired,     // passed in
  closeModal: PropTypes.func.isRequired,  // passed in
  saveProxiesToRedux: PropTypes.func.isRequired,
}

// for all optional props, define a default value
SelectedProxyPopup.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(SelectedProxyPopup)

// Get access to state from the Redux store
const mapReduxToProps = (redux) => {
	return {
    all_corps: redux.corps.all_corps,
    all_agents: redux.agents.all_agents,
	}
}

// Connect together the Redux store with this React component
export default withRouter(
	connect(mapReduxToProps, {
    saveProxiesToRedux,
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
