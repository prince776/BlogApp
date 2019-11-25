import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import './Home.css'

class Home extends Component {

    state = {

    }

    componentDidMount() {

    }


    render() {
        return (
            <div class='container-fluid p-5' id='home-div'>

                <div class='row text-black'>
                    <div class='col text-center p-3 m-t-2'>
                        <h1>Free to use Blogger</h1>
                    </div>
                </div>
                <div class='row'>
                    <div class='col text-center '>
                        <Link to='/signin'><button class='btn btn-primary text-center p-3'>SIGN IN TO CREATE A BLOG</button></Link>
                    </div>
                </div>

            </div>
        )
    }

}

export default Home;