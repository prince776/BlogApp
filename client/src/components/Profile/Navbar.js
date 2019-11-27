import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import './Navbar.css'

class Navbar extends Component {

    constructor(props) {
        super(props);

        this.state = {
        }
    }

    componentDidMount() {
    }

    render() {

        return (
            <div className='col-2'>
                <nav className="navbar bg-light navbar-light">

                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <Link className="nav-link" to='/user/dashboard'>
                                {this.props.activeLink == 'dashboard' ? <h5 className='text-info'>Welcome</h5> : <h5>Welcome</h5>}
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to='/user/profile'>
                                {this.props.activeLink == 'profile' ? <h5 className='text-info'>Profile</h5> : <h5>Profile</h5>}
                            </Link>
                        </li>
                        <hr />
                        <li className="nav-item">
                            <Link className="nav-link" to='/user/newBlog'>
                                {this.props.activeLink == 'newBlog' ? <h5 className='text-info'>Create Blog</h5> : <h5>Create Blog</h5>}
                            </Link>
                        </li>
                    </ul>
                </nav>
            </div>
        )

    }

}

export default Navbar;