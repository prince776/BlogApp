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
        this.props.params.setLoading(false);
    }

    render() {

        if (this.props.params.isLoading)
            return <div></div>

        return (
            <div>
                Test
            </div>
        )

    }

}

export default withRouter(Test);