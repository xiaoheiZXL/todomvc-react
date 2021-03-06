import React, { Component } from 'react';
import PubSub from 'pubsub-js';
import TodoItem from '../TodoItem/TodoItem';

class Main extends Component {
  toggleSelectedAll(){
    PubSub.publish('toggleSelectedAll');
  }
  render() {
    return (
      <section className="main">
        <input
          id="toggle-all"
          className="toggle-all"
          type="checkbox"
          onClick={this.toggleSelectedAll}
        />
        <label htmlFor="toggle-all">
          Mark all as complete
        </label>
        <ul className="todo-list">
          {
            this.props.todoList.map((item, index) => {
              return (
                <TodoItem
                  content={item.content}
                  key={index}
                  completed={item.completed}
                  editing={item.editing}
                  index={index}
                />
              );
            })
          }
        </ul>
      </section>
    );
  }
}

export default Main;
