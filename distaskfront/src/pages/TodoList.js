import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TodoList.css';
import AssigningTaskPopout from '../components/AssigningTaskPopout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMessage, faUsers, faSquareCheck, faXmark ,faSortDown, faSortUp, faPlus, faGear, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import {  faSquare, faCalendarPlus, faSquareCaretUp, faSquareCaretDown } from '@fortawesome/free-regular-svg-icons';
import ChatPopout from '../components/ChatPopout';
import CalanderPopout from '../components/CalanderPopout';
import { format } from 'date-fns';


const TodoList = ({ userId }) => {
  const [IncompletedTasks, setIncompletedTasks] = useState([]);
  const [CompletedTasks, setCompletedTasks] = useState([]);
  const [AllTasks, setAllTasks] =useState([])
  const [newTodo, setNewTodo] = useState('');
  const [refresh, setRefresh] = useState(false);
  const [showCompleted, setShowCompleted] = useState(false)
  const [newSubTodo, setSubTodo] = useState({})
  const username = sessionStorage.getItem('username')

  const addNewTask = async (parentID, taskContent, participants, dueDate) => {
    
    try {
      if(!Array.isArray(participants)) {
        participants = [participants]
      }
      
      await axios.post('http://localhost:5000/NewTask', {username, taskContent, parentID, participants,dueDate})
      setRefresh(!refresh)
    } catch (error) {
      console.error('Error adding new task: ', error)
      }
    setNewTodo('')
    setNewToDoDueDate(null)
    //vvvvv after creating a subtask, it will appear instantly
    settaskExpansion( (prev)=> ({
      ...prev,
      [parentID]: true,
    }))
  }



  useEffect(()=> {
    const fetchTodos = async () => {
      try{
        const response = await axios.post('http://localhost:5000/fetchAllTasks', {username})
        //console.log(response.data.tasks)
        // setIncompletedTasks(response.data.incompleteTasks)
        // setCompletedTasks(response.data.completedTasks)
        setAllTasks(response.data.tasks)
        
        return
        } catch (error) {
          console.error('Error feetching ToDos from database: ', error)
      }
    }

    fetchTodos();
    }, [refresh,username]);
    
    
    const handleKeyPress = (e) => {
      if (e.key==='Enter' && newTodo.trim()){
        const participants = [username]
        addNewTask(null, newTodo, participants, newToDoDueDate);
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
    
  const handleAddNewSubTask = async (e, id, participants, dueDate) => {
    if(e === 'Enter' && newSubTodo[id] && newSubTodo[id].trim()) {
      await addNewTask(id, newSubTodo[id], JSON.parse(participants), dueDate);
      handleSubTaskInputChange(id,'');
      deleteSubtaskDueDate(id)
    }
  }

  const handleAddDueDate =  async (taskId, dueDate) => {
    try{
      await axios.post('http://localhost:5000/calender', {action:"Add Duedate on Task" , taskId, dueDate})
      setRefresh(!refresh)
    }catch(err) {
      console.error('error updating due date in task: ', err)
    }
  }

  const handleDeleteDueDate = async (taskId) => {
    try{
      await axios.post('http://localhost:5000/calender', {action:"Deleting Duedate on Task" , taskId})
      setRefresh(!refresh)
    }catch (err) {
      console.error('Error deleting duedate from task', err)
    }
  }

  // for task editing
  const [storingEditingTask, setStoringEditingTask] = useState({})
  const handleTaskEditing = (id,value, prevValue) => {
    setStoringEditingTask({
      ...storingEditingTask,
      [id]: value
    })
    return value;
  }

  //handling task edited
  const handleEditingTask = async (taskId, newTaskContent, oldTaskContent) =>{
    if(newTaskContent && !(newTaskContent===oldTaskContent)){
      try{
        await axios.post('http://localhost:5000/editingTask', {taskId,newTaskContent })
        setRefresh(!refresh)
      }catch(err){
        console.error(err)
      }

      toggleTaskEditing(taskId,oldTaskContent)
      
    }
  }


  //TOGGLE SHIT ===========================================================
    // toggle subtask expansion
    const [taskExpansion, settaskExpansion] = useState({})
    const toggleTaskExpansion = (id) => {
    settaskExpansion( (prev)=> ({
      ...prev,
      [id]: !prev[id],
      }))
      }

    // toggle subtask hideout
    const [subTaskHideout, setSubTaskHideout] = useState({})
    const toggleSubtaskhideout = (id) => {
      setSubTaskHideout( (prev)=> ({
      ...prev,
      [id]: !prev[id],
      }))
    }

    // toggle TaskSetting Gear Icon thingy
    const [subTaskSettingHideout, setTaskSettingHideout] = useState({})
    const toggleSettingsHideout = (id) => {
      setTaskSettingHideout( (prev)=> ({
      ...prev,
      [id]: !prev[id],
      }))
    }

    //toggle Task Editing
    const [TaskEditing, setTaskEditing] = useState({})
    const toggleTaskEditing = (id,taskContent) => {
      setTaskEditing((prevStates) => ({
        ...prevStates,
        [id]: !prevStates[id],
      }));
      
        setStoringEditingTask( (prev)=> ({
          ...prev,
          [id]: taskContent
        }))
      
    };

      
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

  //toggle calander popout
  const [CalanderPopoutstate, setCalanderPopoutstate] = useState({})
  const toggleCalanderPopout = (id) => {
    setCalanderPopoutstate((prevStates) => ({
      ...prevStates,
      [id]: !prevStates[id],
    }));
  };

  const [subTaskCalanderPopoutstate, setSubTaskCalanderPopoutstate] = useState({})
  const togglesubtaskCalanderPopout = (id) => {
    setSubTaskCalanderPopoutstate((prevStates) => ({
      ...prevStates,
      [id]: !prevStates[id],
    }));
  };

  const [subtaskCalenderDueDate, setSubtaskCalenderDueDate] = useState({})
  const saveSubtaskDueDate = (id, date) => {
    setSubtaskCalenderDueDate((prevStates) => ({
      ...prevStates,
      [id]: date,
    }))
  }
  const deleteSubtaskDueDate = (id) => {
    setSubtaskCalenderDueDate((prevStates) => ({
      ...prevStates,
      [id]: null,
    }))
  }

  




  // ToDo Component that is called for every single task +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  const renderTodoComponent = (ID, listofTaskssss, status) => {
    const parentTaskIds = new Set(listofTaskssss.map(task => task.id));
    
    let tasks = [];
    if(!ID){
      if(status==="incomplete"){
        tasks = listofTaskssss.filter((task) =>  !task.completed && (task.parentID === ID || !parentTaskIds.has(task.parentID)));
      } else if (status==="completed") {
        tasks = listofTaskssss.filter((task) =>  task.completed && (task.parentID === ID || !parentTaskIds.has(task.parentID)));
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
        { ID && (
          <span onClick={()=>toggleTaskExpansion(ID)} className='toggle-span'>
            {taskExpansion[ID] 
              ? <FontAwesomeIcon icon={faSquareCaretUp} size="lg" />
              : <FontAwesomeIcon icon={faSquareCaretDown} size="lg"/>
            }
          </span>
        ) }

        

          <ul className='list'>
          {tasks.map((todo,index) => (

            <React.Fragment key={index}>
              { (!ID || taskExpansion[todo.parentID])  && (
                <li className='list-item' >
                  <div className='Task-firstrow'>
                    {!todo.completed 
                        ? <FontAwesomeIcon icon={faSquare} size='xl' onClick={() => clickcompleted(todo.id)} className='completed-button'/>
                        : <FontAwesomeIcon icon={faSquareCheck} size='xl' onClick={() => clickcompleted(todo.id)}/>
                    }
                    <span className={`taskContent ${!todo.completed? "active" : "inactive"}`}>
                      {TaskEditing[todo.id] 
                        ? (
                          <div>
                            <input
                              type='text'
                              onChange={(e)=>handleTaskEditing(todo.id, e.target.value, todo.taskContent)}
                              value={storingEditingTask[todo.id]}
                              onKeyDown={(e)=> {
                                if(e.key === 'Enter'){
                                  handleEditingTask(todo.id, storingEditingTask[todo.id], todo.taskContent)
                                }
                              }}
                            />
                            <button onClick={()=>handleEditingTask(todo.id, storingEditingTask[todo.id], todo.taskContent)} disabled={!storingEditingTask[todo.id] || storingEditingTask[todo.id]===todo.taskContent} className='TaskEditingConfirmbutton'>confirm</button>
                          </div>
                        )
                        : <>{todo.taskContent}</>
                      }
                    </span>

                  </div>

                  <div>
                    <small className='createdBy'>created by {todo.username}</small>
                    {todo.dueDate && 
                    <span className='TaskDueDate'>
                      <span onClick={()=> toggleCalanderPopout(todo.id)}>Due on {todo.dueDate.isFullDay ? format(todo.dueDate.date, 'dd/MM/yyyy') : format(todo.dueDate.date, 'dd/MM/yyyy hh:mm a')}</span>
                      <FontAwesomeIcon icon={faXmark} onClick={()=>handleDeleteDueDate(todo.id)}/>
                    </span>}

                    { todo.usersAssigned && todo.usersAssigned.includes(username) && (
                      <span className='AssignedToYou'>Assigned To You</span>
                    ) }
                    
                  </div>
                  

                  
                  <div className='Task2ndLayer'>
                    {/* {!todo.completed
                    ? (<button onClick={() => clickcompleted(todo.id)} className='completed-button'> completed </button>)
                    : (<button onClick={() => clickcompleted(todo.id)}> {todo.completed ? "incomplete" : 'completed'} </button>)
                    } */}
                    




                    {/* adding SUBTASK */}
                    <div className='Adding-Subtask'>

                      <span onClick={()=>toggleSubtaskhideout(todo.id)} className='toggle-subtask-hideout'>
                        <FontAwesomeIcon icon={faPlus} size='lg'/>
                      </span>
                      {subTaskHideout[todo.id] &&
                        <div >
                          <input
                            type='text'
                            value={newSubTodo[todo.id]}
                            onChange={(e) => handleSubTaskInputChange(todo.id, e.target.value)}
                            placeholder='Add Sub-task'
                            onKeyDown={(e)=> handleAddNewSubTask(e.key, todo.id, todo.participants, subtaskCalenderDueDate[todo.id] )}
                            className='AddSubTaskInput'
                          />
                          <button className='addNewTaskbutton' onClick={()=> handleAddNewSubTask('Enter', todo.id, todo.participants, subtaskCalenderDueDate[todo.id] )}>Add</button>
                          {/* DueDate for Subtask */}
                          {newSubTodo[todo.id] && (
                          subtaskCalenderDueDate[todo.id]  
                          ? <span className='TaskDueDate'>
                              <span onClick={()=> togglesubtaskCalanderPopout(todo.id)}>Due on {subtaskCalenderDueDate[todo.id].isFullDay ? format(subtaskCalenderDueDate[todo.id].date, 'dd/MM/yyyy') : format(subtaskCalenderDueDate[todo.id].date, 'dd/MM/yyyy hh:mm a')}</span>
                              <FontAwesomeIcon icon={faXmark} onClick={()=>deleteSubtaskDueDate(todo.id)}/>
                            </span>
                          : <button className='add_dueDate' onClick={()=> togglesubtaskCalanderPopout(todo.id)}>
                              <FontAwesomeIcon size="xl" icon={faCalendarPlus}  />
                            </button>)}
                          {subTaskCalanderPopoutstate[todo.id] && 
                            <CalanderPopout onClose={()=> togglesubtaskCalanderPopout(todo.id)}  confirmDate={(date)=>saveSubtaskDueDate(todo.id, date)} previousDueDate={newToDoDueDate}/>
                          }
                        </div>
                      
                      }
                    </div>


                    <div className='TaskLayer2ndright'>
                      
                      {subTaskSettingHideout[todo.id] &&
                        <div className='settingComponents'>

                          {/* Editing the Task Text */}
                          
                          <div>
                            <button className='ToggleEditTask' onClick={()=> toggleTaskEditing(todo.id,todo.taskContent)}>
                              <FontAwesomeIcon icon={faPenToSquare} />
                            </button>
                          </div>




                          {/* POPOUT Assigning Task to friend */}
                          <div>
                            <button onClick={()=> toggleAssignTaskPopOut(todo.id)} className='toggleAssignTaskPopOut' >
                              <FontAwesomeIcon  icon={faUsers} />
                            </button>
                            {AssignTaskPopoutstate[todo.id] && 
                              (<AssigningTaskPopout onClose={()=> toggleAssignTaskPopOut(todo.id)} taskid={todo.id} creator={todo.username} onRefresh={()=>setRefresh(!refresh)}/>)
                            }
                          </div>


                          {/* Chat Popout */}
                          <div>
                            <button onClick={()=> toggleChatPopout(todo.id)} className='toggleChatPopout'>
                              <FontAwesomeIcon size="" icon={faMessage} />
                            </button>
                            {ChatPopoutstate[todo.id] && 
                              <ChatPopout onClose={()=> toggleChatPopout(todo.id)} taskid={todo.id} username={username}/>
                            }
                          </div>


                          {/* Calender Due Date Popout */}
                          <button className='add_dueDate' onClick={()=> toggleCalanderPopout(todo.id)}>
                            <FontAwesomeIcon size="" icon={faCalendarPlus}  />
                          </button>
                          {CalanderPopoutstate[todo.id] && 
                            <CalanderPopout onClose={()=> toggleCalanderPopout(todo.id)}  confirmDate={(duedate)=> handleAddDueDate(todo.id,duedate)} previousDueDate={todo.dueDate}/>
                          }
                        </div>
                      }

                      <span onClick={()=>toggleSettingsHideout(todo.id)} className='settingHideoutIcon'>
                        <FontAwesomeIcon icon={faGear} size='lg'/>
                      </span>

                    </div>
                    
                    
                  </div>
                
              
              <div style={{marginLeft:'20px'}} >
              {renderTodoComponent(todo.id, listofTaskssss, status)}
              </div>



            </li>
            )}
            </React.Fragment>
          
            ))}
          </ul>
        
    </div>
  )}
  
  const [newToDoDueDate, setNewToDoDueDate] = useState(null)
  const [togglNewDueDate, setToggleNewDueDate] = useState(false)

  return (
    <div className='box'>
      <h1>To-Do List</h1>

      <div className='footer'>
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a Task"
          onKeyDown={(e) => handleKeyPress(e)}
        />
        <button onClick={()=> addNewTask(null, newTodo, username, newToDoDueDate)} disabled={!newTodo.trim()} className='addNewTaskbutton'>
          Add
        </button>
        
        {/* DUE DATE  */}
        {newTodo.trim() && 
          <div>
            {newToDoDueDate 
              ? (
                <div className='TaskDueDate'>
                  <span  onClick={()=> setToggleNewDueDate(true)} >Due on {newToDoDueDate.isFullDay ? format(newToDoDueDate.date, 'dd/MM/yyyy') : format(newToDoDueDate.date, 'dd/MM/yyyy hh:mm a')}</span>
                  <FontAwesomeIcon icon={faXmark} onClick={()=>setNewToDoDueDate(null)}/>

                </div>)
              : (
                  <button className='add_dueDate' onClick={()=> setToggleNewDueDate(true)}>
                    <FontAwesomeIcon size="xl" icon={faCalendarPlus}  />
                  </button>)}
                  {togglNewDueDate && 
                    <CalanderPopout onClose={()=> setToggleNewDueDate(false)}  confirmDate={setNewToDoDueDate} previousDueDate={newToDoDueDate}/>
                  }
                
            
          </div>
        }

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
