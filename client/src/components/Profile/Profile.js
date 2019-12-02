import React, { Component } from 'react'
import './Profile.css'
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

        // this.props.params.axiosInstance.defaults.withCredentials = true;

        // this.props.params.axiosInstance.post('/api/account/profile').then(res => {
        //     this.setState({
        //         username: res.data.username,
        //         email: res.data.email,
        //         isVerified: res.data.isVerified
        //     })
        //     if (!res.data.success) {
        //         this.setState({ failMessage: 'Failed to fetch data from server!' })
        //     }
        // });

        this.props.params.postReq("Profile", '/api/account/profile', true).then(res => {
            // console.log(res.data)
            this.setState({
                username: res.data.username,
                email: res.data.email,
                isVerified: res.data.isVerified
            })
            if (!res.data.success) {
                this.setState({ failMessage: res.data.message })
            }
        });


    }

    onSendVerificationCode = () => {
        if (!navigator.onLine) {
            this.setState({ message: "You need to be online to verify your email" });
            return;
        }

        this.props.params.axiosInstance.post('/api/account/profile/sendVerificationCode'
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
        this.props.params.axiosInstance.post('/api/account/profile/verifyCode'
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
            <div className='container-fluid'>
                <div className='row p-3'>

                    <Navbar activeLink='profile' axiosInstance={this.props.params.axiosInstance} />

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