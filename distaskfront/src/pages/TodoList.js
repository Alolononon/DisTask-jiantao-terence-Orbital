import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TodoList.css';

const TodoList = ({ userId }) => {
  const [IncompletedTasks, setIncompletedTasks] = useState([]);
  const [CompletedTasks, setCompletedTasks] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [refresh, setRefresh] = useState(false);
  const [showCompleted, setShowCompleted] = useState(false)
  const [newSubTodo, setSubTodo] = useState({})
  
  const username = sessionStorage.getItem('username')

  const addNewTask = async (parentID, taskContent) => {
    
    try {
      const todo = await axios.post('http://localhost:5000/NewTask', {username, taskContent, parentID})
      setRefresh(!refresh)
    } catch (error) {
      console.error('Error adding new task: ', error)
    }
    setNewTodo('')
  }



  useEffect(()=> {
    const fetchTodos = async () => {
      try{
        const response = await axios.post('http://localhost:5000/fetchAllTasks', {username})
        console.log(response.error)
        setIncompletedTasks(response.data.incompleteTasks)
        setCompletedTasks(response.data.completedTasks)
      } catch (error) {
        console.error('Error feetching ToDos from database: ', error)
      }
    }

    fetchTodos();
  }, [refresh]);


  const handleKeyPress = (e) => {
    if (e.key==='Enter' && newTodo.trim()){
      addNewTask(null, newTodo);
    }
  }

  const toggleShowCompletedTasks = () => {
    setShowCompleted(!showCompleted)
  }

  const clickcompleted = async (id) => {
    try{
      await axios.post('http://localhost:5000/completeTask', {id})
      setRefresh(!refresh)
    } catch (error) {
      console.error('error updating completed task in ToDos: ', error)
    }
  }




  const handleSubTaskInputChange = (id, value) => {
    setSubTodo({
      ...newSubTodo,
      [id]: value,
    })
  }
  
  const handleAddNewSubTask = async (e, id) => {
    if(e.key === 'Enter' && newSubTodo[id].trim()) {
      await addNewTask(id, newSubTodo[id]);
      handleSubTaskInputChange(id,'');
    }
  }



  const renderTodoComponent = (ID) => {
    const tasks = IncompletedTasks.filter((IncompletedTasks) => IncompletedTasks.parentID === ID);
    return (
      // {/* incompleted Task++++++++++++++++++++++++++++++ */}
      <ul className='list'>
      {tasks.map((todo) => (
        <li className='list-item' key={todo.id}>
          {todo.taskContent}
          <small className='createdBy'>created by {todo.username}</small>
          <button onClick={() => clickcompleted(todo.id)}> completed </button>

          {/* adding SUBTASK */}
          <input
            type='text'
            value={newSubTodo[todo.id]}
            onChange={(e) => handleSubTaskInputChange(todo.id, e.target.value)}
            placeholder='Add Sub-task'
            onKeyDown={(e)=> handleAddNewSubTask(e, todo.id )}
          />
        <div style={{marginLeft:'20px'}} >
        {renderTodoComponent(todo.id)}
        </div>
        </li>
        
      ))}
    </ul>
  )}
  







  return (
    <div className='box'>
      <h1>To-Do List</h1>

      <div className='footer'>
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a task"
          onKeyDown={(e) => handleKeyPress(e)}
        />
        <button onClick={()=> addNewTask(null, newTodo)} disabled={!newTodo.trim()}>Add</button>
      </div>

      <div>
        {renderTodoComponent(null)}


        {/* completed Taskkksss----------------------- */}
        <button onClick={toggleShowCompletedTasks}>
          {showCompleted ? 'Hide completed Tasks' : 'Show completed Tasks'}
        </button>
        {showCompleted && (
          <ul className='list'>
            {CompletedTasks.map((todo) => (
              <li className='list-item' key={todo.id}>
                {todo.taskContent}
                <small className='createdBy'>created by {todo.username}</small>
                <button onClick={() => clickcompleted(todo.id)}> {todo.completed ? "incomplete" : 'completed'} </button>
              </li>
            ))}
          </ul>
        )}
      </div>

    </div>
  );
};

export default TodoList;
