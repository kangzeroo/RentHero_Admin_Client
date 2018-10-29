// Higher Order Compt for initializing actions upon AppRoot load

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { retrieveStaffFromLocalStorage } from '../api/aws/aws-cognito'
import { dispatchActionsToRedux } from '../actions/system/system_actions'
import {
	saveStaffProfileToRedux,
	authenticateStaff,
	authenticationLoaded,
	forwardUrlLocation,
	saveCorporationProfileToRedux,
} from '../actions/auth/auth_actions'
import { stageOneComplete } from '../actions/app/app_actions'
import {
	saveAgentsToRedux, saveOperatorsToRedux,
} from '../actions/agents/agents_actions'
import {
	saveAdsToRedux,
} from '../actions/ads/ads_actions'
import {
	redirectPath,
	setLanguageFromLocale,
	checkIfPartOfRoutes,
} from '../api/general/general_api'
import {
	getAdminProfile,
} from '../api/auth/auth_api'
import {
	getAgents, getOperators,
} from '../api/agents/agents_api'
import {
	getAds,
} from '../api/ads/ads_api'
import {
	getAllCorporations,
} from '../api/corp/corp_api'
import {
	saveCorpsToRedux,
} from '../actions/corp/corp_actions'
import { getProxies } from '../api/proxies/proxies_api'
import { saveProxiesToRedux } from '../actions/proxies/proxies_actions'
import { getAllBillableConvos, getAllPlans, } from '../api/billings/billings_api'
import { saveBillableConvosToRedux, savePlansToRedux, } from '../actions/billings/billings_actions'

// this 'higher order component'(HOC) creator takes a component (called ComposedComponent)
// and returns a new component with added functionality
export default (ComposedComponent) => {
	class AppRootMechanics extends Component {

    componentWillMount() {
			// check if staff is already authenticated
			this.checkIfStaffLoggedIn()

			// do stuff based on the URL
			this.executeOnURL()
    }

		checkIfStaffLoggedIn() {
			// grab the url that was given, will be used in this,saveStaffProfileToRedux()
			let location = this.props.location.pathname + this.props.location.search + this.props.location.hash
			if (location === '/login') {
				location = '/'
			}
			retrieveStaffFromLocalStorage()
				.then((staff) => {
					console.log(staff)
					console.log('kz trippin balls')
					console.log(location)
					return getAdminProfile(staff.IdentityId, {})
				})
				.then((data) => {
					console.log(data)
					if (location === '/') {
						location = '/app/home'
					}
					// if they have, then we'll auto log them in
					this.props.history.push(location)
					return this.saveStaffProfileToRedux(data.profile, location)
				})
				.catch((err) => {
					// if not then we do nothing
					console.log('kz tripping shit')
					console.log(err)
					this.props.forwardUrlLocation(location)
					this.props.history.push(location)
					this.props.authenticateStaff(null)
					this.props.authenticationLoaded()
				})
		}

		saveStaffProfileToRedux(staff, location) {
			let app_location = location
			this.props.saveStaffProfileToRedux(staff)
			this.props.authenticateStaff(staff)
			this.props.authenticationLoaded()

			return this.stageOneData()
				.then((results) => {
					console.log(results)
					const ads = results[0]
					const agents = results[1]
					const operators = results[2]
					const corps = results[3]
					const proxies = results[4]
					const convos = results[5]
					const plans = results[6]
					this.props.saveAdsToRedux(ads)
					this.props.saveAgentsToRedux(agents)
					this.props.saveOperatorsToRedux(operators)
					this.props.saveCorpsToRedux(corps)
					this.props.saveProxiesToRedux(proxies)
					this.props.saveBillableConvosToRedux(convos)
					this.props.savePlansToRedux(plans)
					this.props.stageOneComplete()
					this.props.history.push(app_location)
				})
		}

		stageOneData() {
			const initials = [
				getAds(),
				getAgents(),
				getOperators(),
				getAllCorporations(),
				getProxies(),
				getAllBillableConvos(),
				getAllPlans(),
			]
			console.log(initials)
			return Promise.all(initials)
		}

		executeOnURL() {
			// grab the url that was given
			const pathname = this.props.location.pathname
			const search = this.props.location.search
			const hash = this.props.location.hash
			// take the path in the url and go directly to that page and save to redux any actions necessary
			if (pathname !== '/') {
				// use forwardUrlLocation when you have a path that requires a login first (privately available)
				// use PossibleRoutes.js when you have a path that is publically available
				this.props.forwardUrlLocation(pathname + search + hash)
				// if not, then we do nothing
				redirectPath(pathname + search + hash).then(({ path, actions }) => {
					// path = '/sage-5'
					// actions = [ { type, payload }, { type, payload } ]
					this.props.dispatchActionsToRedux(actions)
					this.props.history.push(path)
				})
			}
		}

		render() {
			// the rendered composed component, with props passed through
			return <ComposedComponent id='AppRootKernal' {...this.props} />
		}
	}

  // defines the types of variables in this.props
  AppRootMechanics.propTypes = {
  	history: PropTypes.object.isRequired,
		forwardUrlLocation: PropTypes.func.isRequired,
		saveStaffProfileToRedux: PropTypes.func.isRequired,
		authenticateStaff: PropTypes.func.isRequired,
		saveCorporationProfileToRedux: PropTypes.func.isRequired,
		dispatchActionsToRedux: PropTypes.func.isRequired,
		stageOneComplete: PropTypes.func.isRequired,
		authenticationLoaded: PropTypes.func.isRequired,
		saveAdsToRedux: PropTypes.func.isRequired,
		saveAgentsToRedux: PropTypes.func.isRequired,
		saveCorpsToRedux: PropTypes.func.isRequired,
		saveOperatorsToRedux: PropTypes.func.isRequired,
		saveProxiesToRedux: PropTypes.func.isRequired,
		saveBillableConvosToRedux: PropTypes.func.isRequired,
		savePlansToRedux: PropTypes.func.isRequired,
  }

  // for all optional props, define a default value
  AppRootMechanics.defaultProps = {

  }

	const mapStateToProps = (redux) => {
		return {
		}
	}

	// we nest our custom HOC to connect(), which in itself is a HOC
	// we can actually nest HOC infinitely deep
	return withRouter(
		connect(mapStateToProps, {
			forwardUrlLocation,
			saveStaffProfileToRedux,
			authenticateStaff,
			saveCorporationProfileToRedux,
			dispatchActionsToRedux,
			stageOneComplete,
			authenticationLoaded,
			saveAdsToRedux,
			saveAgentsToRedux,
			saveCorpsToRedux,
			saveOperatorsToRedux,
			saveProxiesToRedux,
			saveBillableConvosToRedux,
			savePlansToRedux,
    })(AppRootMechanics)
	)
}

// Pseudo-code demonstrating how to use the higher order component (HOC)
/*
	// In some other location (not in this file), we want to use this HOC...
	import AppRootMechanics	// The HOC
	import Resources		// The component to be wrapped
	const ComposedComponent = AppRootMechanics(Resources);

	// In some render method...
	<ComposedComponent />

	// <ComposedComponent> actually renders the AppRootMechanics class, which renders the composed component
	// This 2 layer method is powerful because when we pass in props to <ComposedComponent> like below:
	<ComposedComponent propA={propA} />
	// we can pass those props into the 2nd layer (composed component) using a correct 'this' reference to the 1st layer
*/
