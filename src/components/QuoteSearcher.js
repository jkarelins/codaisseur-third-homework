import React, { Component } from "react";
import Quote from "./Quote";
import AddNew from "./AddNew";

export default class QuoteSearcher extends Component {
  state = {
    quotes: [],
    fetching: true,
    search: "",
    newAuthor: "",
    newQuote: ""
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

  addNewQuote = e => {
    e.preventDefault();
    const newToAdd = {
      _id: Math.floor(Math.random() * Math.floor(1000000)),
      quoteText: this.state.newQuote,
      quoteAuthor: this.state.newAuthor,
      liked: false,
      disliked: false
    };
    const quotes = [...this.state.quotes];
    quotes.unshift(newToAdd);
    this.setState({
      quotes
    });
  };

  handleNewQuote = e => {
    e.target.placeholder === "Quote"
      ? this.setState({ newQuote: e.target.value })
      : this.setState({ newAuthor: e.target.value });
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

  calculateAuthors = () => {
    const authors = this.state.quotes.map(quote => quote.quoteAuthor);
    const uniqueAuthors = [...new Set(authors)];
    return uniqueAuthors.length;
  };

  getUniqueQuotes = () => {
    const bufQuotes = [];
    const newBufArr = [];
    this.state.quotes.forEach(quote => {
      if (!bufQuotes.includes(quote.quoteText)) {
        bufQuotes.push(quote.quoteText);
        newBufArr.push(quote);
      }
    });
    this.setState({ quotes: newBufArr });
  };

  render() {
    if (this.state.fetching) {
      return <h1>Loading...</h1>;
    } else if (this.state.quotes.length === 0) {
      return (
        <div>
          <form onSubmit={this.search}>
            <input onChange={this.handleChange} value={this.state.search} />
            <input type="submit" value="Search!" />
          </form>
          <h1 style={{ color: "red" }}>
            Sorry nothing found. Try to search one more time!
          </h1>
        </div>
      );
    } else {
      const liked = this.state.quotes.filter(quote => quote.liked).length;
      const disliked = +this.state.quotes.filter(quote => quote.disliked)
        .length;
      const quotesInList = +this.state.quotes.length;
      const authorsCount = this.calculateAuthors();

      return (
        <div>
          <form onSubmit={this.search}>
            <input
              type="text"
              onChange={this.handleChange}
              value={this.state.search}
            />
            <input type="submit" value="Search!" />
          </form>
          <h2>
            Liked: {liked} / Disliked: {disliked}
          </h2>
          <h3>
            Quotes in list: {quotesInList}, distinct authors: {authorsCount}{" "}
          </h3>
          <AddNew
            handleNewQuote={this.handleNewQuote}
            newAuthor={this.state.newAuthor}
            addNewQuote={this.addNewQuote}
            newQuote={this.state.newQuote}
          />
          <br />
          <button onClick={this.getUniqueQuotes}>Get Unique Quotes</button>
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
