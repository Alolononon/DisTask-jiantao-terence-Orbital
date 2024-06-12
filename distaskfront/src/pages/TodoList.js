import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TodoList.css';
import AssigningTaskPopout from '../components/AssigningTaskPopout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers } from '@fortawesome/free-solid-svg-icons';




const TodoList = ({ userId }) => {
  const [IncompletedTasks, setIncompletedTasks] = useState([]);
  const [CompletedTasks, setCompletedTasks] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [refresh, setRefresh] = useState(false);
  const [showCompleted, setShowCompleted] = useState(false)
  const [newSubTodo, setSubTodo] = useState({})
  const [AssignTaskPopoutstate, setAssignTasknPopoutstate] = useState({});
  const username = sessionStorage.getItem('username')

  const addNewTask = async (parentID, taskContent) => {
    
    try {
      //const todo = await axios.post('http://distask-backend.vercel.app:5000/NewTask', {username, taskContent, parentID})
      const todo = await axios.post('http://localhost:5000/NewTask', {username, taskContent, parentID})
      setRefresh(!refresh)
    } catch (error) {
      console.error('Error adding new task: ', error)
    }
    setNewTodo('')
    //vvvvv after creating a subtask, it will appear instantly
    settaskExpansion( (prev)=> ({
      ...prev,
      [parentID]: true,
    }))
  }



  useEffect(()=> {
    const fetchTodos = async () => {
      try{
        // const response = await axios.post('http://distask-backend.vercel.app:5000/fetchAllTasks', {username})
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


  // toggle subtask expansion
  const [taskExpansion, settaskExpansion] = useState({})
  const toggleTaskExpansion = (id) => {
    settaskExpansion( (prev)=> ({
      ...prev,
      [id]: !prev[id],
    }))
  }

// toggle assigningTask Popout
const toggleAssignTaskPopOut = (id) => {
  setAssignTasknPopoutstate((prevStates) => ({
    ...prevStates,
    [id]: !prevStates[id],
  }));
};




  const renderTodoComponent = (ID) => {
    const tasks = IncompletedTasks.filter((IncompletedTasks) => IncompletedTasks.parentID === ID);
    

    if(tasks.length===0){
      return null;
    }

    return (
      // {/* incompleted Task++++++++++++++++++++++++++++++ */}
      <div>
        { (ID!==null) && (
          <span onClick={()=>toggleTaskExpansion(ID)} className='toggle-span'>
            {taskExpansion[ID] ? '▼' : '▶'}
          </span>
        ) }

        

          <ul className='list'>
          {tasks.map((todo) => (

            <React.Fragment>
              { (!todo.parentID || taskExpansion[todo.parentID])  && (
                <li className='list-item' >

                {todo.taskContent}
                <small className='createdBy'>created by {todo.username}</small>

                
                <div className='Task2ndLayer'>
                  <button onClick={() => clickcompleted(todo.id)}> completed </button>

                  {/* adding SUBTASK */}
                  <div className='Adding-Subtask'>
                    <input
                      type='text'
                      value={newSubTodo[todo.id]}
                      onChange={(e) => handleSubTaskInputChange(todo.id, e.target.value)}
                      placeholder='Add Sub-task'
                      onKeyDown={(e)=> handleAddNewSubTask(e, todo.id )}
                    />
                  </div>

                  {/* POPOUT Assigning Task to friend */}
                  <div>

                    <button onClick={()=> toggleAssignTaskPopOut(todo.id)}>
                      <FontAwesomeIcon icon={faUsers} />
                    </button>
                    {AssignTaskPopoutstate[todo.id] && 
                      <AssigningTaskPopout onClose={()=> toggleAssignTaskPopOut(todo.id)}>

                      </AssigningTaskPopout>}
                  </div>
                </div>
              
            
            <div style={{marginLeft:'20px'}} >
            {renderTodoComponent(todo.id)}
            </div>



            </li>
            )}
            </React.Fragment>
          
            ))}
          </ul>
        
    </div>
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
