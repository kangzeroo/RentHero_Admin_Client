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
  Card,
  List,
  Avatar,
  Icon,
} from 'antd'
import { renderProcessedThumbnailSmall } from '../../../api/general/general_api'

class CorpProfile extends Component {

  constructor() {
    super()
    this.state = {
      ads: [],
    }
  }

  componentWillMount() {
    console.log(this.props.corporation)
    const full_ads = this.props.ads.filter((ad) => {
      return this.props.corporation.ad_ids.filter((ad_id) => {
        return ad_id === ad.ad_id
      }).length > 0
    })
    this.setState({
      ads: full_ads,
    })
  }

  renderHeader(corp) {
    return (
      <div style={comStyles().header_container}>
        <h1 style={{ color: 'white', fontWeight: 'bold', fontSize: '3rem' }}>{corp.corporation_name}</h1>
        <p style={{ margin: 0, color: 'white', fontWeight: 'bold' }}>{`Created on ${moment(corp.created_at).format('lll')}`}</p>
        <p style={{ margin: 0, color: 'white', fontWeight: 'bold' }}>{`Last Updated ${moment(corp.updated_at).format('lll')}`}</p>
      </div>
    )
  }

  renderAdmin(corp) {
    return (
      <Card bordered={false}>
        <h2>{`${corp.staffs.length} Team Members`}</h2>
        <List
          itemLayout='horizontal'
          dataSource={corp.staffs}
          renderItem={(item) => {
            return (
              <List.Item
                key={item.staff_id}
                actions={[<p>{`Created on ${moment(item.created_at).format('lll')}`}</p>, <p>{`Last Updated ${moment(item.updated_at).format('lll')}`}</p>]}
              >
                <List.Item.Meta
                  avatar={
                    item.thumbnail
                    ?
                    <Avatar src={item.thumbnail} />
                    :
                    <Avatar style={{ backgroundColor: '#2faded', verticalAlign: 'middle' }}>{item.first_name ? item.first_name[0] : item.email[0]}</Avatar>
                  }
                  title={`${item.first_name} ${item.last_name} ${item.title ? `(${item.title})` : ''}`}
                  description={
                    <div>
                      <p style={{ margin: 0, }}>{`Email: ${item.email}`}</p>
                      <p style={{ margin: 0, }}>{`Phone: ${item.phone}`}</p>
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

  renderAds(corp, ads) {
    return (
      <Card bordered={false}>
        <h2>{`${ads.length} Ads`}</h2>
        <List
          itemLayout='horizontal'
          dataSource={ads}
          renderItem={(item) => {
            return (
              <List.Item
                key={item.ad_id}
                actions={[
                  <p>{`Last Updated ${moment(item.updated_at).format('lll')}`}</p>,
                  <a>VIEW</a>
                ]}
                onClick={() => window.open(`https://admin.renthero.com/app/ads/${item.ad_id}`, '_blank')}
              >
                <List.Item.Meta
                  avatar={
                    item.imgs && item.imgs.length > 0
                    ?
                    <Avatar src={renderProcessedThumbnailSmall(item.imgs[0])} />
                    :
                    <Avatar style={{ backgroundColor: '#2faded', verticalAlign: 'middle' }}>{item.ad_title[0]}</Avatar>
                  }
                  title={`${item.ad_title}`}
                  description={
                    <div>
                      <p>{`Address: ${item.formatted_address}`}</p>
                      <p>{`${item.pricing ? `${item.pricing.price} ${item.pricing.period ? `per ${item.pricing.period}` : ''} ${item.pricing.negotiable ? 'Negotiable' : 'Not Negotiable'}` : ''}`}</p>
                      {
                        item.begin_date
                        ?
                        <p>{`Begins: ${moment(item.begin_date).format('LLL')}, Ends: ${moment(item.end_date).format('LLL')}`}</p>
                        :
                        <div />
                      }
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
			<Card
        bordered={false}
        id='CorpProfile'
        className='pretty_scrollbar'
        style={comStyles().scroll}
        cover={this.renderHeader(this.props.corporation)}
      >
        {
          this.renderAdmin(this.props.corporation)
        }
        <Divider />
        {
          this.renderAds(this.props.corporation, this.state.ads)
        }
			</Card>
		)
	}
}

// defines the types of variables in this.props
CorpProfile.propTypes = {
	history: PropTypes.object.isRequired,
  ads: PropTypes.array.isRequired,
  corporation: PropTypes.object.isRequired,     // passed in
}

// for all optional props, define a default value
CorpProfile.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(CorpProfile)

// Get access to state from the Redux store
const mapReduxToProps = (redux) => {
	return {
    ads: redux.ads.all_ads,
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
      maxHeight: '100%',
      overflowY: 'scroll',
      justifyContent: 'flex-start',
    },
    header_container: {
      backgroundImage: 'linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%)',
      width: '100%',
      height: '300px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    }
	}
}
