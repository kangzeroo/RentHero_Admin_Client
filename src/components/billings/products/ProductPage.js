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
  Table,
} from 'antd'
import { changeSelectedTab } from '../../../actions/app/app_actions'
import { getSpecificProduct, getAllPlans } from '../../../api/billings/billings_api'
import { saveProductsToRedux } from '../../../actions/billings/billings_actions'

class ProductPage extends Component {

  constructor() {
    super()
    this.state = {
      product_id: '',
      product: {},
      product_loaded: false,

      plans: [],
      plans_loaded: false,

      saving: false,
    }
  }

  componentWillMount() {
    this.props.changeSelectedTab('billings')
    const product_id = this.props.location.pathname.slice('/app/billings/products/'.length)
    console.log(product_id)

    this.setState({
      product_id: product_id,
    }, () => {
      if (this.props.all_products && this.props.all_products.length > 0) {
        this.refreshProducts(product_id)
      } else {
        getSpecificProduct(this.state.product_id)
          .then((data) => {
            console.log(data)
            this.setState({
              product: data,
              product_loaded: true,
            })
          })
      }
    })

    this.refreshPlans()
  }

  refreshPlans() {
    getAllPlans()
      .then((data) => {
        this.setState({
          plans: data.filter(plan => plan.product === this.state.product_id),
          plans_loaded: true,
        })
      })
      .catch((err) => {
        console.log(err)
      })
  }

  refreshProducts(product_id) {
    const product = this.props.all_products.filter((product) => { return product.id === product_id })[0]
    console.log(product)
    if (product) {
      this.setState({
        product: product,
        product_loaded: true,
      })
    } else {

    }
  }

  renderTitle() {
    return (
      <div>
        <h1>{`${this.state.product.name} (${this.state.product.id})`}</h1>
        <p>{this.state.product.metadata ? this.state.product.metadata.description : null}</p>
        <p>{moment.unix(this.state.product.created).format('lll')}</p>
      </div>
    )
  }

  renderPlans() {
    const columns = [
      {
        title: 'Plan ID',
        key: 'id',
        dataIndex: 'id',
      },
      {
        title: 'Nickname',
        key: 'nickname',
        dataIndex: 'nickname',
      },
      {
        title: 'Active',
        key: 'active',
        dataIndex: 'active',
        render: active => `${active ? 'Active' : 'Not Active'}`,
      },
      {
        title: 'Amount',
        key: 'amount',
        render: item => `$${item.amount/100.00} ${item.currency.toUpperCase()} ${item.billing_scheme.replace('_', ' ')}`
      },
      {
        title: 'Billing Interval',
        key: 'interval',
        dataIndex: 'interval',
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
        render: item => (<a onClick={() => this.props.history.push(`/app/billings/plans/${item.id}`)}>VIEW</a>)
      }
    ]
    return (
      <div>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }}>
          <h2 style={{ margin: 0 }}>Plans</h2>
          <Button type='default' onClick={() => this.props.history.push('/app/billings/plans/create')}>Create Plan</Button>
        </div>
        <p>Plans are at the heart of subscriptions, establishing the billing cycle, currency, and base cost. Every plan is attached to a product, which represents the application or service offered to customers. Products can have more than one plan, reflecting variations in price and duration-such as monthly and annual pricing at different rates.</p>
        <Table
          loading={!this.state.plans_loaded}
          columns={columns}
          dataSource={this.state.plans}
        />
      </div>
    )
  }

	render() {
		return (
			<div id='ProductPage' className='pretty_scrollbar' style={comStyles().scroll}>
				{
          this.renderTitle()
        }
        <Divider />
        {
          this.renderPlans()
        }
			</div>
		)
	}
}

// defines the types of variables in this.props
ProductPage.propTypes = {
	history: PropTypes.object.isRequired,
  changeSelectedTab: PropTypes.func.isRequired,
  saveProductsToRedux: PropTypes.func.isRequired,
  all_products: PropTypes.array,
}

// for all optional props, define a default value
ProductPage.defaultProps = {
  all_products: [],
}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(ProductPage)

// Get access to state from the Redux store
const mapReduxToProps = (redux) => {
	return {
    all_products: redux.billings.all_products,
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
      padding: '20px'
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
