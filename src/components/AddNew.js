import React, { Component } from "react";

export default class AddNew extends Component {
  render() {
    return (
      <div>
        <form onSubmit={this.props.addNewQuote}>
          <input
            type="text"
            onChange={this.props.handleNewQuote}
            value={this.props.newAuthor}
            placeholder="Author"
          />
          <input
            type="text"
            onChange={this.props.handleNewQuote}
            value={this.props.newQuote}
            placeholder="Quote"
          />
          <input type="submit" value="Add New!" />
        </form>
      </div>
    );
  }
}
