import React, { Component } from 'react'
import { Link, Redirect } from 'react-router-dom'
import './Dashboard.css'
import Navbar from '../Navbar';
import Posts from './Posts.js'

class Dashboard extends Component {

    constructor(props) {
        super(props);

        this.state = {
            blogPostTitles: [],
            blogPostNames: [],
            message: '',
            username: '',
            redirectTo: '',
            //pagination things
            startIndex: 0,   //default
            endIndex: 0,    //exclusive
            postsPerPage: 5, //const
            currentPostTitles: [],
            currentPostNames: [],
        }
    }

    componentDidMount() {

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
            }, () => {
                this.updatePaginationVars();
            })



            //save all fetch data for offline use.
            var blogPostNames = res.data.blogPostNames;
            if (blogPostNames) {
                for (var i = 0; i < blogPostNames.length; i++) {
                    var blogPostName = blogPostNames[i];
                    this.props.params.postReq("BlogPost", '/api/blogPost/getBlogPostData', false
                        , {
                            username: this.state.username,
                            blogPostName: blogPostName
                        }).then(res => {
                            // console.log(`FETCHED: ${blogPostName}`);
                        })
                }
            }
        })

        //also load profile data
        this.props.params.postReq("Profile", '/api/account/profile', true);

    }

    updatePaginationVars = () => {
        var { blogPostNames, blogPostTitles, startIndex, postsPerPage } = this.state;
        if (blogPostNames) {
            this.setState({
                endIndex: startIndex + postsPerPage,
            }, () => {
                this.setState({
                    currentPostNames: blogPostNames.slice(startIndex, this.state.endIndex),
                    currentPostTitles: blogPostTitles.slice(startIndex, this.state.endIndex)
                })
            })
        }
    }

    render() {

        const { username } = this.state;

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

                        <Posts blogPostNames={this.state.currentPostNames} blogPostTitles={this.state.currentPostTitles} axiosInstance={this.props.params.axiosInstance}
                            username={username} setAState={(name, value) => { this.setState({ [name]: value }) }}
                        />

                    </div>
                </div>

            </div>
        )

    }

}

export default Dashboard;