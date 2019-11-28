import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import './Test.css'

class Test extends Component {

    constructor(props) {
        super(props);

        this.state = {

        }
    }

    componentDidMount() {
    }

    render() {

        return (
            <div>
                Test
            </div>
        )

    }

}

export default withRouter(Test);