import React, { Component } from "react";
import PubSub from "pubsub-js";
import "./App.css";
import Header from "../Header/Header";
import Main from "../Main/Main";
import Footer from "../Footer/Footer";

class App extends Component {
  constructor() {
    super();
    this.addNewTodo = this.addNewTodo.bind(this);
    this.toggleStatus = this.toggleStatus.bind(this);
    this.delItem = this.delItem.bind(this);
    this.toggleEditing = this.toggleEditing.bind(this);
    this.saveAndCloseEdit = this.saveAndCloseEdit.bind(this);
    this.getUnCompletedCount = this.getUnCompletedCount.bind(this);
    this.toggleSelectedAll = this.toggleSelectedAll.bind(this);
    this.state = {
      todoList: [
        {
          content: '123',
          completed: false,
          editing: false,
        },
        {
          content: '345',
          completed: false,
          editing: false,
        },
      ],
      unCompletedCount: 0, // 已完成数量
      selectedAll: false, // 是否全选
    };
  }

  componentDidMount() {
    this.getUnCompletedCount();

    PubSub.subscribe('addNewTodo', (fnName, newTodo) => {
      this.addNewTodo(newTodo);
    });
    PubSub.subscribe('delItem', (fnName, index) => {
      this.delItem(index);
    });
    PubSub.subscribe('toggleStatus', (fnName, index) => {
      this.toggleStatus(index);
    });
    PubSub.subscribe('toggleEditing', (fnName, index) => {
      this.toggleEditing(index);
    });
    PubSub.subscribe('saveAndCloseEdit', (fnName, obj) => {
      this.saveAndCloseEdit(obj);
    });
    PubSub.subscribe('toggleSelectedAll', () => {
      // console.log(fnName)
      this.toggleSelectedAll();
    });
  }

  componentDidUpdate() {
  }

  // 统计未完成数量
  getUnCompletedCount() {
    let unCompletedCount = 0;
    //判断未完成项目
    this.state.todoList.forEach((item, index) => {
      if (!item.completed) {
        unCompletedCount++;
      }
    });
    this.setState({
      unCompletedCount
    });
  }

  // 新增todo
  addNewTodo(newTodo) {
    const { todoList } = this.state;
    let { unCompletedCount } = this.state;
    unCompletedCount++;
    todoList.push({
      content: newTodo,
      completed: false,
    });
    this.setState({
      todoList,
      unCompletedCount,
    });
  }

  // 切换是否完成状态
  toggleStatus(index) {
    const { todoList } = this.state;
    const { completed } = todoList[index];
    let { unCompletedCount } = this.state;
    completed ? unCompletedCount++ :unCompletedCount--;

    todoList[index].completed = !completed;

    this.setState({
      todoList,
      unCompletedCount,
    });
    if (unCompletedCount === todoList.length) {
      this.setState({
        selectedAll: false,
      });
    } else {
      this.setState({
        selectedAll: true,
      });
    }
  }

  // 删除todo
  delItem(index) {
    const { todoList } = this.state;
    let { unCompletedCount } = this.state;
    const ITEM = todoList[index];
    ITEM.completed ? unCompletedCount : unCompletedCount--;
    todoList.splice(index, 1);
    this.setState({
      todoList,
      unCompletedCount,
    });
  }

  // 切换编辑
  toggleEditing(index) {
    const { todoList } = this.state;
    const { editing } = todoList[index].editing;
    todoList.forEach((item, index1) => {
      if (index1 !== index) {
        item.editing = false;
      }
    });
    todoList[index].editing = !editing;
    this.setState({
      todoList,
    });
  }

  // 编辑并保存
  saveAndCloseEdit(obj) {
    const INDEX = obj.index;
    const CONTENT = obj.content;
    const { todoList } = this.state;
    todoList[INDEX].content = CONTENT;
    todoList[INDEX].editing = false;
    this.setState({
      todoList,
    });
  }

  // 全选/取消全选
  toggleSelectedAll() {
    const { todoList } = this.state;
    let { selectedAll } = this.state;
    if (selectedAll) {
      todoList.forEach((item) => {
        item.completed = false;
      });
    } else {
      todoList.forEach((item) => {
        item.completed = true;
      });
    }
    selectedAll = !selectedAll;
    this.setState({
      todoList,
      selectedAll,
    });
  }

  render() {
    return (
      <div className="App">
        <section className="todoapp">
          <Header />
          <Main
            todoList={this.state.todoList}
            toggleStatus={this.toggleStatus}
            toggleEditing={this.toggleEditing}
            toggleSelectAll={this.toggleSelectedAll}
          />
          <footer id="footer" style={{ display: 'block' }}>
            <span id="todo-count">
              <strong>
                {this.state.unCompletedCount}
              </strong>
              item left
            </span>
            <ul id="filters">
              <li>
                <a className="selected" href="#/all">
                  All
                </a>
              </li>
              <li>
                <a href="#/active">Active</a>
              </li>
              <li>
                <a href="#/completed">Completed</a>
              </li>
            </ul>
          </footer>
        </section>
        <Footer />
      </div>
    );
  }
}

export default App;
