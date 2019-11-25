import React, { Component } from 'react'
import './Header.css'

class Header extends Component {

    state = {

    }

    componentDidMount() {

    }

    render() {

        return (
            <div class='container-fluid'>
                <div class='row bg-info text-white'>
                    <div class='col-6 text-left p-3 m-l-2'>
                        BLOGGER
                    </div>
                    <div class='col-6 text-right p-3 m-l-2'>
                        EASY BLOGGING
                    </div>
                </div>
            </div>
        )

    }

}

export default Header;