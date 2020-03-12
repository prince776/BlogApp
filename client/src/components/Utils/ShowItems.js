import React, { Component } from 'react'
import { Link } from 'react-router-dom'


class ShowItems extends Component {

    constructor(props) {
        super(props);

        this.state = {
            deleting: false
        }
    }

    componentDidMount() {
    }

    render() {
        var { headings, names, titles, username, routingBase } = this.props
        return (
            <div>
                <table className='table table-hover'>
                    <thead className='thead-dark'>
                        <tr>
                            {/* show all heading */}
                            {headings.map(heading => (
                                <th key={headings.indexOf(heading)}>{heading}</th>
                            ))}
                        </tr>
                    </thead>

                    <tbody>
                        {names ? names.map(name => (
                            <tr key={name} >
                                <td>
                                    <Link to={`/${routingBase}/${username}/${name}`}>
                                        {titles[names.indexOf(name)]}
                                    </Link>
                                </td>
                                <td>
                                    <Link to={`/${routingBase}/${username}/${name}`}>
                                        {name}
                                    </Link>
                                </td>
                            </tr>
                        )) : <tr><td></td></tr>}
                    </tbody>
                </table>
            </div>
        )
    }

}

export default ShowItems;