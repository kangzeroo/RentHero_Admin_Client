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
  Input,
  message,
} from 'antd'
import { getAllCorporations, saveStaffToCorporation, } from '../../api/corp/corp_api'
import { saveCorpsToRedux } from '../../actions/corp/corp_actions'

class AddStaffPopup extends Component {

  constructor() {
    super()
    this.state = {
      email: '',

      saving: false,
    }
  }

  onCancel() {
    this.setState({
      email: '',
      saving: false,
    })
    this.props.closeModal()
  }

  onSave() {
    this.setState({
      saving: true,
    }, () => {
      saveStaffToCorporation(this.props.corp.corporation_id, this.state.email)
        .then((data) => {
          message.success(data.message)
          return getAllCorporations()
        })
        .then((data) => {
          this.props.saveCorpsToRedux(data)
          this.props.closeModal()
        })
    })
  }

	render() {
		return (
			<div id='AddStaffPopup' style={comStyles().container}>
				<h2>{`Add staff to ${this.props.corp.corporation_name}`}</h2>
        <p>{`Add the staff email to this corporation. An invite will not be sent out`}</p>
        <br />
        <p style={{ fontWeight: 'bold' }}>Email Address</p>
        <Input
          placeholder='staff@gmail.com'
          value={this.state.email}
          onChange={e => this.setState({ email: e.target.value })}
        />
        <br /><br />
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <Button type='default' onClick={() => this.onCancel()} disabled={this.state.saving} style={{ borderRadius: '25px' }}>
            CANCEL
          </Button>
          <Button type='primary' onClick={() => this.onSave()} disabled={this.state.saving || this.state.email.length === 0} loading={this.state.saving} style={{ marginLeft: '10px', borderRadius: '25px' }}>
            SAVE
          </Button>
        </div>
			</div>
		)
	}
}

// defines the types of variables in this.props
AddStaffPopup.propTypes = {
	history: PropTypes.object.isRequired,
  corp: PropTypes.object.isRequired,      // passed in
  closeModal: PropTypes.func,               // passed in
  saveCorpsToRedux: PropTypes.func.isRequired,
}

// for all optional props, define a default value
AddStaffPopup.defaultProps = {
  closeModal: () => {},
}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(AddStaffPopup)

// Get access to state from the Redux store
const mapReduxToProps = (redux) => {
	return {

	}
}

// Connect together the Redux store with this React component
export default withRouter(
	connect(mapReduxToProps, {
    saveCorpsToRedux,
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
