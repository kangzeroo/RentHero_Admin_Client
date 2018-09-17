// Compt for copying as a template
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import {
 Card,
 Table,
 Modal,
} from 'antd'
import SelectedProxyPopup from './SelectedProxyPopup'

class ProxiesPage extends Component {

  constructor() {
    super()
    this.state = {
      toggle_modal: false,
      modal_name: '',              // name of the modal
      context: {},
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
    if (modal_name === 'selected_proxy') {
      return this.renderSelectProxyModal(context)
    } else if (modal_name === 'add_proxy') {
      return this.renderAddProxyModal(context)
    }
  }

  renderModal() {
    const closeModal = () => {
      this.toggleModal(false)
      // this.refreshAgent(this.state.agent_id)
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

  renderSelectProxyModal(proxy) {
    const closeModal = () => {
      this.toggleModal(false)
      // this.refreshAgent(this.state.agent_id)
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

  renderProxiesTable() {
    const columns = [{
      title: 'Proxy ID',
      key: 'proxy_id',
      dataIndex: 'proxy_id',
      width: '20%',
    }, {
      title: 'Corporation Name',
      dataIndex: 'corporation_name',
      width: '20%',
    }, {
      title: 'Proxy Email',
      dataIndex: 'proxy_email',
      width: '20%',
    }, {
      title: 'Proxy Phone',
      dataIndex: 'proxy_phone',
      width: '20%',
    }, {
      title: 'Intelligence Groups',
      render: (proxy) => `${proxy.agents.map(a => a.friendly_name).join(', ') }`,
      width: '20%',
    }]
    return (
      <Table
        columns={columns}
        dataSource={this.props.proxies}
        loading={!this.props.stage_one_complete}
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

	render() {
		return (
			<Card id='ProxiesPage' style={comStyles().scroll} className='pretty_scrollbar' bordered={false} loading={!this.props.stage_one_complete}>
				<h1>{`${this.props.proxies && this.props.proxies.length > 0 ? this.props.proxies.length : 0} Proxies`}</h1>
        {
          this.renderProxiesTable()
        }
        {
          this.renderAppropriateModal(this.state.modal_name, this.state.context)
        }
			</Card>
		)
	}
}

// defines the types of variables in this.props
ProxiesPage.propTypes = {
	history: PropTypes.object.isRequired,
  proxies: PropTypes.array.isRequired,
  stage_one_complete: PropTypes.bool.isRequired,
}

// for all optional props, define a default value
ProxiesPage.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(ProxiesPage)

// Get access to state from the Redux store
const mapReduxToProps = (redux) => {
	return {
    proxies: redux.corps.all_proxies,
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
		},
    scroll: {
			display: 'flex',
			flexDirection: 'column',
			// flexWrap: 'wrap',
			// maxHeight: '100%',
			minWidth: '100%',
			maxWidth: '100%',
			height: '100%',
			overflowY: 'scroll',
			// padding: '15px',
			justifyContent: 'flex-start',
		  padding: '20px',
		},
	}
}
