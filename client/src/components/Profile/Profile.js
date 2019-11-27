import React, { Component } from 'react'
import './Profile.css'
import axios from 'axios'
import Navbar from './Navbar.js'

class Profile extends Component {

    constructor(props) {
        super(props);

        this.state = {
            username: '',
            email: '',
            failMessage: '',
        }
    }

    componentDidMount() {

        axios.defaults.withCredentials = true;

        axios.post('http://localhost:8080/api/account/profile').then(res => {
            this.props.params.setLoading(false);
            this.setState({
                username: res.data.username,
                email: res.data.email
            })
            if (!res.data.success) {
                this.setState({ failMessage: 'Failed to fetch data from server!' })
            }
        });

    }

    render() {

        if (this.props.params.isLoading)
            return <div></div>

        return (
            <div>
                <div className='row p-3'>

                    <Navbar activeLink='profile' />

                    <div className='col text-center p-5 text-secondary' >
                        <h3 >Your Profile</h3><hr />
                        <h4>Username: {this.state.username}</h4>
                        <h4>Email: {this.state.email}</h4>
                        <h4 className='text-danger'>{this.state.failMessage}</h4>
                    </div>

                </div>

            </div>
        )

    }

}

export default Profile;