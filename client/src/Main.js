import React, { Component } from 'react'
import { Switch, Route, withRouter } from 'react-router-dom'

//Components to import
import Home from './components/Home/Home.js'
import SignIn from './components/SignUpSignIn/SignIn.js'
import SignUp from './components/SignUpSignIn/SignUp.js'
import Dashboard from './components/Profile/Dashboard/Dashboard.js'
import Profile from './components/Profile/Profile.js'
import CreateBlog from './components/Profile/CreateBlog/CreateBlog.js'
import BlogPost from './components/BlogPost/BlogPost.js'
import EditPost from './components/BlogPost/EditPost.js'
// import BrowsePosts from './components/Browse/BrowsePosts.js'

class Main extends Component {

    constructor(props) {
        super(props);
    }


    render() {

        return (
            <Switch>
                <Route exact path="/signup" render={() => <SignUp params={this.props} />} />
                <Route exact path="/signin" render={() => <SignIn params={this.props} />} />
                <Route exact path="/user/dashboard" render={() => <Dashboard params={this.props} />} />
                <Route exact path="/user/profile" render={() => <Profile params={this.props} />} />
                <Route exact path="/user/createBlog" render={() => <CreateBlog params={this.props} />} />
                {/* <Route exact path="/browsePosts" render={() => <BrowsePosts params={this.props} />} /> */}


                {/* Variable routes */}
                <Route exact path="/blogPosts/:username/:blogPostName" render={() => <BlogPost params={this.props} />} />
                <Route exact path="/blogPosts/:username/:blogPostName/edit" render={() => <EditPost params={this.props} />} />



                <Route path="/" render={() => <Home params={this.props} />} />
            </Switch>
        );

    }

}

export default withRouter(Main);