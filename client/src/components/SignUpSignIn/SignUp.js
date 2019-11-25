import React, { Component } from 'react'
import { Link } from "react-router-dom";
import './SignUp.css'

class SignUp extends Component {

    state = {

    }

    componentDidMount() {

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
                            <input type="text" class="form-control" placeholder="Username" />
                        </div>
                    </div>
                    <div class="form-group row">
                        <label class="col-sm-2 col-form-label">Email</label>
                        <div class="col-sm-10">
                            <input type="email" class="form-control" placeholder="Email" />
                        </div>
                    </div>
                    <div class="form-group row">
                        <label class="col-sm-2 col-form-label">Password</label>
                        <div class="col-sm-10">
                            <input type="password" class="form-control" placeholder="Password" />
                        </div>
                    </div>

                    <button type="button" class="btn btn-warning">Sign Up</button>
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