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
            <div className='container-fluid p-5' id='home-div'>

                <div className='row text-black'>
                    <div className='col text-center p-3 m-t-2'>
                        <h1>Free to use Blogger</h1>
                    </div>
                </div>
                <div className='row'>
                    <div className='col text-center '>
                        <Link to='/signin'><button className='btn btn-primary text-center p-3'>SIGN IN TO CREATE A BLOG</button></Link>
                    </div>
                </div>

            </div>
        )
    }

}

export default Home;