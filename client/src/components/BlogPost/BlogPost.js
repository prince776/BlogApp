import React, { Component } from 'react'
import { Redirect, withRouter } from 'react-router-dom'
import './BlogPost.css'
import Navbar from './../Profile/Navbar.js'

class BlogPost extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isSignedIn: false,
            redirectTo: '',
            message: '',
            title: '',
            content: '',
            timestamp: '',
            username: '',
            blogPostName: '',
        }
    }

    componentDidMount() {

        if (navigator.onLine) {
            this.props.params.axiosInstance.defaults.withCredentials = true;
            this.props.params.axiosInstance.post('/api/account/verify').then(res => {
                if (res.data.success) {
                    this.setState({
                        isSignedIn: true
                    })
                }
            });
        } else {
            this.setState({ isSignedIn: true });//for offline just show that user signed in
        }

        // this.props.params.axiosInstance.post('/api/blogPost/getBlogPostData'
        //     , {
        //         username: this.props.match.params.username,
        //         blogPostName: this.props.match.params.blogPostName
        //     }).then(res => {

        //         if (res.data.success) {
        //             this.setState({
        //                 title: res.data.title,
        //                 content: res.data.content,
        //                 username: res.data.username,
        //                 blogPostName: res.data.blogPostName,
        //                 timestamp: res.data.timestamp
        //             })
        //         } else {
        //             this.setState({
        //                 message: res.data.message
        //             })
        //         }

        //     })

        this.props.params.postReq("BlogPost", '/api/blogPost/getBlogPostData', false
            , {
                username: this.props.match.params.username,
                blogPostName: this.props.match.params.blogPostName
            }).then(res => {

                if (res.data.success) {
                    this.setState({
                        title: res.data.title,
                        content: res.data.content,
                        username: res.data.username,
                        blogPostName: res.data.blogPostName,
                        timestamp: res.data.timestamp
                    })
                } else {
                    this.setState({
                        message: res.data.message
                    })
                }

            })
    }

    onSignIn = () => {
        this.setState({
            redirectTo: '/signin'
        })
    }

    onEdit = () => {
        this.setState({
            redirectTo: `/blogPosts/${this.state.username}/${this.state.blogPostName}/edit`
        })
    }

    render() {

        if (this.state.redirectTo) {
            return <Redirect to={this.state.redirectTo} />
        }

        var sidebar;
        var signInButon;
        var editButton;

        if (this.state.isSignedIn) {
            sidebar = <Navbar activeLink='' axiosInstance={this.props.params.axiosInstance} />
            signInButon = undefined
            editButton = <button onClick={this.onEdit} className='btn btn-info float-right'>Edit</button>

        } else {
            sidebar = undefined;
            signInButon = <button className='btn btn-primary float-right' onClick={this.onSignIn}>Sign In</button>
            editButton = undefined;
        }

        return (
            <div className='container-fluid'>
                <div className='row p-3'>
                    {sidebar}
                    <div className='col text-center p-5 text-secondary'>
                        <h3 >Viewing Blog Post</h3><br />

                        <h6 ><i>Author: {this.state.username}</i></h6>
                        <h6 ><i>Post Name: {this.state.blogPostName}</i></h6>
                        {signInButon}
                        {editButton}
                        {signInButon || editButton ? <br /> : <div></div>}
                        <h6 ><i>Date Created: {this.state.timestamp}</i></h6>
                        <hr />
                        <h4 >Title: {this.state.title}</h4>
                        <br />
                        <h6 className='text-left'  >{this.state.content}</h6>
                        <h5 className='text-danger'>{this.state.message}</h5>
                    </div>

                </div>

            </div>
        )

    }

}

export default withRouter(BlogPost);