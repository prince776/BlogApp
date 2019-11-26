import React, { Component } from 'react'
import axios from 'axios';
import { Link } from "react-router-dom";
import './SignUp.css'

class SignUp extends Component {

    state = {
        username: '',
        email: '',
        password: '',
        isLoading: true,
        message: '',
    }

    componentDidMount() {
        this.setState({
            isLoading: false
        })
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
        axios.post('http://localhost:8080/api/account/signup'
            , {
                username: username,
                email: email,
                password: password
            }).then(res => {
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

        if (this.state.isLoading) {
            return <h3 class='text-center p-3'>Please wait while loading</h3>
        }

        return (
            <div class='text-center text-black p-5'>

                <div >
                    <h1>Sign Up</h1>
                </div>

                <form class='p-4 m-5'>
                    <div class="form-group row">
                        <label class="col-sm-2 col-form-label">Username</label>
                        <div class="col-sm-10">
                            <input type="text" name='username' onChange={this.onInputBoxChange} class="form-control" placeholder="Username" />
                        </div>
                    </div>
                    <div class="form-group row">
                        <label class="col-sm-2 col-form-label">Email</label>
                        <div class="col-sm-10">
                            <input type="email" name='email' onChange={this.onInputBoxChange} class="form-control" placeholder="Email" />
                        </div>
                    </div>
                    <div class="form-group row">
                        <label class="col-sm-2 col-form-label">Password</label>
                        <div class="col-sm-10">
                            <input type="password" name='password' onChange={this.onInputBoxChange} class="form-control" placeholder="Password" />
                        </div>
                    </div>

                    <button type="button" onClick={this.onSignUp} class="btn btn-warning">Sign Up</button>
                    <div class='row p-2'>
                        <div class='col'>
                            <Link to='/signin' class='btn btn-primary'>Already have an Account? Sign In here</Link>
                        </div>
                    </div>
                    <h6 class='text-center text-info'>{this.state.message}</h6>
                </form>

            </div>

        )

    }

}

export default SignUp;