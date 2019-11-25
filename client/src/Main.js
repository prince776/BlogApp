import React from 'react'
import { Switch, Route } from 'react-router-dom'

//Components to import
import Home from './components/Home/Home.js'
import SignIn from './components/SignUpSignIn/SignIn.js'
import SignUp from './components/SignUpSignIn/SignUp.js'

const Main = () => (
    <Switch>
        <Route exact path='/' component={Home} />
        <Route exact path='/signin' component={SignIn} />
        <Route exact path='/signup' component={SignUp} />
    </Switch>
);

export default Main;