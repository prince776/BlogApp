import React, { Component } from 'react'
import { Link, Redirect } from 'react-router-dom'
import './Dashboard.css'
import Navbar from '../Navbar';


class Dashboard extends Component {

    constructor(props) {
        super(props);

        this.state = {
            blogPostTitles: [],
            blogPostNames: [],
            message: '',
            username: '',
            deleting: false,
            redirectTo: '',
        }
    }

    componentDidMount() {

        // this.props.params.axiosInstance.defaults.withCredentials = true;
        // this.props.params.axiosInstance.post('/api/blogPost/getMyPosts').then(res => {

        //     if (!res.data.success) {
        //         this.setState({
        //             message: res.data.message
        //         });
        //     }
        //     this.setState({
        //         blogPostNames: res.data.blogPostNames,
        //         blogPostTitles: res.data.blogPostTitles,
        //         username: res.data.username
        //     })

        // })

        this.props.params.postReq("Dashboard", '/api/blogPost/getMyPosts', true).then(res => {

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

    onDelete = (name) => {
        if (this.state.deleting) return;

        this.setState({ deleting: true });

        const { blogPostTitles, blogPostNames } = this.state;

        if (!navigator.onLine) {
            this.setState({ message: "You need to be online to delete it" });
            return;
        }


        this.props.params.axiosInstance.withCredentials = true;

        this.props.params.axiosInstance.post('/api/blogPost/delete'
            , {
                blogPostName: name
            }).then(res => {
                if (res.data.success) {
                    console.log(this.props.params.axiosInstance);
                    this.setState({//remove from here as well if successful
                        blogPostTitles: blogPostTitles.filter((title, index, arr) => {
                            return title != blogPostTitles[blogPostNames.indexOf(name)];
                        }),
                        blogPostNames: blogPostNames.filter((blogPostName, index, arr) => {
                            return blogPostName != name;
                        }),
                        deleting: false,
                    })
                } else {
                    this.setState({ message: res.data.message, deleting: false })
                }

            })

    }

    onEdit = (username, name) => {
        if (!navigator.onLine) {
            this.setState({ message: "You need to be online to Edit it." });
            return;
        }

        this.setState({
            redirectTo: `/blogPosts/${username}/${name}/edit`
        })
    }


    render() {

        const { blogPostNames, blogPostTitles, username } = this.state;

        if (this.state.redirectTo) {
            return <Redirect to={this.state.redirectTo} />
        }

        return (
            <div className='container-fluid'>
                <div className='row p-3'>
                    <Navbar activeLink='dashboard' axiosInstance={this.props.params.axiosInstance} />
                    <div className='col text-center p-5'>

                        <h3 className='text-secondary'>Welcome to Blogger</h3><br />
                        <Link to='/user/createBlog'><button className='btn btn-info'>Create Blog</button></Link>
                        <h6 className='text-center text-primary p-2'>{this.state.message}</h6>

                        <hr />

                        <h4 className='text-secondary'>Your Blog Posts:</h4><br />
                        {/* TODO:SHOW previous blogs */}

                        <table className='table table-hover'>
                            <thead className='thead-dark'>
                                <tr>
                                    <th>Title</th>
                                    <th>BlogPost Name</th>
                                    <th>Actions</th>
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
                                        <td>
                                            <button onClick={this.onDelete.bind(this, name)} className='btn btn-danger m-2'>Delete</button>
                                            <button onClick={this.onEdit.bind(this, username, name)} className='btn btn-info'>Edit</button>
                                        </td>

                                    </tr>
                                )) : <tr><td></td></tr>}

                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        )

    }

}

export default Dashboard;