import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';

class FuncForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = { id: '', runtime: '', src: '', ctx: '' };

        this.handleIdChange = this.handleIdChange.bind(this);
        this.handleRuntimeChange = this.handleRuntimeChange.bind(this);
        this.handleFunctionChange = this.handleFunctionChange.bind(this);
        this.handleCtxChange = this.handleCtxChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event) {
        console.log(JSON.stringify(this.state));
        //Send request for deployment to server
        fetch('http://127.0.0.1:8080/deploy', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.state)
        }).then(response => response.json())
            .then(response => {
                if (response.started) {
                    alert(JSON.stringify(response));
                }
            });
    }

    handleIdChange(event) {
        this.setState({ id: event.target.value });
    }

    handleRuntimeChange(event) {
        this.setState({ runtime: event.target.value });
    }

    handleFunctionChange(event) {
        this.setState({ src: event.target.value });
    }

    handleCtxChange(event) {
        this.setState({ ctx: event.target.value });
    }

    render() {
        return (
            <form noValidate autoComplete="off" onSubmit={this.handleSubmit}>
                <div><TextField id="Id" label="Name" onChange={this.handleIdChange} /></div>
                <div><TextField id="Runtime" label="Runtime" onChange={this.handleRuntimeChange} /></div>
                <div><TextField id="Function" label="Function" onChange={this.handleFunctionChange} /></div>
                <div><TextField id="ctx" label="Context" onChange={this.handleCtxChange} /></div>
                <div><input type="submit" value="submit" /></div>
            </form>
        );
    }
}

export default FuncForm;