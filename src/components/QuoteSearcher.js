import React, { Component } from "react";
import Quote from "./Quote";

export default class QuoteSearcher extends Component {
  state = {
    quotes: [],
    fetching: true,
    search: ""
  };

  componentDidMount = () => {
    this.fetchData("tree");
  };

  fetchData = request => {
    fetch(
      `https://quote-garden.herokuapp.com/quotes/search/${encodeURIComponent(
        request
      )}`
    )
      .then(data => data.json())
      .then(({ results }) =>
        this.setState({
          ...this.state,
          quotes: results.map(result => {
            result.liked = false;
            result.disliked = false;
            return result;
          }),
          fetching: false
        })
      );
  };

  like = async id => {
    const changedQuotes = [...this.state.quotes].map(quote => {
      if (quote._id === id) {
        return { ...quote, liked: true, disliked: false };
      }
      return quote;
    });
    this.setState({ quotes: changedQuotes });
  };

  dislike = id => {
    const changedQuotes = [...this.state.quotes].map(quote => {
      if (quote._id === id) {
        return { ...quote, disliked: true, liked: false };
      }
      return quote;
    });
    this.setState({ quotes: changedQuotes });
  };

  search = e => {
    e.preventDefault();
    this.setState({ fetching: true });
    this.fetchData(this.state.search);
  };

  handleChange = e => {
    this.setState({ search: e.target.value });
  };

  render() {
    if (this.state.fetching) {
      return <h1>Loading...</h1>;
    } else {
      const liked = this.state.quotes.filter(quote => quote.liked).length;
      const disliked = +this.state.quotes.filter(quote => quote.disliked)
        .length;
      return (
        <div>
          <form onSubmit={this.search}>
            <input onChange={this.handleChange} value={this.state.search} />
            <input type="submit" value="Search!" />
          </form>
          <h2>
            Liked: {liked} / Disliked: {disliked}
          </h2>
          {[...this.state.quotes].map(quote => (
            <Quote
              key={quote._id}
              text={quote.quoteText}
              author={quote.quoteAuthor}
              likeClicked={() => this.like(quote._id)}
              dislikeCliked={() => this.dislike(quote._id)}
              liked={quote.liked}
              disliked={quote.disliked}
            />
          ))}
        </div>
      );
    }
  }
}
