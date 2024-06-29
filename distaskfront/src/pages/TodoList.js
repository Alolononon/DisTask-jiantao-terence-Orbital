import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TodoList.css';
import AssigningTaskPopout from '../components/AssigningTaskPopout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMessage, faUsers } from '@fortawesome/free-solid-svg-icons';
import ChatPopout from '../components/ChatPopout';



const TodoList = ({ userId }) => {
const [IncompletedTasks, setIncompletedTasks] = useState([]);
const [CompletedTasks, setCompletedTasks] = useState([]);
const [AllTasks, setAllTasks] =useState([])
const [newTodo, setNewTodo] = useState('');
const [refresh, setRefresh] = useState(false);
const [showCompleted, setShowCompleted] = useState(false)
const [newSubTodo, setSubTodo] = useState({})
const username = sessionStorage.getItem('username')

const addNewTask = async (parentID, taskContent, participants) => {
  
  try {
    if(parentID){

    }
    
    // await axios.post('http://distask-backend.vercel.app:5000/NewTask', {username, taskContent, parentID})
     await axios.post('http://localhost:5000/NewTask', {username, taskContent, parentID, participants})
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
      // setIncompletedTasks(response.data.incompleteTasks)
      // setCompletedTasks(response.data.completedTasks)
      setAllTasks(response.data.tasks)
      } catch (error) {
        console.error('Error feetching ToDos from database: ', error)
    }
  }

  fetchTodos();
  }, [refresh,username]);
  
  
  const handleKeyPress = (e) => {
    if (e.key==='Enter' && newTodo.trim()){
      const participants = [username]
      addNewTask(null, newTodo, participants);
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
  
const handleAddNewSubTask = async (e, id, participants) => {
  if(e.key === 'Enter' && newSubTodo[id].trim()) {
    await addNewTask(id, newSubTodo[id], participants);
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
  const [AssignTaskPopoutstate, setAssignTasknPopoutstate] = useState({});
  const toggleAssignTaskPopOut = (id) => {
    setAssignTasknPopoutstate((prevStates) => ({
      ...prevStates,
      [id]: !prevStates[id],
    }));
  };

//toggle Chat Popout
const [ChatPopoutstate, setChatPopoutstate] = useState({})
const toggleChatPopout = (id) => {
  setChatPopoutstate((prevStates) => ({
    ...prevStates,
    [id]: !prevStates[id],
  }));
};



  const renderTodoComponent = (ID, listofTaskssss, status) => {
    const parentTaskIds = new Set(listofTaskssss.map(task => task.id));
    
    let tasks = [];
    if(ID===null){
      if(status==="incomplete"){
        tasks = listofTaskssss.filter((task) =>  task.completed===false && (task.parentID === ID || !parentTaskIds.has(task.parentID)));
      } else if (status==="completed") {
        tasks = listofTaskssss.filter((task) =>  task.completed===true && (task.parentID === ID || !parentTaskIds.has(task.parentID)));
      }
    } else {
      tasks = listofTaskssss.filter((task) =>   task.parentID === ID);
    }
    
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
          {tasks.map((todo,index) => (

            <React.Fragment key={index}>
              { (!ID || taskExpansion[todo.parentID])  && (
                <li className='list-item' >

                <span className={`taskContent ${todo.completed===false? "active" : "inactive"}`}>{todo.taskContent}</span>
                <div>
                <small className='createdBy'>created by {todo.username}</small>
                
                { todo.usersAssigned && todo.usersAssigned.includes(username) && (
                  <span className='AssignedToYou'>Assigned To You</span>
                ) }
                
                </div>
                

                
                <div className='Task2ndLayer'>
                  {todo.completed===false 
                  ? (<button onClick={() => clickcompleted(todo.id)} className='completed-button'> completed </button>)
                  :(<button onClick={() => clickcompleted(todo.id)}> {todo.completed ? "incomplete" : 'completed'} </button>)
                  }

                  {/* adding SUBTASK */}
                  <div className='Adding-Subtask'>
                    <input
                      type='text'
                      value={newSubTodo[todo.id]}
                      onChange={(e) => handleSubTaskInputChange(todo.id, e.target.value)}
                      placeholder='Add Sub-task'
                      onKeyDown={(e)=> handleAddNewSubTask(e, todo.id, todo.participants )}
                    />
                  </div>

                  {/* POPOUT Assigning Task to friend */}
                  <div>
                    <button onClick={()=> toggleAssignTaskPopOut(todo.id)} className='toggleAssignTaskPopOut' >
                      <FontAwesomeIcon icon={faUsers} />
                    </button>
                    {AssignTaskPopoutstate[todo.id] && 
                      <AssigningTaskPopout onClose={()=> toggleAssignTaskPopOut(todo.id)} taskid={todo.id} creator={todo.username} onRefresh={()=>setRefresh(!refresh)}/>
                    }
                  </div>


                  {/* Chat Popout */}
                  <div>
                    <button onClick={()=> toggleChatPopout(todo.id)} className='toggleChatPopout'>
                      <FontAwesomeIcon icon={faMessage} />
                    </button>
                    {ChatPopoutstate[todo.id] && 
                      <ChatPopout onClose={()=> toggleChatPopout(todo.id)} taskid={todo.id} username={username}/>
                    }
                  </div>






                </div>
              
            
            <div style={{marginLeft:'20px'}} >
            {renderTodoComponent(todo.id, listofTaskssss)}
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
        <button onClick={()=> addNewTask(null, newTodo)} disabled={!newTodo.trim()} className='addNewTaskbutton'>
          Add
        </button>
      </div>

      <div>
        {/* incomplete Taskkksss----------------------- */}
        {renderTodoComponent(null,AllTasks, "incomplete")}


        {/* completed Taskkksss----------------------- */}
        <button onClick={toggleShowCompletedTasks}>
          {showCompleted ? 'Hide completed Tasks' : 'Show completed Tasks'}
        </button>
        {showCompleted && (
          renderTodoComponent(null, AllTasks, "completed")
        )}
      </div>

    </div>
  );
};

export default TodoList;
