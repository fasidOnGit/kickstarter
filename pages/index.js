import * as React from "react";
import web3 from '../ethereum/web3';

export class HomeComponent extends React.Component {
    state = {
      accounts: []
    };
    async componentDidMount() {
        this.state.accounts = await web3.getAccounts()
    }

    render() {
        return `<h1>{this.state.accounts[0}</h1>`
    }
}