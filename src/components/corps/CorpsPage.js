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
  List,
  Card,
  Spin,
  Input,
} from 'antd'


class CorpsPage extends Component {

  constructor() {
    super()
    this.state = {
      search_string: '',
    }
  }

  renderCorps() {
    const filtered_corps = this.props.corps.filter(corp => {
      return corp.corporation_id.toLowerCase().indexOf(this.state.search_string.toLowerCase()) > -1 ||
             corp.corporation_name.toLowerCase().indexOf(this.state.search_string.toLowerCase()) > -1
    })
    return (
      <Card bordered={false} style={comStyles().corp_container}>
        <div style={comStyles().header_container}>
          <h2>{`${filtered_corps.length} Agencies`}</h2>
          <Input
            placeholder={`   Search ${this.props.corps.length} Agencies`}
            value={this.state.search_string}
            onChange={e => this.setState({ search_string: e.target.value })}
            style={{ borderRadius: '25px', maxWidth: '50%', }}
            size='large'
          />
        </div>
        <List
          itemLayout='vertical'
          size='large'
          dataSource={filtered_corps}
          renderItem={(item) => {
            return (
              <List.Item
                key={item.corporation_id}
                actions={[<p>{`Created on ${moment(item.created_at).format('lll')}`}</p>, <p>{`Updated on ${moment(item.updated_at).format('lll')}`}</p>]}
                extra={<a>VIEW</a>}
                onClick={() => this.props.history.push(`/app/corps/${item.corporation_id}`)}
              >
                <List.Item.Meta
                  title={`${item.corporation_name}`}
                  description={
                    <div>
                      <p>{`${item.ad_ids && item.ad_ids.length > 0 ? item.ad_ids.length : 0 } Ads`}</p>
                      <p>{`${item.staffs && item.staffs.length > 0 ? item.staffs.length : 0 } Team Members`}</p>
                    </div>
                  }
                />
              </List.Item>
            )
          }}
        />

      </Card>
    )
  }

	render() {
		return (
			<div id='CorpsPage' style={comStyles().container}>
				 {
           this.props.stage_one_complete
           ?
           this.renderCorps()
           :
           <div style={comStyles().loading_container}>
             <Spin />
           </div>
         }
			</div>
		)
	}
}

// defines the types of variables in this.props
CorpsPage.propTypes = {
	history: PropTypes.object.isRequired,
  corps: PropTypes.array.isRequired,
  stage_one_complete: PropTypes.bool.isRequired,
}

// for all optional props, define a default value
CorpsPage.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(CorpsPage)

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
		},
    loading_container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      height: '100%',
    },
    header_container: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    }
	}
}
