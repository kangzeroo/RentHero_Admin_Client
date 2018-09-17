// Compt for copying as a template
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import {
  Switch,
  Route,
  withRouter,
} from 'react-router-dom'
import {
  Icon,
} from 'antd'
import { changeSelectedTab } from '../actions/app/app_actions'
import DesktopSkeleton from './format/desktop/DesktopSkeleton'
import MobileSkeleton from './format/mobile/MobileSkeleton'
import RequireAuth from './auth/RequireAuth'
import AppHome from './home/AppHome'
import AdsPage from './ads/AdsPage'
import AdPage from './ads/AdPage'
import EmailsPage from './emails/EmailsPage'
import AgentsPage from './agents/AgentsPage'
import AgentPage from './agents/AgentPage'
import ProxiesPage from './proxy/ProxiesPage'
import CorpsPage from './corps/CorpsPage'
import CorpPage from './corps/corp_page/CorpPage'
import CreateAgent from './agents/create/CreateAgent'
import SettingsPage from './settings/SettingsPage'
import RegistrationHome from './registration/RegistrationHome'


class AppRoutes extends Component {

  constructor() {
    super()
    this.state = {
      // swidth: screen.width,
    }
  }

  // updateWidth() {
  //   // console.log('updating dimensions...', screen.width)
  //   this.setState({
  //     swidth: screen.width,
  //   })
  // }

  componentWillMount() {
    // this.updateWidth()
    const path = this.props.history.location.pathname
    if (path.startsWith('/app/ads')) {
      this.props.changeSelectedTab('ads')
    } else if (path.startsWith('/app/settings')) {
      this.props.changeSelectedTab('settings')
    } else if (path.startsWith('/app/home')) {
      this.props.changeSelectedTab('home')
    } else if (path.startsWith('/app/agents')) {
      this.props.changeSelectedTab('agents')
    } else if (path.startsWith('/app/proxies')) {
      this.props.changeSelectedTab('proxies')
    }
  }

  // componentDidMount() {
  //   const self = this
  //   window.addEventListener('resize', (e) => {
  //     this.updateWidth()
  //   })
  // }

  // componentWillUnmount() {
  //   const self = this
  //   window.removeEventListener('resize', self.updateWidth)
  // }


  goToRoute(key, path) {
    this.props.changeSelectedTab(key)
    this.props.history.push(path)
  }

	renderRoutes() {
		return (
			<Switch>
        <Route exact path='/app/home' component={RequireAuth(AppHome)} />
        <Route exact path='/app/ads' component={RequireAuth(AdsPage)} />
        <Route exact path='/app/ads/:ad_id' component={RequireAuth(AdPage)} />

        <Route exact path='/app/agents' component={RequireAuth(AgentsPage)} />
        <Route exact path='/app/agents/create' component={RequireAuth(CreateAgent)} />
        <Route exact path='/app/agents/:agent_id' component={RequireAuth(AgentPage)} />

        <Route exact path='/app/corps' component={RequireAuth(CorpsPage)} />
        <Route exact path='/app/corps/:corp_id' component={RequireAuth(CorpPage)} />

        <Route exact path='/app/emails' component={RequireAuth(EmailsPage)} />

        <Route exact path='/app/proxies' component={RequireAuth(ProxiesPage)} />

        <Route exact path='/app/settings' component={RequireAuth(SettingsPage)} />
        <Route exact path='/app/registration' component={RequireAuth(RegistrationHome)} />
      </Switch>
		)
	}

  renderDesktopFormat(navs) {
    return (
      <DesktopSkeleton
        navs={navs}
        routes={this.renderRoutes()}
      />
    )
  }

  renderMobileFormat(navs) {
    return (
      <MobileSkeleton
        navs={navs}
        routes={this.renderRoutes()}
      />
    )
  }

  render() {
    let navs = [
      { key: 'welcome', title: 'Welcome', path: '/welcome', icon: (<i className='material-icons'>home</i>), selectedIcon: (<i className='material-icons'>home</i>) },
      { key: 'login', title: 'Login', path: '/login', icon: (<i className='material-icons'>assignment_ind</i>), selectedIcon: (<i className='material-icons'>assignment_ind</i>) },
    ]
    let desktop_navs = []
    if (this.props.authenticated) {
      navs = [
        { key: 'home', title: 'Home', path: '/app/home', icon: (<Icon type='home' />), selectedIcon: (<Icon type='home' style={{ color: '#ffa751' }} />) },
        { key: 'ads', title: 'Ads', path: '/app/ads', icon: (<Icon type='appstore' />), selectedIcon: (<Icon type='appstore' style={{ color: '#ffa751' }} />) },
        { key: 'corps', title: 'Agencies', path: '/app/corps', icon: (<Icon type='shop' />), selectedIcon: (<Icon type='shop' style={{ color: '#fc67fa' }} />) },
        { key: 'agents', title: 'Agents', path: '/app/agents', icon: (<Icon type='user' />), selectedIcon: (<Icon type='user' style={{ color: '#ffa751' }} />) },
        { key: 'proxies', title: 'Proxies', path: '/app/proxies', icon: (<Icon type='user' />), selectedIcon: (<Icon type='user' style={{ color: '#ffa751' }} />) },
        { key: 'emails', title: 'Emails', path: '/app/emails', icon: (<Icon type='mail' />), selectedIcon: (<Icon type='user' style={{ color: '#ffa751' }} />) },
        { key: 'settings', title: 'Settings', path: '/app/settings', icon: (<Icon type='setting' />), selectedIcon: (<Icon type='setting' style={{ color: '#ffa751' }} />) },
      ]
      desktop_navs = [
        { key: 'home', title: 'Home', path: '/app/home', icon: (<Icon type='home' />) },
        { key: 'ads', title: 'Ads', path: '/app/ads', icon: (<Icon type='appstore' />) },
        { key: 'corps', title: 'Agencies', path: '/app/corps', icon: (<Icon type='shop' />) },
        { key: 'agents', title: 'Agents', path: '/app/agents', icon: (<Icon type='user' />) },
        { key: 'proxies', title: 'Proxies', path: '/app/proxies', icon: (<Icon type='user' />) },
        { key: 'emails', title: 'Emails', path: '/app/emails', icon: (<Icon type='mail' />) },
        { key: 'settings', title: 'Settings', path: '/app/settings', icon: (<Icon type='setting' />) },
      ]
    }
    return (
      <div id='AppRoutes' style={{ position: 'fixed', height: '100%', width: '100%', top: 0, }}>
        {
          screen.width >= 550
          ?
          this.renderDesktopFormat(desktop_navs)
          :
          this.renderMobileFormat(navs)
        }
      </div>
    )
  }
}

// defines the types of variables in this.props
AppRoutes.propTypes = {
	history: PropTypes.object.isRequired,
  authenticated: PropTypes.bool,
  changeSelectedTab: PropTypes.func.isRequired,
}

// for all optional props, define a default value
AppRoutes.defaultProps = {
  authenticated: false,
}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(AppRoutes)

// Get access to state from the Redux store
const mapReduxToProps = (redux) => {
	return {
    authenticated: redux.auth.authenticated,
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
		},
    loadingContainer: {
      fontFamily: 'Helvetica Neue',
      backgroundColor: 'white',
      minHeight: '100vh',
      maxHeight: '100vh',
      minWidth: '100vw',
      maxWidth: '100vw',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    },
    font_logo: {
      fontSize: '2.5rem',
      color: 'rgba(81, 151, 214, 1)',
      fontWeight: 'bold',
      fontFamily: `'Carter One', cursive`,
    },
	}
}
