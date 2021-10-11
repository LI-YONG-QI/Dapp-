pragma solidity  >=0.4.22 <0.9.0;

import "./Owner.sol";

contract TodoList is Owner{
  uint public taskCount = 0;

  struct Task {
    uint id;
    string content;
    bool completed;
  }

  mapping(uint => Task) public tasks;

  event TaskCreated(
    uint id,
    string content,
    bool completed
  );

  event TaskCompleted(
    uint id,
    bool completed
  );

  event TaskDelete(
    uint id,
    bool deleted
  );

  constructor() public {
    createTask("Check out dappuniversity.com");
  }

  function createTask(string memory _content) public isOwner{
    taskCount ++;
    tasks[taskCount] = Task(taskCount, _content, false);
    emit TaskCreated(taskCount, _content, false);
  }
  
  function toggleCompleted(uint _id) public {
    Task memory _task = tasks[_id];
    _task.completed = !_task.completed;
    tasks[_id] = _task;
    emit TaskCompleted(_id, _task.completed);
  }

  function deleteTask(uint _id) public { // reference zombie delete mapping course
    
    for (uint i = 0; i <= taskCount ; i++){
      if(i>=_id){
        tasks[i] = tasks[i+1];
      }
    }
    delete tasks[taskCount];
    taskCount --;
    emit TaskDelete(_id, true);
  }

  function renderTask(uint _id) public view returns (string memory){
    return (tasks[_id].content);
  }
}