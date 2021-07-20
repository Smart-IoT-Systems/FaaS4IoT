import React from 'react';
import {
    Form,
    Input,
    PageHeader,
    Button,
    Select
} from 'antd';

const DataUrl = 'http://192.168.1.43/v2/entities?type=gateway';
const tailLayout = {
    wrapperCol: { offset: 4, span: 16 },
};

class Deploy extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hubs: [],
            id: "id",
            selectedHub: 0,
            trigger: JSON.stringify(["/plop2/fillingLevel"]),
            fileListModel: 0,
            fileListArchive: 0
        };

        this.handleChangeId = this.handleChangeId.bind(this);
        this.handleChangeTrigger = this.handleChangeTrigger.bind(this);
        this.handleChangeHub = this.handleChangeHub.bind(this);
        this.handleChangeRuntime = this.handleChangeRuntime.bind(this);
        this.handleChangeArchive = this.handleChangeArchive.bind(this);
    }

    componentDidMount() {
        this.fetchData(res => {
            this.setState({
                hubs: res
            });
        });
    }

    onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

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

    handleChangeTrigger(event) {
        this.setState({ trigger: event.target.value });
    }

    handleChangeHub(event) {
        this.setState({ selectedHub: event });
    }

    handleChangeRuntime(event) {
        this.setState({ fileListModel: event });
    }

    handleChangeArchive(event) {
        this.setState({ fileListArchive: event });
    }

    onSubmit = () => {
        var body = {};
        body.id = this.state.id;
        body.hub = this.state.hubs[this.state.selectedHub];
        body.runtime = this.props.runtimes[this.state.fileListModel].runtime;
        body.functionResource = this.props.ressources[this.state.fileListArchive].path;
        body.triggers = this.state.trigger;

        fetch('/deploy', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        }).then(response => {
            if (response.status === 200) {

            }
            console.log(response);
            // Notification should be here
        });
    }

    onReset = () => {

    };

    render() {

        return (

            <div>
                <PageHeader
                    className="site-page-header"
                    onBack={() => null}
                    title="Deploy a function"
                    subTitle="Use this form to deploy manually a function"
                />

                <Form
                    name="basic"
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 16 }}
                    initialValues={{ remember: true }}
                    onFinishFailed={this.onFinishFailed}
                >

                    <Form.Item
                        label="Id"
                        rules={[{ required: true, message: 'Please input the function id!' }]}
                    >
                        <Input name={this.state.id} onChange={this.handleChangeId} />
                    </Form.Item>

                    <Form.Item label="Hub">
                        <Select value={this.state.selectedHub} onChange={this.handleChangeHub}>
                            {
                                this.state.hubs.map((elem, index) => {
                                    return <Select.Option key={index} value={index}>{elem.id}</Select.Option>;
                                })
                            }
                        </Select>
                    </Form.Item>

                    <Form.Item label="Triggers" >
                        <Input.TextArea name={this.state.trigger} value={this.state.trigger} onChange={this.handleChangeTrigger} />
                    </Form.Item>

                    <Form.Item label="Runtime">
                        <Select onChange={this.handleChangeRuntime}>
                            {
                                this.props.runtimes.map((elem, index) => {
                                    return <Select.Option key={index} value={index}>{elem.id} - {elem.description}</Select.Option>;
                                })
                            }
                        </Select>
                    </Form.Item>

                    <Form.Item label="Function">
                        <Select onChange={this.handleChangeArchive}>
                            {
                                this.props.ressources.map((elem, index) => {
                                    return <Select.Option key={index} value={index}>{elem.id} - {elem.path}</Select.Option>;
                                })
                            }
                        </Select>
                    </Form.Item>


                    <Form.Item {...tailLayout}>
                        <Button type="primary" onClick={this.onSubmit}>
                            Submit
                        </Button>
                        <Button htmlType="button">
                            Cancel
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        );
    }

}

export default Deploy;