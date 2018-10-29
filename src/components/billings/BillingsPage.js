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
  Button,
  Divider,
  Table,
  Modal,
} from 'antd'
import { changeSelectedTab } from '../../actions/app/app_actions'
import { getAllProducts } from '../../api/billings/billings_api'
import { saveProductsToRedux } from '../../actions/billings/billings_actions'
import BillConvo from './convos/BillConvo'

class BillingsPage extends Component {

  constructor() {
    super()
    this.state = {
      products: [],
      products_loaded: false,

      toggle_modal: false,
      modal_name: '',              // name of the modal
      context: {},
    }
  }

  componentWillMount() {
    this.props.changeSelectedTab('billings')
  }

  componentWillMount() {
    if (!this.props.products) {
      getAllProducts()
        .then((data) => {
          this.props.saveProductsToRedux(data)
          this.setState({
            products: data,
            products_loaded: true,
          })
        })
        .catch((err) => {
          console.log(err)
        })
    } else {
      this.setState({
        products: this.props.all_products,
        products_loaded: true,
      })
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
    if (modal_name === 'bill_convo') {
      return this.renderModal(context)
    }
  }

  renderModal(context) {
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
        <BillConvo
          convo={context}
          closeModal={() => closeModal()}
        />
      </Modal>
    )
  }


  renderProducts() {
    const columns = [
      {
        title: 'Product ID',
        key: 'id',
        dataIndex: 'id',
      },
      {
        title: 'Name',
        key: 'name',
        dataIndex: 'name',
      },
      {
        title: 'Type',
        key: 'type',
        dataIndex: 'type',
      },
      {
        title: 'Active',
        key: 'active',
        dataIndex: 'active',
        render: active => `${active ? 'Active' : 'Not Active'}`,
      },
      {
        title: 'Description',
        key: 'metadata',
        dataIndex: 'metadata',
        render: metadata => `${metadata.description.length > 50 ? metadata.description.substring(0, 50).concat('...') : metadata.description}`,
      },
      {
        title: 'Created At',
        key: 'created',
        dataIndex: 'created',
        render: created => `${moment.unix(created).format('lll')}`
      },
      {
        title: 'Action',
        key: 'action',
        render: item => (<a onClick={() => this.props.history.push(`/app/billings/products/${item.id}`)}>VIEW</a>)
      }
    ]
    return (
      <div id='Products'>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0 }}>Products</h2>
          <Button type='default' onClick={() => this.props.history.push('/app/billings/products/create')}>
            Create Product
          </Button>
        </div>
        <div>There are two kinds of products: goods and services. Services are for subscriptions so we will only deal with services.</div>
        <div>Products can have more than one plan, reflecting variations in price and duration.</div>
        <Table
          loading={!this.state.products_loaded}
          columns={columns}
          dataSource={this.state.products}
        />
      </div>
    )
  }

  renderBillableConvos() {
    const columns = [
      {
        title: 'Customer ID',
        key: 'customer_id',
        dataIndex: 'customer_id',
      },
      {
        title: 'Customer Email',
        key: 'customer_email',
        dataIndex: 'customer_email',
      },
      {
        title: 'Proxy ID',
        key: 'proxy_id',
        dataIndex: 'proxy_id',
      },
      {
        title: 'Convo ID',
        key: 'convo_id',
        dataIndex: 'convo_id',
        render: convo_id => <a href={`https://ops.renthero.com/app/messages?convo=${convo_id}`} target="_blank">{convo_id}</a>,
      },
      {
        title: 'Last Updated',
        key: 'updated_at',
        dataIndex: 'updated_at',
        render: updated_at => `${moment(updated_at).format('lll')}`,
      },
      {
        title: 'Action',
        key: 'action',
        render: item => (<Button type='primary' onClick={() => this.toggleModal(true, 'bill_convo', item)} style={{ borderRadius: '25px', }}>Send Bill</Button>)
      }
    ]
    return (
      <div>
        <h2>Billable Convos</h2>
        <Table
          columns={columns}
          dataSource={this.props.billable_convos}
        />
      </div>
    )
  }

	render() {
		return (
			<div id='BillingsPage' className='pretty_scrollbar' style={comStyles().scroll}>
				<h1>Billings Page</h1>
        <Divider />
        {
          this.renderProducts()
        }
        <Divider />
        {
          this.renderBillableConvos()
        }
        {
          this.renderAppropriateModal(this.state.modal_name, this.state.context)
        }
			</div>
		)
	}
}

// defines the types of variables in this.props
BillingsPage.propTypes = {
	history: PropTypes.object.isRequired,
  changeSelectedTab: PropTypes.func.isRequired,
  all_products: PropTypes.array,
  saveProductsToRedux: PropTypes.func.isRequired,
  billable_convos: PropTypes.array.isRequired,
}

// for all optional props, define a default value
BillingsPage.defaultProps = {
  all_products: [],
}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(BillingsPage)

// Get access to state from the Redux store
const mapReduxToProps = (redux) => {
	return {
    all_products: redux.billings.all_products,
    billable_convos: redux.billings.billable_convos,
	}
}

// Connect together the Redux store with this React component
export default withRouter(
	connect(mapReduxToProps, {
    changeSelectedTab,
    saveProductsToRedux,
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
    scroll: {
      display: 'flex',
      flexDirection: 'column',
      // flexWrap: 'wrap',
      // maxHeight: '100%',
      minWidth: '100%',
      maxWidth: '100%',
      height: '100%',
      overflowY: 'scroll',
      padding: '20px',
      justifyContent: 'flex-start',
    },
	}
}
