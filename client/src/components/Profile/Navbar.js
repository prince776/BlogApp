import React, { Component } from 'react'
import { Link, Redirect } from 'react-router-dom'
import './Navbar.css'

class Navbar extends Component {

    constructor(props) {
        super(props);

        this.state = {
            redirectTo: '',
            message: '',
        }
    }

    componentDidMount() {
    }

    onSignOut = () => {

        if (!navigator.onLine) {
            this.setState({ message: 'You need to be online' })
            return;
        }

        this.props.axiosInstance.defaults.withCredentials = true;
        this.props.axiosInstance.post('/api/account/signout').then(res => {
            //if failed to sign in session was broken anyways so redirect
            //if successfully signed in redirect
            //if session will actually be correct but failed it will be automaticallt redirected back here 
            this.setState({
                redirectTo: '/signin'
            })
        });



    }

    render() {

        if (this.state.redirectTo) {
            return <Redirect to={this.state.redirectTo} />
        }

        return (
            <div className='col-md-2 '>
                <nav className="navbar bg-light navbar-light">

                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <Link className="nav-link" to='/user/dashboard'>
                                {this.props.activeLink === 'dashboard' ? <h5 className='text-info'>Dashboard</h5> : <h5>Dashboard</h5>}
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to='/browsePosts'>
                                {this.props.activeLink === 'browsePosts' ? <h5 className='text-info'>Browse Posts</h5> : <h5>Browse Posts</h5>}
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to='/user/profile'>
                                {this.props.activeLink === 'profile' ? <h5 className='text-info'>Profile</h5> : <h5>Profile</h5>}
                            </Link>
                        </li>
                        <hr />
                        <li className="nav-item">
                            <Link className="nav-link" to='/user/createBlog'>
                                {this.props.activeLink === 'createBlog' ? <h5 className='text-info'>Create Blog</h5> : <h5>Create Blog</h5>}
                            </Link>
                        </li>
                        <li className="nav-item">
                            <button onClick={this.onSignOut} className="nav-link btn btn-light" >
                                <h5>Sign Out</h5>
                            </button>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to='/user/createBlog'>
                                {this.state.message}
                            </Link>
                        </li>
                    </ul>
                </nav>
            </div>
        )

    }

}

export default Navbar;