import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import './Dashboard.css'
import Navbar from '../Navbar';
import axios from 'axios';


class Dashboard extends Component {

    constructor(props) {
        super(props);

        this.state = {
            blogPostTitles: [],
            blogPostNames: [],
            message: '',
            username: '',
        }
    }

    componentDidMount() {
        this.props.params.setLoading(false);

        axios.defaults.withCredentials = true;
        axios.post('http://localhost:8080/api/blogPost/getMyPosts').then(res => {

            if (!res.data.success) {
                this.setState({
                    message: res.data.message
                });
            }
            this.setState({
                blogPostNames: res.data.blogPostNames,
                blogPostTitles: res.data.blogPostTitles,
                username: res.data.username
            })

        })

    }


    render() {

        const { blogPostNames, blogPostTitles, username } = this.state;

        return (
            <div>
                <div className='row p-3'>
                    <Navbar activeLink='dashboard' />
                    <div className='col text-center p-5'>

                        <h3 className='text-secondary'>Welcome to Blogger</h3><br />
                        <Link to='/user/createBlog'><button className='btn btn-info'>Create Blog</button></Link>
                        <hr />
                        <h4 className='text-secondary'>Your Blog Posts:</h4><br />
                        {/* TODO:SHOW previous blogs */}

                        <table className='table table-hover'>
                            <thead className='thead-dark'>
                                <tr>
                                    <th>Title</th>
                                    <th>BlogPost Name</th>
                                </tr>
                            </thead>

                            <tbody>

                                {blogPostNames ? blogPostNames.map(name => (
                                    <tr key={name} >
                                        <td>
                                            <Link to={`/blogPosts/${username}/${name}`}>
                                                {blogPostTitles[blogPostNames.indexOf(name)]}
                                            </Link>
                                        </td>
                                        <td>
                                            <Link to={`/blogPosts/${username}/${name}`}>
                                                {name}
                                            </Link>
                                        </td>
                                    </tr>
                                )) : <tr><td></td></tr>}

                            </tbody>
                        </table>
                        <h6 className='text-center text-info p-2'>{this.state.message}</h6>
                    </div>
                </div>

            </div>
        )

    }

}

export default Dashboard;