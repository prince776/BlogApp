import React, { Component } from 'react'
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

        return (
            <div>



            </div>
        )

    }

}

export default Test;