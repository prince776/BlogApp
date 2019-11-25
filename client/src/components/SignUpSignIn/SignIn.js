import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import './SignIn.css'

class SignIn extends Component {

    state = {

    }

    componentDidMount() {

    }

    render() {

        return (
            <div class='p-5'>
                <div class='text-center text-black '>

                    <div class='m-t-3'>
                        <h1>Sign In</h1>
                    </div>

                    <form class='p-4 m-5'>
                        <div class="form-group row">
                            <label for="inputEmail3" class="col-sm-2 col-form-label">Email</label>
                            <div class="col-sm-10">
                                <input type="email" class="form-control" id="inputEmail3" placeholder="Email" />
                            </div>
                        </div>
                        <div class="form-group row">
                            <label for="inputPassword3" class="col-sm-2 col-form-label">Password</label>
                            <div class="col-sm-10">
                                <input type="password" class="form-control" id="inputPassword3" placeholder="Password" />
                            </div>
                        </div>

                        <button type="button" class="btn btn-warning">Sign In</button>
                        <div class='row p-2'>
                            <div class='col'>
                                <Link to='/signup' class='btn btn-primary'>Do not have an Account? Sign up here</Link>
                            </div>
                        </div>
                    </form>



                </div>
            </div>
        )

    }

}

export default SignIn;