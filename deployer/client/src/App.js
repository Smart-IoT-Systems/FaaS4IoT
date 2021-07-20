import React from 'react';
import { Layout, Menu, Breadcrumb } from 'antd';
import { UserOutlined, LaptopOutlined, NotificationOutlined } from '@ant-design/icons';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import 'antd/dist/antd.css';
import './App.css';
import ListHubs from "./Components/ListHubs";
import ListDevices from "./Components/ListDevices";
import Deploy from "./Components/Deploy";
import ListRuntime from './Components/ListRuntime';
import ListFunctionResources from './Components/ListFunctionResources';


const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

const DataUrl = '/functionResources';
const DataUrl2 = '/Runtimes';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      runtimes: [],
      ressources: []
    };

    this.changeRessources = this.changeRessources.bind(this);
    this.changeRuntimes = this.changeRuntimes.bind(this);
  }


  componentDidMount() {

    this.fetchData(DataUrl2, res => {
      var run = [];
      run = res.runtimes
      this.fetchData(DataUrl, res => {
        this.setState({
          runtimes: run,
          ressources: res.FunctionResources
        });
      });
    });
  }

  fetchData = (url, callback) => {
    fetch(url)
      .then(res => res.json())
      .then(json => {
        callback(json);
      });
  };

  changeRuntimes = function (val) {
    this.setState({
      runtimes: val,
    });
  }

  changeRessources = function (val) {
    this.setState({
      ressources: val,
    });
  }

  render() {
    return (
      <Router>
        <Layout>
          <Header className="header">
            <div className="logo" />
            <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
              <Menu.Item key="1">FaaS4IoT</Menu.Item>
              <Menu.Item key="2">GeneSIS</Menu.Item>
            </Menu>
          </Header>
          <Layout>
            <Sider width={200} className="site-layout-background">
              <Menu
                mode="inline"
                defaultSelectedKeys={['1']}
                defaultOpenKeys={['sub2', 'sub1', 'sub3']}
                style={{ height: '100%', borderRight: 0 }}
              >
                <SubMenu key="sub1" icon={<UserOutlined />} title="Infrastructure">
                  <Menu.Item key="1">FaaS4IoT Hubs List<Link to="/" /></Menu.Item>
                  <Menu.Item key="2">Devices Registry<Link to="/ListDevices" /></Menu.Item>
                </SubMenu>
                <SubMenu key="sub2" icon={<LaptopOutlined />} title="Functions">
                  <Menu.Item key="5">Deploy a function<Link to="/DeployFunction" /></Menu.Item>
                  <Menu.Item key="6">Running functions</Menu.Item>
                  <Menu.Item key="3">Runtime templates<Link to="/Runtime" /></Menu.Item>
                  <Menu.Item key="7">Functions Resource registry<Link to="/ListFunctionResources" /></Menu.Item>
                </SubMenu>
                <SubMenu key="sub3" icon={<NotificationOutlined />} title="Topology">
                  <Menu.Item key="9">Topology Repositories</Menu.Item>
                  <Menu.Item key="10">Running topologies</Menu.Item>
                  <Menu.Item key="11">option11</Menu.Item>
                  <Menu.Item key="12">option12</Menu.Item>
                </SubMenu>
              </Menu>
            </Sider>
            <Layout style={{ padding: '0 24px 24px' }}>
              <Breadcrumb style={{ margin: '16px 0' }}>
                <Breadcrumb.Item>Home</Breadcrumb.Item>
                <Breadcrumb.Item>List</Breadcrumb.Item>
                <Breadcrumb.Item>App</Breadcrumb.Item>
              </Breadcrumb>
              <Content
                className="site-layout-background"
                style={{
                  padding: 24,
                  margin: 0,
                  minHeight: 280,
                }}
              >
                <Route exact path="/" component={ListHubs} />
                <Route exact path="/ListDevices" component={ListDevices} />
                <Route exact path="/ListFunctionResources"><ListFunctionResources data={this.state.ressources} changeRessources={this.changeRessources} /></Route>
                <Route exact path="/DeployFunction"><Deploy ressources={this.state.ressources} runtimes={this.state.runtimes} changeRuntimes={this.changeRuntimes} changeRessources={this.changeRessources} /></Route>
                <Route exact path="/Runtime"><ListRuntime data={this.state.runtimes} changeRuntimes={this.changeRuntimes} /></Route>
              </Content>
            </Layout>
          </Layout>
        </Layout>
      </Router >
    );
  }
}

export default App;
