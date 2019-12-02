import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import './Header.css'

class Header extends Component {

    state = {
    }

    componentDidMount() {

    }



    render() {

        // var signInButton;
        var buttonHeader;
        if (!this.props.username) {
            buttonHeader = <Link to='/signin'><button className='btn btn-primary text-center p-3'>Sign In</button></Link>
        } else {
            buttonHeader = <Link to='/user/profile'><button className='btn btn-primary text-center p-2'>{this.props.username}</button></Link>;
        }


        return (
            <div className='container-fluid'>
                <div className='row bg-info text-white'>
                    <div className='col-6 text-left p-3 m-l-2'>
                        <h4>BLOGGER</h4>
                    </div>
                    <div className='col-6 text-right p-3 m-l-2'>
                        {buttonHeader}
                    </div>
                </div>
            </div>
        )

    }

}

export default Header;