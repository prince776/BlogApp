import React, { Component } from 'react'
import { Switch, Route } from 'react-router-dom'

//Components to import
import Home from './components/Home/Home.js'
import SignIn from './components/SignUpSignIn/SignIn.js'
import SignUp from './components/SignUpSignIn/SignUp.js'
import Dashboard from './components/Profile/Dashboard/Dashboard.js'
import Profile from './components/Profile/Profile.js'

class Main extends Component {

    constructor(props) {
        super(props);
    }

    render() {

        return (
            <Switch>
                <Route exact path="/" render={() => <Home params={this.props} />} />
                <Route exact path="/signup" render={() => <SignUp params={this.props} />} />
                <Route exact path="/signin" render={() => <SignIn params={this.props} />} />
                <Route exact path="/user/dashboard" render={() => <Dashboard params={this.props} />} />
                <Route exact path="/user/profile" render={() => <Profile params={this.props} />} />
            </Switch>
        );

    }

}

export default Main;