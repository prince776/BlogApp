import React from 'react'
import { Switch, Route } from 'react-router-dom'

//Components to import
import Home from './components/Home/Home.js'

const Main = () => (
    <Switch>
        <Route exact path='/' component={Home} />
    </Switch>
);

export default Main;