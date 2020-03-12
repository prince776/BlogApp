import React, { Component } from 'react'

class ListView extends Component {

    constructor(props) {
        super(props);

        this.state = {
            titles: props.titles,
            names: props.names,
            //pagination things
            itemsPerPage: props.itemsPerPage,
            minItemsPerPage: props.minItemsPerPage,  //const
            currentPage: 1,
            totalItems: props.totalItems,
            currentTitles: [],
            currentNames: [],
            pageNumbers: [],
        }
    }

    componentDidMount() {
        this.updatePaginationVars(1);
        var pNo = [];
        for (let i = 1; i <= Math.ceil(this.state.totalItems / this.state.itemsPerPage); i++) pNo.push(i); //page numbers
        this.setState({
            pageNumbers: pNo
        })

        //auto set itemsPerPage
        var itemsPerPage = Math.ceil(this.state.totalItems / 10);//divided total pages' nearest
        if (itemsPerPage < this.state.minItemsPerPage) itemsPerPage = this.state.minItemsPerPage;
        this.setState({
            itemsPerPage: itemsPerPage
        })
    }

    updatePaginationVars = (newPageNo) => {
        this.setState({
            currentPage: newPageNo
        }, () => {
            var { currentPage, itemsPerPage, names, titles } = this.state;
            if (names) {
                this.setState({
                    currentNames: [],
                    currentTitles: [],
                }, () => {
                    this.setState({
                        currentNames: names.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage),
                        currentTitles: titles.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                    })
                })
            }
        })
    }

    render() {

        return (
            <div className='container-fluid'>

                {/* Rendering method */}
                {/* Mostly ShowItems */}
                {this.props.renderMethod(this.state.currentNames, this.state.currentTitles)}

                {/* Pagination  */}
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
            </div>
        )
    }
}

export default ListView;