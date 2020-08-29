import React, { Component } from 'react';
export default class App extends Component {
    state = {
        count: 0
    }
    increment = () => {
        let { count } = this.state
        let value = this.selectNumber.value;
        this.setState({ count: count + value * 1 })
    }
    decrement = () => {
        let { count } = this.state
        let value = this.selectNumber.value;
        this.setState({ count: count - value * 1 })
    }
    incrementIfOdd = () => {
        let { count } = this.state
        let value = this.selectNumber.value;
        if (count % 2 === 1) {
            this.setState({ count: count + value * 1 })
        }
    }
    incrementAsync = () => {
        let { count } = this.state
        let value = this.selectNumber.value;
        setTimeout(() => {
            this.setState({ count: count + value * 1 })
        }, 1000);


    }
    render() {
        let { count } = this.state
        return (
            <div>
                <h3>当前计数为{count}</h3>
                <select ref={select => this.selectNumber = select}>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                </select> &nbsp;
                <button onClick={this.increment}>+</button>&nbsp;
                <button onClick={this.decrement}>-</button>&nbsp;
                <button onClick={this.incrementIfOdd}>increment if odd</button>&nbsp;
                <button onClick={this.incrementAsync}>increment async</button>&nbsp;
            </div>
        )
    }
}