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
  Form,
  message,
} from 'antd'
import { insertProduct } from '../../../api/billings/billings_api'
import { changeSelectedTab } from '../../../actions/app/app_actions'
import { saveProductsToRedux } from '../../../actions/billings/billings_actions'

class CreateProductPage extends Component {

  constructor() {
    super()
    this.state = {
      name: '',
      type: '',
      description: '',

      saving: false,
    }
    this.allowed_types = ['service']
  }

  componentWillMount() {
    this.setState({
      type: this.allowed_types[0],
    })
    this.props.changeSelectedTab('billings')
  }

  saveProduct() {
    this.setState({
      saving: true,
    })
    insertProduct({
      name: this.state.name,
      type: this.state.type,
      description: this.state.description,
    })
    .then((data) => {
      console.log(data)
      message.success(data.message)
      this.setState({
        saving: false,
      })
      return this.props.saveProductsToRedux(data)
    })
    .then(() => {
      this.props.history.push('/app/billings')
    })
    .catch((err) => {
      console.log(err)
      message.error(err.response.data)
      this.setState({
        saving: false,
      })
    })
  }

  renderProductForm() {
    return (
      <Form>
        <Form.Item label='Product Name'>
          <p>the product’s name, meant to be displayable to the customer.</p>
          <Input
            placeholder='Monthly Conversation Pricing'
            value={this.state.name}
            onChange={e => this.setState({ name: e.target.value, })}
            disabled={this.state.saving}
          />
        </Form.Item>
        <Form.Item label='Product Type'>
          <p>the product’s type, which should be service when working with subscriptions.</p>
          <Input
            value={this.state.type}
            disabled
          />
        </Form.Item>
        <Form.Item label='Product Description'>
          <p>a description of the product, for our own reference.</p>
          <Input.TextArea
            rows={3}
            placeholder='This is a my product...'
            value={this.state.description}
            onChange={e => this.setState({ description: e.target.value, })}
            disabled={this.state.saving}
          />
        </Form.Item>
        <Form.Item>
          <Button type='default' onClick={() => this.props.history.push('/app/billings')} disabled={this.state.saving} style={{ borderRadius: '25px', marginRight: '10px' }}>
            Cancel
          </Button>
          <Button type='primary' onClick={() => this.saveProduct()} disabled={this.state.saving || this.state.name.length == 0} loading={this.state.saving} style={{ borderRadius: '25px' }}>
            Save Product
          </Button>
        </Form.Item>
      </Form>
    )
  }

	render() {
		return (
			<div id='CreateProductPage' style={comStyles().container}>
				 <h1>Create Product</h1>
         <p>{`There are two kinds of products: goods and services. Services are for subscriptions so we will only deal with services.\nProducts can have more than one plan, reflecting variations in price and duration.`}</p>
         {
           this.renderProductForm()
         }
      </div>
		)
	}
}

// defines the types of variables in this.props
CreateProductPage.propTypes = {
	history: PropTypes.object.isRequired,
  changeSelectedTab: PropTypes.func.isRequired,
}

// for all optional props, define a default value
CreateProductPage.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(CreateProductPage)

// Get access to state from the Redux store
const mapReduxToProps = (redux) => {
	return {

	}
}

// Connect together the Redux store with this React component
export default withRouter(
	connect(mapReduxToProps, {
    changeSelectedTab,
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
