import React, { Component } from 'react';
import './App.css';
import Main from './Main.js'
// import SignUp from './components/SignUpSignIn/SignUp.js'
import Header from './components/Header/Header.js'
import Footer from './components/Footer/Footer.js'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true
    }
  }

  componentDidMount() {
    // this.setState({
    //   isLoading: false
    // })    

  }

  setLoading = (loading) => {
    this.setState({
      isLoading: loading
    })
  }

  render() {
    return (
      <div>
        <Header />
        {this.state.isLoading === true ? <Loading /> : <div></div>}
        <Main setLoading={this.setLoading} isLoading={this.state.isLoading} />
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
