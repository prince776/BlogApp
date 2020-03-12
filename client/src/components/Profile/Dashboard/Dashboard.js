import React, { Component } from 'react'
import { Link, Redirect } from 'react-router-dom'
import './Dashboard.css'
import Navbar from '../Navbar';
import Posts from './Posts.js'
import ListView from '../../Utils/ListView';
import ShowItems from '../../Utils/ShowItems';

class Dashboard extends Component {

    constructor(props) {
        super(props);

        this.state = {
            blogPostTitles: [],
            blogPostNames: [],
            totalPosts: 0,
            message: '',
            username: '',
            redirectTo: '',
            //pagination things
            // postsPerPage: 3,
            // minPostsPerPage: 3,  //const
            // currentPage: 1,
            // totalPosts: 0,
            // currentPostTitles: [],
            // currentPostNames: [],
            // pageNumbers: [],
            toSearch: '',
            listView: null,
        }
    }

    componentDidMount() {

        this.props.params.postReq("Dashboard", '/api/blogPost/getMyPosts', true).then(res => {

            if (!res.data.success) {
                this.setState({
                    message: res.data.message
                });
            }
            this.setState({
                blogPostNames: res.data.blogPostNames,
                blogPostTitles: res.data.blogPostTitles,
                username: res.data.username,
                totalPosts: res.data.totalPosts
            }, () => {

                const { blogPostNames, blogPostTitles, totalPosts } = this.state;

                this.setState({
                    listView: <ListView titles={blogPostTitles} names={blogPostNames}
                        itemsPerPage={3} minItemsPerPage={3} totalItems={totalPosts}
                        renderMethod={this.renderMethod} />
                });

            })

            //save all fetch data for offline use.
            var blogPostNames = res.data.blogPostNames;
            if (blogPostNames) {
                for (var i = 0; i < blogPostNames.length; i++) {
                    var blogPostName = blogPostNames[i];
                    this.props.params.postReq("BlogPost", '/api/blogPost/getBlogPostData', false
                        , {
                            username: this.state.username,
                            blogPostName: blogPostName
                        }).then(res => {
                            // console.log(`FETCHED: ${blogPostName}`);
                        })
                }
            }

        })

        //also load profile data
        this.props.params.postReq("Profile", '/api/account/profile', true);

    }

    renderMethod = (names, titles) => {
        return <ShowItems headings={['Title', 'Name']} names={names} titles={titles}
            username={this.state.username} routingBase={'blogPosts'} />
    }

    onSearch = (e) => {
        this.setState({
            toSearch: e.target.value
        }, () => {

            var { toSearch, blogPostNames, blogPostTitles } = this.state;
            if (!toSearch) {
                this.updatePaginationVars(this.state.currentPage);
                return;
            }

            toSearch = toSearch.trim();
            //set current titles and names accordingly

            //search in names
            var currentPostNames = blogPostNames.filter(name => name.search(toSearch) !== -1);
            //search in titles
            var titles = blogPostTitles.filter(title => title.search(toSearch) !== -1);
            //more names as per found in titles
            var moreNames = titles.map(title => blogPostNames[blogPostTitles.indexOf(title)]);

            currentPostNames = currentPostNames.concat(moreNames);
            //filter out duplicate names since they could have come along with title oriented search
            currentPostNames = currentPostNames.filter((item, index) => currentPostNames.indexOf(item) == index)
            var currentPostTitles = currentPostNames.map(name => blogPostTitles[blogPostNames.indexOf(name)]);

            this.setState({
                currentPostNames: currentPostNames,
                currentPostTitles: currentPostTitles
            })

        })
    }

    updatePaginationVars = (newPageNo) => {
        this.setState({
            currentPage: newPageNo
        }, () => {
            var { currentPage, postsPerPage, blogPostNames, blogPostTitles } = this.state;
            if (blogPostNames) {
                this.setState({
                    currentPostNames: [],
                    currentPostTitles: [],
                }, () => {
                    this.setState({
                        currentPostNames: blogPostNames.slice((currentPage - 1) * postsPerPage, currentPage * postsPerPage),
                        currentPostTitles: blogPostTitles.slice((currentPage - 1) * postsPerPage, currentPage * postsPerPage)
                    })
                })
            }
        })
    }

    deleteData = (name) => {

        var { blogPostNames, blogPostTitles, currentPostTitles, currentPostNames } = this.state;

        this.setState({
            blogPostTitles: blogPostTitles.filter((title, index, arr) => {
                return title != blogPostTitles[blogPostNames.indexOf(name)];
            }),
            blogPostNames: blogPostNames.filter((blogPostName, index, arr) => {
                return blogPostName != name;
            }),
        }, () => {
            this.updatePaginationVars(this.state.currentPage);
        })

    }

    render() {

        const { username } = this.state;

        if (this.state.redirectTo) {
            return <Redirect to={this.state.redirectTo} />
        }

        return (
            <div className='container-fluid'>
                <div className='row p-3'>
                    <Navbar activeLink='dashboard' axiosInstance={this.props.params.axiosInstance} />
                    <div className='col text-center p-5'>

                        <h3 className='text-secondary'>Welcome to Blogger</h3><br />
                        <Link to='/user/createBlog'><button className='btn btn-info'>Create Blog</button></Link>
                        <h6 className='text-center text-primary p-2'>{this.state.message}</h6>

                        <hr />

                        <h4 className='text-secondary'>Your Blog Posts:</h4><br />

                        {this.state.listView}

                        {/* Search Box 
                        <div className="form-group row">
                            <label className="col-sm-2 col-form-label text-secondary">Search</label>
                            <div className="col-sm-10">
                                <input type="text" onChange={this.onSearch} className="form-control" placeholder="Search" />
                            </div>
                        </div> */}

                        {/* <Posts blogPostNames={this.state.currentPostNames} blogPostTitles={this.state.currentPostTitles} axiosInstance={this.props.params.axiosInstance}
                            username={username} deleteData={this.deleteData} setAState={(name, value) => { this.setState({ [name]: value }) }}
                        /> */}

                        {/* {!this.state.toSearch ?
                            <nav>
                                <ul className='text-center pagination'>
                                    {this.state.pageNumbers.map(number => (

                                        number === this.state.currentPage ?
                                            <li key={number} className='page-item active activePage'>
                                                <a className='page-link'>
                                                    {number}
                                                </a>
                                            </li> :
                                            <li key={number} className='page-item'>
                                                <a onClick={this.updatePaginationVars.bind(this, number)} className='page-link'>
                                                    {number}
                                                </a>
                                            </li>

                                    ))}
                                </ul>
                            </nav>
                            :
                            ""
                        } */}

                    </div>
                </div>

            </div>
        )

    }

}

export default Dashboard;