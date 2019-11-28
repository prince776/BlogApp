import React, { Component } from 'react'
import './CreateBlog.css'
import Navbar from './../Navbar.js'
import * as toxicity from '@tensorflow-models/toxicity';

class CreateBlog extends Component {

    constructor(props) {
        super(props);

        this.state = {
            predictionConfidenceThreshold: 0.9,
            model: '',
            name: '',
            title: '',
            content: '',
            message: '',
            toxic: false,
            toxicityType: ''
        }
    }

    componentDidMount() {
        if (!this.state.model) {
            this.loadModel().then(() => {
                console.log("Model Loaded");
            });
        }
    }

    loadModel = async () => {
        this.setState({
            model: await toxicity.load(this.state.predictionConfidenceThreshold)
        })
        // this.classify(['hi there', 'you suck']).then(obj => {
        //     console.log(obj[0]);
        // })
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
        const { name, title, content } = this.state;

        if (!name) this.setState({ message: "Name can't be empty" });
        else if (!title) this.setState({ message: "Title can't be empty" });
        else if (!content) this.setState({ message: "Please enter some content" });

        if (!name || !title || !content) return false;

        //Also check toxicity
        this.setState({ message: "Checking toxicity..." })

        var shouldFetch = await this.classify([name, title, content]).then(obj => {



            if (obj[0].toxicity) this.setState({ message: "BlogPost Name contains toxicity" })
            else if (obj[1].toxicity) this.setState({ message: "BlogPost Title contains toxicity" })
            else if (obj[2].toxicity) this.setState({ message: "BlogPost Content contains toxicity" })

            if (obj[0].toxicity || obj[1].toxicity || obj[2].toxicity) {
                return false;
            } else {
                this.setState({ message: "Not Toxic. Now saving blog post..." })
                return true;
            }
        })
        console.log('isToxic' + !shouldFetch)
        return shouldFetch;

    }

    onPost = () => {
        const { name, title, content } = this.state;
        var shouldFetch = false;
        this.preCheck().then(fetch => {
            shouldFetch = fetch;
            if (!shouldFetch) return;
            console.log("gonna fetch");
            this.props.params.axiosInstance.defaults.withCredentials = true;

            this.props.params.axiosInstance.post('/api/blogPost/create'
                , {
                    name: name,
                    title: title,
                    content: content
                }).then(res => {

                    this.setState({ message: res.data.message });


                });
        });



    }

    render() {


        return (
            <div className='container-fluid'>
                <div className='row p-3'>

                    <Navbar activeLink='createBlog' axiosInstance={this.props.params.axiosInstance} />

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
                                    <textarea className="form-control" name='content' onChange={this.onInputBoxChanged} rows="5"></textarea>
                                </div>
                            </div>

                            {this.state.model ? <button type="button" onClick={this.onPost} className="btn btn-warning">Post</button> : <button type="button" className="btn btn-warning" disabled>Model Loading</button>}

                            <h6 className='text-center text-info p-2'>{this.state.message}</h6>
                        </form>

                    </div>

                </div>

            </div>
        )

    }

}

export default CreateBlog;