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
            postsPerPage: 3, //const
            currentPage: 1,
            totalPosts: 0,
            currentPostTitles: [],
            currentPostNames: [],
            pageNumbers: []
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
                username: res.data.username,
                totalPosts: res.data.totalPosts
            }, () => {
                this.updatePaginationVars(1);
                var pNo = [];
                for (let i = 1; i <= Math.ceil(this.state.totalPosts / this.state.postsPerPage); i++) pNo.push(i); //page numbers
                this.setState({
                    pageNumbers: pNo
                })

                //auto set postsPerPage
                // var postsPerPage = this.state.totalPosts / 10;//100 is max pages
                // this.setState({
                //     postsPerPage: postsPerPage
                // })

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

    updatePaginationVars = (newPageNo) => {
        this.setState({
            currentPage: newPageNo
        }, () => {
            var { currentPage, postsPerPage, blogPostNames, blogPostTitles } = this.state;
            if (blogPostNames) {
                this.setState({
                    currentPostNames: [],
                    currentPostTitles: [],
                }, () => {
                    this.setState({
                        currentPostNames: blogPostNames.slice((currentPage - 1) * postsPerPage, currentPage * postsPerPage),
                        currentPostTitles: blogPostTitles.slice((currentPage - 1) * postsPerPage, currentPage * postsPerPage)
                    })
                })
            }
        })
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

                        <nav>
                            <ul className='text-center pagination'>
                                {this.state.pageNumbers.map(number => (

                                    number === this.state.currentPage ?
                                        <li key={number} className='page-item active activePage'>
                                            <a className='page-link'>
                                                {number}
                                            </a>
                                        </li> :
                                        <li key={number} className='page-item'>
                                            <a onClick={this.updatePaginationVars.bind(this, number)} className='page-link'>
                                                {number}
                                            </a>
                                        </li>

                                ))}
                            </ul>
                        </nav>

                    </div>
                </div>

            </div>
        )

    }

}

export default Dashboard;