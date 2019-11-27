import React, { Component } from 'react'
import './CreateBlog.css'
import Navbar from './../Navbar.js'
import axios from 'axios';

class CreateBlog extends Component {

    constructor(props) {
        super(props);

        this.state = {
            name: '',
            title: '',
            content: '',
            message: '',
        }
    }

    componentDidMount() {
        this.props.params.setLoading(false);
    }

    onInputBoxChanged = (e) => {
        this.setState({
            [e.target.name]: e.target.value,
        })
    }

    preCheck = () => {
        const { name, title, content } = this.state;

        if (!name) this.setState({ message: "Name can't be empty" });
        else if (!title) this.setState({ message: "Title can't be empty" });
        else if (!content) this.setState({ message: "Please enter some content" });

        if (!name || !title || !content) return false;
        return true;

    }

    onPost = () => {
        const { name, title, content } = this.state;

        var shouldFetch = this.preCheck();
        if (!shouldFetch) return;

        axios.defaults.withCredentials = true;

        axios.post('http://localhost:8080/api/blogPost/create'
            , {
                name: name,
                title: title,
                content: content
            }).then(res => {

                this.setState({ message: res.data.message });


            });

    }

    render() {

        if (this.props.params.isLoading)
            return <div></div>

        return (
            <div>
                <div className='row p-3'>

                    <Navbar activeLink='createBlog' />

                    <div className='col text-center p-5 text-secondary' >
                        <h3>Create Your Blog Post</h3>
                        <hr />
                        <form className='p-4 m-5'>
                            <div className="form-group row">
                                <label className="col-sm-2 col-form-label">Post Name</label>
                                <div className="col-sm-10">
                                    <input type="text" name='name' onChange={this.onInputBoxChanged} className="form-control" placeholder="Enter Post Name Here" />
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-sm-2 col-form-label">Title</label>
                                <div className="col-sm-10">
                                    <input type="text" name='title' onChange={this.onInputBoxChanged} className="form-control" placeholder="Enter Title here" />
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-sm-2 col-form-label">Content</label>
                                <div className="col-sm-10">
                                    <textarea class="form-control" name='content' onChange={this.onInputBoxChanged} rows="5"></textarea>
                                </div>
                            </div>

                            <button type="button" onClick={this.onPost} className="btn btn-warning">Post</button>

                            <h6 className='text-center text-info'>{this.state.message}</h6>
                        </form>

                    </div>

                </div>

            </div>
        )

    }

}

export default CreateBlog;