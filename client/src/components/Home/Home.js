import React, { Component } from 'react'
import './Home.css'

class Home extends Component {

    state = {

    }

    componentDidMount() {

    }


    render() {
        return (
            <div class='text-white'>

                <div class='row'>
                    <div class='col-6 text-left p-3 m-l-2'>
                        BLOGGER
                    </div>
                    <div class='col-6 text-right p-3 m-r-2'>
                        SIGN IN
                    </div>
                </div>

                <div class='row'>
                    <div class='col text-center p-3 m-t-2'>
                        <h1>Free to use Blogger</h1>
                    </div>
                </div>

                <div class='row justify-content-center p-3'>
                    <button class='btn btn-primary text-center'>Create Blog</button>
                </div>

            </div>
        )
    }

}

export default Home;