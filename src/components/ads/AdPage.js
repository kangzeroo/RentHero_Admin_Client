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
} from 'antd'
import RudimentaryMap from '../modules/RudimentaryMap'

class AdPage extends Component {

  constructor() {
    super()
    this.state = {
      ad_id: '',
      ad: {},

      loading: true,
    }
  }

  componentWillMount() {
    const ad_id = this.props.location.pathname.slice('/app/ads/'.length)

    this.setState({
      ad_id: ad_id,
    })

    if (this.props.stage_one_complete) {
      this.refreshAd(ad_id)
    }
  }

  componentWillReceiveProps(nextProps) {
		if (this.props.all_ads !== nextProps.all_ads) {
			this.refreshAd(this.state.ad_id)
		}
	}

	refreshAd(ad_id) {
		const ad = this.props.all_ads.filter((ad) => { return ad.ad_id === ad_id })[0]
		if (ad) {
      console.log(ad)
			this.setState({
        ad: ad,
        loading: false,
      })
		} else {
			this.props.history.push('/invalid')
		}
	}

  renderTitleDescription() {
    return (
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2>{`${this.state.ad.ad_title ? this.state.ad.ad_title : this.state.ad.formatted_address }`}</h2>
          <p>{`${this.state.ad.ad_title ? this.state.ad.formatted_address : ''}`}</p>
        </div>
        <div>
          <p>{`Created on ${moment(this.state.ad.created_at).format('lll')}`}</p>
          <p>{`Last updated on ${moment(this.state.ad.updated_at).format('lll')}`}</p>
        </div>
      </div>
    )
  }

  renderDetails() {
    return (
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
        <div>
          <p>{`Title: ${this.state.ad.ad_title}`}</p>
          <p>{`Description: ${this.state.ad.ad_desc}`}</p>
          <p>{`Type: ${this.state.ad.ad_type}`}</p>
          <p>{`Begins: ${moment(this.state.ad.begin_date).format('LLL')}`}</p>
          <p>{`Ends: ${moment(this.state.ad.end_date).format('LLL')}`}</p>
          <a onClick={() => window.open(`https://admin.renthero.com/app/corps/${this.state.ad.corporation_id}`, '_blank')}>{`Owner: ${this.state.ad.corporation_name}`}</a>
        </div>
        <div>
          <p>{`Address: ${this.state.ad.formatted_address}`}</p>
          <RudimentaryMap
            coordinates={{
              gps_x: this.state.ad.gps_x,
              gps_y: this.state.ad.gps_y,
            }}
          />
        </div>
      </div>
    )
  }

  renderAmenities() {
    if (this.state.loading) {
      return (
        <Card bordered={false} loading />
      )
    } else {
      if (this.state.ad.amenities) {
        const amenities = this.state.ad.amenities
        const bedrooms = amenities.filter(am => am.type === 'bedroom').length
        const bathrooms = amenities.filter(am => am.type === 'bathroom').length
        const other_amenities = amenities.filter(am => am.type !== 'bedroom' && am.type !== 'bathroom')
        return (
          <div>
            <h2>Amenities</h2>
            <p>{`Bedrooms: ${bedrooms}`}</p>
            <p>{`Bathrooms: ${bathrooms}`}</p>
            {
              other_amenities.map((am) => {
                return (
                  <p>{`Amenitiy: ${am.title} (${am.type}), Meta: ${am.meta}`}</p>
                )
              })
            }
          </div>
        )
      } else {
        return (
          <p>No amenities specified</p>
        )
      }
    }
  }

  renderLinks() {
    if (this.state.ad.links) {
      return (
        <div>
          <h2>{`${this.state.ad.links.length} Links For Ad`}</h2>
          <ol>
          {
            this.state.ad.links.map((link) => {
              return (
                <li key={link.link_id}><a onClick={() => window.open(`https://${link.link}`, '_blank')}>{link.link}</a></li>
              )
            })
          }
          </ol>
        </div>
      )
    } else {
      return (
        <h2>No Links</h2>
      )
    }
  }

  renderImages() {
    if (this.state.ad.imgs) {
      return (
        <div>
          <h2>{`${this.state.ad.imgs.length} Images`}</h2>
          <List
            itemLayout='horizontal'
            grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 4, xxl: 4 }}
            dataSource={this.state.ad.imgs}
            renderItem={item => {
              return (
                <List.Item key={item}>
                  <Card
                    bordered={false}
                    cover={<img src={item} height='250px' width='250px' />}
                    bodyStyle={{ margin: 0, padding: 0}}
                    style={{ maxHeight: '250px', maxWidth: '250px', }}
                  />
                </List.Item>
              )
            }}
          />

        </div>
      )
    } else {
      return (
        <h2>No Images</h2>
      )
    }
  }

  renderPage() {
    return (
      <div>
      {
        this.renderTitleDescription()
      }
      <Divider />
      {
        this.renderDetails()
      }
      <Divider />
      <br /><br />
      {
        this.renderAmenities()
      }
      <Divider />
      {
        this.renderLinks()
      }
      <Divider />
      {
        this.renderImages()
      }
      </div>
    )
  }


	render() {
		return (
			<div id='AdPage' className='pretty_scrollbar' style={comStyles().scroll} >
        <Card
          bordered={false}
          loading={this.state.loading}
          bodyStyle={{ padding: '0px 10px' }}
        >
          {
            this.state.loading
            ?
            <Card bordered={false} loading />
            :
            this.renderPage()
          }
        </Card>
			</div>
		)
	}
}

// defines the types of variables in this.props
AdPage.propTypes = {
	history: PropTypes.object.isRequired,
  all_ads: PropTypes.array.isRequired,
  stage_one_complete: PropTypes.bool.isRequired,
}

// for all optional props, define a default value
AdPage.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(AdPage)

// Get access to state from the Redux store
const mapReduxToProps = (redux) => {
	return {
    all_ads: redux.ads.all_ads,
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
      padding: '20px',
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
      padding: '15px',
      justifyContent: 'flex-start',
    },
	}
}
