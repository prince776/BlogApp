import React, { Component } from 'react'
import './Header.css'

class Header extends Component {

    state = {

    }

    componentDidMount() {

    }

    render() {

        return (
            <div className='container-fluid'>
                <div className='row bg-info text-white'>
                    <div className='col-6 text-left p-3 m-l-2'>
                        <h4>BLOGGER</h4>
                    </div>
                    <div className='col-6 text-right p-3 m-l-2'>
                        <h4>EASY BLOGGING</h4>
                    </div>
                </div>
            </div>
        )

    }

}

export default Header;