import React, { Component } from 'react';
import './App.css';
import Main from './Main.js'
import Header from './components/Header/Header.js'
import Footer from './components/Footer/Footer.js'
import axios from 'axios'

import 'bootstrap/dist/css/bootstrap.min.css';
import { throws } from 'assert';

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

      user: {},

    }
  }

  componentDidMount() {
    if (localStorage.getItem('blogAppAPICache')) {
      try {
        JSON.parse(localStorage.getItem('blogAppAPICache'));
      } catch (e) {
        localStorage.clear();
        return;
      }

      this.setState({
        apiCache: JSON.parse(localStorage.getItem('blogAppAPICache'))
      })
    }

    this.getUser();

  }

  getUser = () => {
    if (!navigator.onLine) {
      if (this.state.apiCache['Profile' + '/api/account/profile']) {
        console.log("OFFLINE. Serving cached api response");
        var res = this.state.apiCache['Profile' + '/api/account/profile'];
        var user = {
          username: res.data.username,
          email: res.data.email,
          isVerified: res.data.isVerified
        };
        this.setState({ user: user });
      }
      console.log("OFFLINE. API response not cached");
      return;
    }
    this.state.axiosInstance.withCredentials = true;
    this.state.axiosInstance.post('/api/account/profile').then(res => {
      var user = {
        username: res.data.username,
        email: res.data.email,
        isVerified: res.data.isVerified
      };
      this.setState({ user: user });
      if (!res.data.success) {
        console.log("FAILED")
      }
    });
  }

  //Auto caches API responses
  postReq = async (who, address, withCredentials, body) => {

    var { axiosInstance, apiCache } = this.state;

    axiosInstance.withCredentials = withCredentials;

    if (withCredentials) {//auto update user
      this.getUser();
    }

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
      console.log("API cache updated ")
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

  render() {
    return (
      <div>
        <Header username={this.state.user.username} />
        <Main axiosInstance={this.state.axiosInstance} postReq={this.postReq} />
        <Footer />
      </div>
    );
  }
}

export default App;
