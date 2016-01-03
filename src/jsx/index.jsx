import React from 'react';

var Mascot = React.createClass({
  render() {
    return (
      <div className="mascot" style={ {
        background: 'url(' + this.props.src + ')' + ' center/contain no-repeat',
        width: '100%',
        height: '100%'
      } }>
      </div>
    );
  }
});

var Messages = React.createClass({
  getInitialState() {
    return {
      messages: this.props.messages || []
    };
  },
  render() {
    var messages = this.state.messages.map((message) => {
      return <li key={ message.id }
        className={ `messages__item ${message.type}` }>
        <pre className={ 'messages__item__body' }>
          { Array.isArray(message.body) ? message.body.join('\n') : message.body }
        </pre>
      </li>;
    });
    return (
      <ul className="messages">
        { messages }
      </ul>
    );
  }
});

var Input = React.createClass({
  getInitialState() {
    return {
      placeholder: this.props.placeholder
    };
  },
  sendMessage(e) {
    if (e.keyCode == 13) {
      this.props.sendMessage(e.target.value);
      this.refs.input.value = '';
    }
  },
  render() {
    var placeholder = this.state.placeholder;
    if (placeholder === '') {
      placeholder = 'Input Text';
      if (process.env.MOPS_VOICE_SHORTCUT) {
        placeholder = process.env.MOPS_VOICE_SHORTCUT;
      }
    }
    return (
      <div className="input">
        <input ref="input"
          type="text"
          className="input__text"
          placeholder={ placeholder }
          onKeyDown={ this.sendMessage } />
      </div>
    );
  }
});

export {
  Mascot,
  Messages,
  Input,
};
