import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import './Posts.css'


class Posts extends Component {

    constructor(props) {
        super(props);

        this.state = {
            deleting: false
        }
    }

    componentDidMount() {
    }

    onDelete = (name, blogPostTitles, blogPostNames) => {
        if (this.state.deleting) return;

        this.setState({ deleting: true });

        if (!navigator.onLine) {
            this.props.setAState('message', "You need to be online to delete post!");
            return;
        }

        this.props.axiosInstance.withCredentials = true;

        this.props.axiosInstance.post('/api/blogPost/delete'
            , {
                blogPostName: name
            }).then(res => {
                if (res.data.success) {

                    this.setState({
                        deleting: false,
                    })

                    this.props.deleteData(name);

                } else {
                    this.props.setMessage(res.data.message);
                    this.setState({ deleting: false })
                }

            })

    }

    onEdit = (username, name) => {
        if (!navigator.onLine) {
            this.props.setAState('message', "You need to be online to Edit it!");
            return;
        }
        this.props.setAState('redirectTo', `/blogPosts/${username}/${name}/edit`)
    }

    render() {
        var { blogPostNames, blogPostTitles, username } = this.props
        return (
            <div>
                <table className='table table-hover'>
                    <thead className='thead-dark'>
                        <tr>
                            <th>Title</th>
                            <th>BlogPost Name</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>

                        {blogPostNames ? blogPostNames.map(name => (
                            <tr key={name} >
                                <td>
                                    <Link to={`/blogPosts/${username}/${name}`}>
                                        {blogPostTitles[blogPostNames.indexOf(name)]}
                                    </Link>
                                </td>
                                <td>
                                    <Link to={`/blogPosts/${username}/${name}`}>
                                        {name}
                                    </Link>
                                </td>
                                <td>
                                    <button onClick={this.onDelete.bind(this, name, blogPostTitles, blogPostNames)} className='btn btn-danger m-2'>Delete</button>
                                    <button onClick={this.onEdit.bind(this, username, name)} className='btn btn-info'>Edit</button>
                                </td>

                            </tr>
                        )) : <tr><td></td></tr>}

                    </tbody>
                </table>
            </div>
        )

    }

}

export default Posts;