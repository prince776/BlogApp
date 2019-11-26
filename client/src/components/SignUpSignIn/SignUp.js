import React, { Component } from 'react'
import axios from 'axios';
import { Link } from "react-router-dom";
import './SignUp.css'

class SignUp extends Component {

    state = {
        username: '',
        email: '',
        password: '',
        isLoading: false
    }

    componentDidMount() {
        this.setState({
            isLoading: true
        })
    }

    onUsernameTextboxChange = (e) => {
        this.setState({
            username: e.target.value
        })
    }

    onEmailTextboxChange = (e) => {
        this.setState({
            email: e.target.value
        })
    }

    onPasswordTextboxChange = (e) => {
        this.setState({
            password: e.target.value
        })
    }

    onSignUp = () => {

        const { username, email, password } = this.state;
        console.log("trying");
        axios.post('http://localhost:8080/api/account/signup'
            , {
                username: username,
                email: email,
                password: password
            }).then(res => {
                console.log(res);
            });

    }

    render() {

        return (
            <div class='text-center text-black p-5'>

                <div >
                    <h1>Sign Up</h1>
                </div>

                <form class='p-4 m-5'>
                    <div class="form-group row">
                        <label class="col-sm-2 col-form-label">Username</label>
                        <div class="col-sm-10">
                            <input type="text" onChange={this.onUsernameTextboxChange} class="form-control" placeholder="Username" />
                        </div>
                    </div>
                    <div class="form-group row">
                        <label class="col-sm-2 col-form-label">Email</label>
                        <div class="col-sm-10">
                            <input type="email" onChange={this.onEmailTextboxChange} class="form-control" placeholder="Email" />
                        </div>
                    </div>
                    <div class="form-group row">
                        <label class="col-sm-2 col-form-label">Password</label>
                        <div class="col-sm-10">
                            <input type="password" onChange={this.onPasswordTextboxChange} class="form-control" placeholder="Password" />
                        </div>
                    </div>

                    <button type="button" onClick={this.onSignUp} class="btn btn-warning">Sign Up</button>
                    <div class='row p-2'>
                        <div class='col'>
                            <Link to='/signin' class='btn btn-primary'>Already have an Account? Sign In here</Link>
                        </div>
                    </div>
                </form>

            </div>

        )

    }

}

export default SignUp;