import React, { Component } from 'react'
import { Link, Redirect } from 'react-router-dom'
import './Home.css'

class Home extends Component {

    state = {
        redirectTo: '',
    }

    componentDidMount() {
        // console.log(this.props);
        this.props.params.axiosInstance.defaults.withCredentials = true;
        this.props.params.axiosInstance.post('/api/account/verify').then(res => {
            if (res.data.success) {
                this.setState({
                    redirectTo: '/user/dashboard'
                })
            }
        });
    }



    render() {


        if (this.state.redirectTo) {
            return <Redirect to={this.state.redirectTo} />
        }

        return (
            <div className='container-fluid p-5' id='home-div'>

                <div className='row text-black'>
                    <div className='col text-center p-3 m-t-2'>
                        <h1>Free to use Blogger</h1>
                    </div>
                </div>
                <div className='row'>
                    <div className='col text-center '>
                        <Link to='/signin'><button className='btn btn-primary text-center p-3'>SIGN IN TO CREATE A BLOG</button></Link>
                    </div>
                </div>

            </div>
        )
    }

}

export default Home;