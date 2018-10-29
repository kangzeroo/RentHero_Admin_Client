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
  Icon,
  Button,
  Divider,
} from 'antd'
import { getAllMessagesForConvo, getSpecificSubscription, } from '../../../api/billings/billings_api'


class BillConvo extends Component {

  constructor() {
    super()
    this.state = {
      messages: [],
      messages_loaded: false,

      calls: [],
      call_units: 0,
      convo_units: 0,
      call_price: 0,
      convo_price: 0,

      subscriptions: [],
      subscriptions_loaded: false,
    }
  }

  componentWillMount() {
    this.refreshSubscriptions()
  }

  refreshMessages() {
    getAllMessagesForConvo(String(this.props.convo.proxy_id), this.props.convo.lead_id)
      .then((data) => {
        console.log(data)
        const messages = data //.filter(m => m.TIMESTAMP > this.state.subscriptions[0].current_period_start && m.TIMESTAMP < this.state.subscriptions[0].current_period_end)
        this.setState({
          messages: messages,
          messages_loaded: true,
          calls: messages.filter(m => m.MEDIUM === 'VOICE' && JSON.parse(m.META).DialCallDuration > 0),
        }, () => {

          this.setState({
            call_units: this.state.calls && this.state.calls.length > 0 ? this.state.calls.reduce((a, b) => Math.ceil(JSON.parse(a.META).DialCallDuration/60.0) + Math.ceil(JSON.parse(b.META).DialCallDuration/60.0)) : 0,
            convo_units: this.state.messages.length > 0 ? 1 : 0,
          }, () => {
            this.setState({
              call_price: this.state.call_units * this.state.subscriptions.filter(sub => sub.plan.metadata.charge_by === 'call')[0].plan.amount/100.0,
              convo_price: this.state.convo_units * this.state.subscriptions.filter(sub => sub.plan.metadata.charge_by === 'convo')[0].plan.amount/100.0,
            }, () => console.log(this.state))
          })
        })
      })
  }

  refreshSubscriptions() {
    getSpecificSubscription(this.props.convo.customer_id)
      .then((data) => {
        console.log(data)
        this.setState({
          subscriptions: data,
          subscriptions_loaded: true,
        })
        return this.refreshMessages()
      })
  }

	render() {
		return (
			<div id='BillConvo' style={comStyles().container}>
				<h1><a href={`https://ops.renthero.com/app/messages?convo=${this.props.convo.conv_id}`}>{this.props.convo.convo_id}</a></h1>
        <div>{`Started Convo: ${moment(this.props.convo.created_at).format('lll')}`}</div>
        <div>{`Last updated: ${moment(this.props.convo.updated_at).format('lll')}`}</div>
        <br /><br />
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'flex-start'}}>
          <div>
            <p style={{ fontWeight: 'bold' }}>Lead Information</p>
            <div>{`Lead_id: ${this.props.convo.lead_id}`}</div>
            <div>{`Name: ${this.props.convo.first_name} ${this.props.convo.last_name}`}</div>
            <div>{`Email: ${this.props.convo.email}`}</div>
            <div>{`Phone: ${this.props.convo.phone}`}</div>
          </div>
          <div>
            <p style={{ fontWeight: 'bold' }}>Customer Information</p>
            <div>{`Customer_id: ${this.props.convo.customer_id}`}</div>
            <div>{`Customer Email: ${this.props.convo.customer_email}`}</div>
          </div>
        </div>
        <br /><br />
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'flex-start'}}>
          <div>
            <p style={{ fontWeight: 'bold' }}>Convo Details</p>
            {
              this.state.messages_loaded
              ?
              <div>
                <div>{`${this.state.messages.length} Total Interations`}</div>
                <div>{`${this.state.messages.filter(m => m.MEDIUM === 'EMAIL').length} Emails`}</div>
                <div>{`${this.state.messages.filter(m => m.MEDIUM === 'SMS').length} SMS`}</div>
                <div>{`${this.state.messages.filter(m => m.MEDIUM === 'VOICE' && JSON.parse(m.META).DialCallDuration > 0).length} Calls`}</div>
              </div>
              :
              <Icon type='loading' />
            }
          </div>
          <div>
            <p style={{ fontWeight: 'bold' }}>{`${this.state.calls.length} Calls`}</p>
            {
              this.state.messages_loaded
              ?
              <div>
              {
                this.state.calls.map((call) => {
                  return (
                    <div key={call.SES_MESSAGE_ID}>{`${moment(call.TIMESTAMP).format('lll')} : ${JSON.parse(call.META).DialCallDuration/60.0} Min`}</div>
                  )
                })
              }
              </div>
              :
              <Icon type='loading' />
            }
          </div>
        </div>
        <br /><br />
        <Divider>Subscriptions</Divider>
          {
            this.state.subscriptions.map((sub) => {
              return (
                <div key={sub.id}>
                  <div style={{ fontWeight: 'bold' }}>{`Subscription to ${sub.plan.nickname} (${sub.id})`}</div>
                  <div>{`Next Payment: ${moment.unix(sub.current_period_end).format('lll')}`}</div>
                  <div>{`Price: ${sub.plan.amount/100.0} ${sub.plan.currency.toUpperCase()} ${sub.plan.metadata.charged}`}</div>
                  <div>{`Units Used: ${sub.plan.metadata.charge_by === 'call' ? this.state.call_units : this.state.convo_units}`}</div>
                  <div>{`Total Price To Pay: $${sub.plan.metadata.charge_by === 'call' ? this.state.call_price : this.state.convo_price}`}</div>
                  <br /><br />
                </div>
              )
            })
          }
			</div>
		)
	}
}

// defines the types of variables in this.props
BillConvo.propTypes = {
	history: PropTypes.object.isRequired,
  convo: PropTypes.object.isRequired,         // passed in
  all_plans: PropTypes.array.isRequired,
}

// for all optional props, define a default value
BillConvo.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(BillConvo)

// Get access to state from the Redux store
const mapReduxToProps = (redux) => {
	return {
    all_plans: redux.billings.all_plans,
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
		}
	}
}
