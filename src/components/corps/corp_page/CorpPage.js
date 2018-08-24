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
} from 'antd'
import CorpProfile from './CorpProfile'

class CorpPage extends Component {

  constructor() {
    super()
    this.state = {
      corporation_id: '',
      corporation: {},

      loading: true,
    }
  }

  componentWillMount() {
    const corporation_id = this.props.location.pathname.slice('/app/corps/'.length)

    this.setState({
      corporation_id: corporation_id,
    })

    if (this.props.stage_one_complete) {
      this.refreshCorp(corporation_id)
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.corps !== nextProps.corps) {
      this.refreshCorp(this.state.corporation_id)
    }
  }

  refreshCorp(corporation_id) {
    const corp = this.props.corps.filter((corp) => { return corp.corporation_id === corporation_id })[0]
    if (corp) {
      console.log(corp)
      this.setState({
        corporation: corp,
        loading: false,
      })
    } else {
      this.props.history.push('/invalid')
    }
  }

	render() {
		return (
			<div id='CorpPage' style={comStyles().container}>
				{
          this.state.loading
          ?
          <Card loading bordered={false} />
          :
          <CorpProfile
            corporation={this.state.corporation}
          />
        }
			</div>
		)
	}
}

// defines the types of variables in this.props
CorpPage.propTypes = {
	history: PropTypes.object.isRequired,
  corps: PropTypes.array.isRequired,
  stage_one_complete: PropTypes.bool.isRequired,
}

// for all optional props, define a default value
CorpPage.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(CorpPage)

// Get access to state from the Redux store
const mapReduxToProps = (redux) => {
	return {
    corps: redux.corps.all_corps,
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
		}
	}
}
