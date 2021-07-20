import React from 'react';
import { List, message, Avatar, Spin, PageHeader } from 'antd';
import fetch from 'node-fetch';
import 'antd/dist/antd.css';
import './ListDevices.css';

import InfiniteScroll from 'react-infinite-scroller';

const DataUrl = 'http://192.168.1.43/v2/entities';

class ListDevices extends React.Component {
    state = {
        data: [],
        loading: false,
        hasMore: true,
    };

    componentDidMount() {
        this.fetchData(res => {
            this.setState({
                data: res,
            });
        });
    }

    fetchData = callback => {
        fetch(DataUrl)
            .then(res => res.json())
            .then(json => {
                callback(json);
            });
    };

    handleInfiniteOnLoad = () => {
        let { data } = this.state;
        this.setState({
            loading: true,
        });
        if (data.length > 14) {
            message.warning('Infinite List loaded all');
            this.setState({
                hasMore: false,
                loading: false,
            });
            return;
        }
        this.fetchData(res => {
            data = data.concat(res);
            this.setState({
                data,
                loading: false,
            });
        });
    };

    render() {
        return (
            <div className="demo-infinite-container">

                <PageHeader
                    className="site-page-header"
                    onBack={() => null}
                    title="Devices"
                    subTitle="The list of available devices"
                />

                <InfiniteScroll
                    initialLoad={false}
                    pageStart={0}
                    loadMore={this.handleInfiniteOnLoad}
                    hasMore={!this.state.loading && this.state.hasMore}
                    useWindow={false}
                >
                    <List
                        dataSource={this.state.data}
                        renderItem={item => (
                            <List.Item key={item.id}>
                                <List.Item.Meta
                                    avatar={
                                        <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                                    }
                                    title={<a href="https://ant.design">{item.id}</a>}
                                    description={item.type}
                                />
                                <div>location: [{item.location.value.coordinates[0]}, {item.location.value.coordinates[1]}]</div>
                            </List.Item>
                        )}
                    >
                        {this.state.loading && this.state.hasMore && (
                            <div className="demo-loading-container">
                                <Spin />
                            </div>
                        )}
                    </List>
                </InfiniteScroll>
            </div>
        );
    }
}

export default ListDevices;