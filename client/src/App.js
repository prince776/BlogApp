import React, { Component } from 'react';
import './App.css';
import Main from './Main.js'
// import SignUp from './components/SignUpSignIn/SignUp.js'
import Header from './components/Header/Header.js'
import Footer from './components/Footer/Footer.js'
import axios from 'axios'

class App extends Component {
  constructor(props) {
    super(props);
    const env = process.env.NODE_ENV; // current environment
    // console.log(process.env);
    this.state = {
      // isLoading: true,
      axiosInstance: axios.create({
        baseURL:
          env === 'production'
            ? 'https://fierce-retreat-71149.herokuapp.com' // production
            : 'http://localhost:8080', // development
      })
    }

  }

  componentDidMount() {

  }

  // setLoading = (loading) => {
  //   this.setState({
  //     isLoading: loading
  //   })
  // }

  render() {
    return (
      <div>
        <Header />
        {this.state.isLoading === true ? <Loading /> : <div></div>}
        <Main axiosInstance={this.state.axiosInstance} />
        <Footer />
      </div>
    );
  }
}

var Loading = (props) => {

  return (
    <h3 className='text-center p-3'>Please wait while loading</h3>
  )

}

export default App;
