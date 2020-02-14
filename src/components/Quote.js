import React, { Component } from "react";

export default class Quote extends Component {
  render() {
    return (
      <div>
        <p
          style={
            this.props.liked
              ? { color: "green" }
              : this.props.disliked
              ? { color: "red", textDecoration: "line-through" }
              : { color: "black" }
          }
        >
          {this.props.text}
          <br />
          <br />
          By: {this.props.author}
          <button onClick={this.props.likeClicked}> =)</button>
          <button onClick={this.props.dislikeCliked}> =(</button>
        </p>
      </div>
    );
  }
}
