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
        this.props.params.setLoading(false);

        this.props.params.axiosInstance.defaults.withCredentials = true;
        this.props.params.axiosInstance.post('/api/account/verify').then(res => {
            this.props.params.setLoading(false);
            if (res.data.success) {
                this.setState({
                    isSignedIn: true
                })
            }
        });

        this.props.params.axiosInstance.post('/api/blogPost/getBlogPostData'
            , {
                username: this.props.match.params.username,
                blogPostName: this.props.match.params.blogPostName
            }).then(res => {
                this.props.params.setLoading(false);

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

    render() {

        if (this.props.params.isLoading)
            return <div></div>

        if (this.state.redirectTo) {
            return <Redirect to={this.state.redirectTo} />
        }

        var sidebar;
        var signInButon;

        if (this.state.isSignedIn) {
            sidebar = <Navbar activeLink='' />
            signInButon = undefined
        } else {
            sidebar = undefined;
            signInButon = <button className='btn btn-primary float-right' onClick={this.onSignIn}>Sign In</button>
        }

        return (
            <div>
                <div className='row p-3'>
                    {sidebar}
                    <div className='col text-center p-5 text-secondary'>
                        <h3 >Viewing Blog Post</h3><br />

                        <h6 ><i>Author: {this.state.username}</i></h6>
                        <h6 ><i>Post Name: {this.state.blogPostName}</i></h6>
                        {signInButon}
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