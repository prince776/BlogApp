import React, { Component } from 'react'
import './Profile.css'
import axios from 'axios'
import Navbar from './Navbar.js'

class Profile extends Component {

    constructor(props) {
        super(props);

        this.state = {
            username: '',
            email: '',
            isVerified: false,
            failMessage: '',
            codeSent: false,
            verificationMessage: '',
            verificationCodeEntered: '',
        }
    }

    componentDidMount() {

        axios.defaults.withCredentials = true;

        axios.post('http://localhost:8080/api/account/profile').then(res => {
            this.props.params.setLoading(false);
            this.setState({
                username: res.data.username,
                email: res.data.email,
                isVerified: res.data.isVerified
            })
            if (!res.data.success) {
                this.setState({ failMessage: 'Failed to fetch data from server!' })
            }
        });

    }

    onSendVerificationCode = () => {
        axios.post('http://localhost:8080/api/account/profile/sendVerificationCode'
            , {
                email: this.state.email
            }).then(res => {
                this.setState({
                    verificationMessage: res.data.message
                })
                if (res.data.success) {
                    this.setState({ codeSent: true })
                }
            });
    }

    onVerificationCodeEntered = (e) => {
        this.setState({
            verificationCodeEntered: e.target.value
        })
    }

    onVerifyCode = () => {
        axios.post('http://localhost:8080/api/account/profile/verifyCode'
            , {
                verificationCode: this.state.verificationCodeEntered,
                email: this.state.email
            }).then(res => {
                this.setState({ verificationMessage: res.data.message });
                if (res.data.success) {
                    this.setState({
                        isVerified: true
                    })
                }
            })
    }

    render() {

        if (this.props.params.isLoading)
            return <div></div>

        var sendVerificationCodeButton;
        var verificationCodeInputBox;
        var verifyCodeButton

        if (!this.state.isVerified) {
            sendVerificationCodeButton = <button onClick={this.onSendVerificationCode} className='btn btn-warning' > Send Verification Code</button >;
        }
        if (this.state.codeSent && !this.state.isVerified) {
            verificationCodeInputBox = <input type='text' onChange={this.onVerificationCodeEntered} className='form-control' placeholder='Enter Verification Code' />
            verifyCodeButton = <button onClick={this.onVerifyCode} className='btn btn-success' > Verify Code</button >;
        }

        return (
            <div>
                <div className='row p-3'>

                    <Navbar activeLink='profile' />

                    <div className='col text-center p-5 text-secondary' >
                        <h3 >Your Profile</h3><hr />
                        <h4>Username: {this.state.username}</h4>
                        <h4>Email: {this.state.email}</h4>
                        <h4>Email Verified: {this.state.isVerified ? "Yes" : "No"}</h4>
                        <h4 className='text-danger'>{this.state.failMessage}</h4><br />
                        <div className='p-2 m-2'>
                            {sendVerificationCodeButton}<br /><br />
                            {verificationCodeInputBox}<br />
                            {verifyCodeButton}<br /><br />
                            <h5>{this.state.verificationMessage}</h5>
                        </div>
                    </div>

                </div>

            </div>
        )

    }

}

export default Profile;