import React, { Component } from 'react'
import axios from 'axios';
import { Link } from "react-router-dom";
import './SignUp.css'

class SignUp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            email: '',
            password: '',
            message: '',
        }
        this.props.params.setLoading(true);
    }


    componentDidMount() {
        this.props.params.setLoading(false);
    }

    onInputBoxChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    onSignUp = () => {

        const { username, email, password } = this.state;


        var shouldFetch = this.preCheck();
        if (!shouldFetch) return;

        this.props.params.setLoading(true);

        axios.post('http://localhost:8080/api/account/signup'
            , {
                username: username,
                email: email,
                password: password
            }).then(res => {
                this.props.params.setLoading(false);
                this.setState({
                    message: res.data.message,
                })
            });

    }

    preCheck = () => {
        const { username, email, password } = this.state;
        if (!username) this.setState({ message: "Please fill in the Username" });
        else if (!email) this.setState({ message: "Please fill in the Email" });
        else if (!password) this.setState({ message: "Please fill in the Password" });

        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        var validEmail = re.test(String(email).toLowerCase());
        if (!validEmail) this.setState({ message: 'Email is not valid' });

        if (!username || !email || !password || !validEmail) return false;
        return true;
    }

    render() {

        if (this.props.params.isLoading)
            return (<div></div>)

        return (
            <div className='text-center text-black p-5'>

                <div >
                    <h1>Sign Up</h1>
                </div>

                <form className='p-4 m-5'>
                    <div className="form-group row">
                        <label className="col-sm-2 col-form-label">Username</label>
                        <div className="col-sm-10">
                            <input type="text" name='username' onChange={this.onInputBoxChange} className="form-control" placeholder="Username" />
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-2 col-form-label">Email</label>
                        <div className="col-sm-10">
                            <input type="email" name='email' onChange={this.onInputBoxChange} className="form-control" placeholder="Email" />
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-2 col-form-label">Password</label>
                        <div className="col-sm-10">
                            <input type="password" name='password' onChange={this.onInputBoxChange} className="form-control" placeholder="Password" />
                        </div>
                    </div>

                    <button type="button" onClick={this.onSignUp} className="btn btn-warning">Sign Up</button>
                    <div className='row p-2'>
                        <div className='col'>
                            <Link to='/signin' className='btn btn-primary'>Already have an Account? Sign In here</Link>
                        </div>
                    </div>
                    <h6 className='text-center text-info'>{this.state.message}</h6>
                </form>

            </div>

        )


    }

}

export default SignUp;