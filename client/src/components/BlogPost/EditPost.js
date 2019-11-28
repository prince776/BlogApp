import React, { Component } from 'react'
import { Redirect, withRouter } from 'react-router-dom'
import './EditPost.css'
import Navbar from './../Profile/Navbar.js'
import * as toxicity from '@tensorflow-models/toxicity';

class EditPost extends Component {

    constructor(props) {
        super(props);

        this.state = {
            predictionConfidenceThreshold: 0.9,
            redirectTo: '',
            message: '',
            title: '',
            content: '',
            timestamp: '',
            username: '',
            blogPostName: '',
            model: '',
        }
    }

    componentDidMount() {

        this.props.params.axiosInstance.defaults.withCredentials = true;
        if (!this.state.model) {
            this.loadModel().then(() => {
                console.log("Model Loaded");
            });
        }
        this.props.params.axiosInstance.post('/api/account/verify').then(res => {
            if (!res.data.success) {
                this.setState({ redirectTo: '/signin' });
            }
        });

        this.props.params.axiosInstance.post('/api/blogPost/getBlogPostData'
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

    loadModel = async () => {
        this.setState({
            model: await toxicity.load(this.state.predictionConfidenceThreshold)
        })
    }

    classify = async (inputs) => {
        var { model } = this.state;

        const results = await model.classify(inputs);
        return inputs.map((d, i) => {
            const obj = { 'text': d };
            results.forEach((classification) => {
                obj[classification.label] = classification.results[i].match;
            });
            return obj;
        });
    };

    onInputBoxChanged = (e) => {
        this.setState({
            [e.target.name]: e.target.value,
        })
    }

    preCheck = async () => {
        const { title, content } = this.state;

        if (!title) this.setState({ message: "Title can't be empty" });
        else if (!content) this.setState({ message: "Please enter some content" });

        if (!title || !content) return false;

        //Also check toxicity
        this.setState({ message: "Checking toxicity..." })

        var shouldFetch = await this.classify([title, content]).then(obj => {



            if (obj[0].toxicity) this.setState({ message: "BlogPost Title contains toxicity" })
            else if (obj[1].toxicity) this.setState({ message: "BlogPost Content contains toxicity" })

            if (obj[0].toxicity || obj[1].toxicity) {
                return false;
            } else {
                this.setState({ message: "Not Toxic. Now saving blog post..." })
                return true;
            }
        })
        console.log('isToxic' + !shouldFetch)
        return shouldFetch;

    }

    onUpdatePost = () => {
        const { title, content } = this.state;
        var shouldFetch = false;

        this.preCheck().then(fetch => {
            shouldFetch = fetch;
            if (!shouldFetch) return;
            console.log("gonna fetch");

            this.props.params.axiosInstance.defaults.withCredentials = true;
            this.props.params.axiosInstance.post('/api/blogPost/update'
                , {
                    name: this.props.match.params.blogPostName,
                    title: title,
                    content: content
                }).then(res => {
                    this.setState({ message: res.data.message });
                });
        });



    }

    render() {


        if (this.state.redirectTo) {
            return <Redirect to={this.state.redirectTo} />
        }

        return (
            <div className='container-fluid'>
                <div className='row p-3'>
                    <Navbar activeLink='' axiosInstance={this.props.params.axiosInstance} />
                    <div className='col text-center p-5 text-secondary'>
                        <h3 >Editing Blog Post</h3><br />

                        <h6 ><i>Author: {this.state.username}</i></h6>
                        <h6 ><i>Post Name: {this.state.blogPostName}</i></h6>
                        <h6 ><i>Date Created: {this.state.timestamp}</i></h6>
                        <hr />
                        <div className="form-group row">
                            <label className="col-sm-2 col-form-label">Post Title</label>
                            <div className="col-sm-10">
                                <input type="text" name='title' onChange={this.onInputBoxChanged} className="form-control" value={this.state.title} />
                            </div>
                        </div>
                        <br />
                        <div className="form-group row">
                            <label className="col-sm-2 col-form-label">Content</label>
                            <div className="col-sm-10">
                                <textarea className="form-control" name='content' onChange={this.onInputBoxChanged} rows="5" value={this.state.content}></textarea>
                            </div>
                        </div>
                        {this.state.model ? <button type="button" onClick={this.onUpdatePost} className="btn btn-success">Update Post</button> : <button type="button" className="btn btn-warning" disabled>Model Loading</button>}
                        <br />
                        <h6 className='text-center text-info p-2'>{this.state.message}</h6>
                    </div>

                </div>

            </div>
        )

    }

}

export default withRouter(EditPost);