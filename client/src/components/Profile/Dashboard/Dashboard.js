import React, { Component } from 'react'
import './Dashboard.css'
import Navbar from '../Navbar';

class Dashboard extends Component {

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
                <div className='row p-3'>
                    <Navbar activeLink='dashboard' />
                    <div className='col text-center p-5'>

                        <h3 className='text-secondary'>Welcome to Blogger</h3><br />
                        <button className='btn btn-info'>Create Blog</button>
                        <hr />
                        <h4 className='text-secondary'>Your Blogs:</h4>
                        {/* TODO:SHOW previous blogs */}
                    </div>
                </div>

            </div>
        )

    }

}

export default Dashboard;