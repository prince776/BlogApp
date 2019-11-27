import React, { Component } from 'react'
import axios from 'axios';
import { Link } from 'react-router-dom'
import './SignIn.css'

class SignIn extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            message: '',
        }
        this.props.params.setLoading(true);
    }

    componentDidMount() {
        this.props.params.setLoading(false);
    }

    onInputBoxChanged = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    onSignIn = () => {

        const { email, password } = this.state;

        var shouldFetch = this.preCheck();
        if (!shouldFetch) return;
        this.props.params.setLoading(true);

        axios.post('http://localhost:8080/api/account/signin'
            , {
                email: email,
                password: password
            }).then(res => {
                this.props.params.setLoading(false);
                this.setState({
                    message: res.data.message
                })
            })
    }

    preCheck = () => {
        const { username, email, password } = this.state;
        if (!email) this.setState({ message: "Please fill in the Email" });
        else if (!password) this.setState({ message: "Please fill in the Password" });

        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        var validEmail = re.test(String(email).toLowerCase());
        if (!validEmail) this.setState({ message: 'Email is not valid' });

        if (!email || !password || !validEmail) return false;
        return true;
    }


    render() {
        if (this.props.params.isLoading)
            return (<div></div>);

        return (
            <div className='p-5'>
                <div className='text-center text-black '>

                    <div className='m-t-3'>
                        <h1>Sign In</h1>
                    </div>

                    <form className='p-4 m-5'>
                        <div className="form-group row">
                            <label className="col-sm-2 col-form-label">Email</label>
                            <div className="col-sm-10">
                                <input type="email" name='email' onChange={this.onInputBoxChanged} className="form-control" placeholder="Email" />
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-2 col-form-label">Password</label>
                            <div className="col-sm-10">
                                <input type="password" name='password' onChange={this.onInputBoxChanged} className="form-control" placeholder="Password" />
                            </div>
                        </div>

                        <button type="button" onClick={this.onSignIn} className="btn btn-warning">Sign In</button>
                        <div className='row p-2'>
                            <div className='col'>
                                <Link to='/signup' className='btn btn-primary'>Do not have an Account? Sign up here</Link>
                            </div>
                        </div>
                        <h6 className='text-center text-info'>{this.state.message}</h6>
                    </form>
                </div>
            </div>
        )

    }

}

export default SignIn;