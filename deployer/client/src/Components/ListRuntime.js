import React from 'react';
import { List, Avatar, PageHeader, Upload, Form, Button, Input, Divider } from 'antd';
import fetch from 'node-fetch';
import 'antd/dist/antd.css';
import { InboxOutlined } from '@ant-design/icons';


const DataUrl = '/Runtimes';
const DataUrl2 = '/Runtime';


class ListRuntime extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            id: "id",
            description: "",
            fileList: []
        };

        this.handleChangeId = this.handleChangeId.bind(this);
        this.handleChangeDescription = this.handleChangeDescription.bind(this);
        this.handleOK = this.handleOK.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
    }

    componentDidMount() {
        this.fetchData(res => {
            this.props.changeRuntimes(res.runtimes);
        });
    }

    fetchData = callback => {
        fetch(DataUrl)
            .then(res => res.json())
            .then(json => {
                callback(json);
            });
    };


    handleChangeId(event) {
        this.setState({ id: event.target.value });
    }

    handleChangeDescription(event) {
        this.setState({ description: event.target.value });
    }

    handleOK() {
        var fd = this.state.fileList[0];
        var fr;
        fr = new FileReader();
        fr.onload = () => {
            try {
                var runtimeGenesis = JSON.parse(fr.result);
            } catch (err) {
                // Notification should be here
                return;
            }
            var data = {
                id: this.state.id,
                description: this.state.description,
                runtime: runtimeGenesis
            }
            fetch(DataUrl, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            }).then(response => {
                if (response.status === 200) {
                    this.fetchData(res => {
                        this.props.changeRuntimes(res.runtimes);
                    });
                }
                console.log(response);
                // Notification should be here
            });
        };
        fr.readAsText(fd);
    }

    handleDelete(id) {
        console.log(JSON.stringify(id));
        let dataR = { id: id };
        fetch(DataUrl2, {
            method: 'DELETE',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataR)
        }).then(response => {
            if (response.status === 200) {
                this.fetchData(res => {
                    this.props.changeRuntimes(res.runtimes);
                });
            }
            console.log(response);
            // Notification should be here
        });
    }

    render() {

        const Dragger = Upload.Dragger;

        const props = {
            name: 'file',
            multiple: false,
            onRemove: (file) => {
                this.setState((state) => {
                    const index = state.fileList.indexOf(file);
                    const newFileList = state.fileList.slice();
                    newFileList.splice(index, 1);
                    return {
                        fileList: newFileList,
                    };
                });
            },
            beforeUpload: (file) => {
                this.setState(state => ({
                    fileList: [...state.fileList, file],
                }));
                return false;
            }
        };


        return (
            <div className="demo-infinite-container">

                <PageHeader
                    className="site-page-header"
                    onBack={() => null}
                    title="Runtime templates"
                    subTitle="The list of available runtime templates"
                />

                <Form
                    name="basic"
                    labelCol={{ span: 2 }}
                    wrapperCol={{ span: 16 }}
                    initialValues={{ remember: true }}
                >

                    <Form.Item
                        label="Id"
                        rules={[{ required: true, message: 'Please input the runtime id!' }]}
                    >
                        <Input name={this.state.id} onChange={this.handleChangeId} />
                    </Form.Item>

                    <Form.Item
                        label="Description"
                        rules={[{ required: false, message: 'You may provide a description' }]}
                    >
                        <Input name={this.state.description} onChange={this.handleChangeDescription} />
                    </Form.Item>

                    <Form.Item
                        name="upload"
                        label="Upload"
                    >
                        <Dragger {...props}>
                            <p className="ant-upload-drag-icon">
                                <InboxOutlined />
                            </p>
                            <p className="ant-upload-text">Click or drag file to this area to upload</p>
                            <p className="ant-upload-hint">
                                Support for a single or bulk upload. Strictly prohibit from uploading company data or other
                                band files
                            </p>
                        </Dragger>,

                    </Form.Item>

                    <Form.Item name="submit" label="">
                        <Button type="primary" htmlType="submit" onClick={this.handleOK}>
                            Submit
                        </Button>
                    </Form.Item>
                </Form>

                <Divider orientation="left">Available runtime templates</Divider>
                <List
                    itemLayout="horizontal"
                    bordered
                    dataSource={this.props.data}
                    renderItem={item => (
                        <List.Item actions={[<Button type="link">Edit</Button>, <Button type="link" onClick={() => { this.handleDelete(item.id) }}>Remove</Button>]}>
                            <List.Item.Meta
                                avatar={<Avatar src="https://gitlab.com/enact/GeneSIS/-/raw/master/docs/_media/GeneSISLogo.png" />}
                                title={<a href="https://ant.design">{item.id}</a>}
                                description={item.description}
                            />
                        </List.Item>
                    )}
                />
            </div>
        );
    }
}

export default ListRuntime;