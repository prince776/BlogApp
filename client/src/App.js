import React, { Component } from 'react';
import './App.css';
import Main from './Main.js'
import Header from './components/Header/Header.js'
import Footer from './components/Footer/Footer.js'
import axios from 'axios'

import 'bootstrap/dist/css/bootstrap.min.css';

class App extends Component {

  constructor(props) {
    super(props);

    const env = process.env.NODE_ENV; // current environment

    this.state = {
      axiosInstance: axios.create({
        baseURL:
          // 'http://localhost:8080',
          env === 'production'
            ? 'https://fierce-retreat-71149.herokuapp.com' // production
            : 'http://localhost:8080', // development
      }),
      apiCache: {},
      // isLoading: true,
    }
  }

  componentDidMount() {
    if (!localStorage.getItem('blogAppAPICache')) localStorage.setItem('blogAppAPICache', '"{"test":"test"}"');
    var cache = JSON.parse(localStorage.getItem('blogAppAPICache'));
    this.setState({
      apiCache: cache
    })

  }

  //Auto caches API responses
  postReq = async (who, address, withCredentials, body) => {

    var { axiosInstance, apiCache } = this.state;

    axiosInstance.withCredentials = withCredentials;

    if (!navigator.onLine) {
      if (!body) {
        if (apiCache[who + address]) {
          console.log("OFFLINE. Serving cached api response");
          return apiCache[who + address];
        }
      } else {
        if (apiCache[who + address + '@' + JSON.stringify(body)]) {
          console.log("OFFLINE. Serving cached api response");
          return apiCache[who + address + '@' + JSON.stringify(body)];
        }
      }

      console.log("OFFLINE. API response not cached");
      return null;

    }
    console.log("ONLINE. Serving API response")
    if (body) {
      var res = await axiosInstance.post(address, body);
    } else {
      var res = await axiosInstance.post(address);
    }
    if (!body)
      apiCache[who + address] = res;
    else {
      apiCache[who + address + '@' + JSON.stringify(body)] = res;
    }
    localStorage.setItem('blogAppAPICache', JSON.stringify(apiCache));
    console.log("API cache updated ")
    return res;

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
        <Main axiosInstance={this.state.axiosInstance} postReq={this.postReq} />
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
