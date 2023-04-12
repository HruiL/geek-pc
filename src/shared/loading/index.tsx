import React, { Component } from "react";

class Loading extends Component {
  render() {
    return (
      <div className="justify-content align-items">
        <i className="fas fa-spinner fa-pulse"></i>
      </div>
    );
  }
}

export default Loading;
