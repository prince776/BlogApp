import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import './SignIn.css'

class SignIn extends Component {

    state = {
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

    render() {

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
                                <input type="email" name='email' className="form-control" placeholder="Email" />
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-2 col-form-label">Password</label>
                            <div className="col-sm-10">
                                <input type="password" name='password' className="form-control" placeholder="Password" />
                            </div>
                        </div>

                        <button type="button" className="btn btn-warning">Sign In</button>
                        <div className='row p-2'>
                            <div className='col'>
                                <Link to='/signup' className='btn btn-primary'>Do not have an Account? Sign up here</Link>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        )

    }

}

export default SignIn;