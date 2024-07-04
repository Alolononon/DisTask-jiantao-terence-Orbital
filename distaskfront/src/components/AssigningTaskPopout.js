import React, { useEffect, useState } from "react";
import "./Popout.css"
import "./AssigningTaskPopout.css"
import axios from "axios";

function AssigningTaskPopout ({onClose, taskid, creator, onRefresh}) {
    const [refresh,setRefresh] = useState(false)
    const [currentSection, setCurrentSection] = useState("addPeople") //addPeople or assign
    const username = sessionStorage.getItem('username')
    const [friendList, setFriendList] = useState([])
    const [taskParticipants, setTaskParticipants] = useState([])
    const [notTaskParticipants, setNotTaskParticipants] = useState([])
    const [taskAssignedPpl, setTaskAssignedPpl] = useState([])
    const [notTaskAssignedPpl, setNotTaskAssignedPpl] = useState([])
    const [taskAssignedtoYOU, setTaskAssignedtoYOU] = useState(false)


    //FETCHING DATA=======================================================
    useEffect( ()=> {

        //getting all the friends
        const gettingAllFriends = async (username)=> {
            const response = await axios.post('http://localhost:5000/TaskAssigning', {action:"getting all friends", username})
            setFriendList( response.data.friends);
        }
        gettingAllFriends(username);

        //getting participants from this specific task
        const getParticipantsFromTask =  async (taskid)=> {
            const response = await axios.post('http://localhost:5000/TaskAssigning', {action:"get Participants from Task", taskid})
            setTaskParticipants(response.data.participants)
        }
        getParticipantsFromTask(taskid);

        //getting ppl thats assigned to this task
        const getPplAssignedToTask = async (taskid) => {
            const response = await axios.post('http://localhost:5000/TaskAssigning', {action:"get Ppl assigned from Task", taskid})
            setTaskAssignedPpl(response.data.usersAssigned)
        }
        getPplAssignedToTask(taskid)

    },[refresh])

    //data processing refresh
    useEffect(()=> {
        setNotTaskParticipants(friendList.filter(friend => !taskParticipants.includes(friend)) )
        let friendlistWUser = [username, ...friendList];
        setNotTaskAssignedPpl(friendlistWUser.filter(friend => !taskAssignedPpl.includes(friend)) )

        setTaskAssignedtoYOU(taskAssignedPpl.includes(username))
        console.log("task assigned to you:" + taskAssignedtoYOU)
        onRefresh();
    },[friendList, taskParticipants,refresh, taskAssignedPpl])





    //HANDLER=============================================================
    const handleAddPeopleInTask = async (participant) => {
        const response = await axios.post('http://localhost:5000/TaskAssigning', {action:"adding participants into task", participant, taskid})
        if(response.status===200){
            setRefresh(!refresh)
        }
    }

    const handleRemovePeopleInTask = async (participant)=> {
        const response = await axios.post('http://localhost:5000/TaskAssigning', {action:"remove participants from task", participant, taskid})
        if(response.status===200){
            setRefresh(!refresh)
        }
    }


    const handleAssignPeopleInTask = async(participant)=> {
        const response = await axios.post('http://localhost:5000/TaskAssigning', {action:"assign people in task", participant, taskid})
        if(response.status===200){
            setRefresh(!refresh)
        }
    }

    const handleRemoveAssignPeopleInTask = async(participant)=> {
        const response = await axios.post('http://localhost:5000/TaskAssigning', {action:"Remove assigned people in task", participant, taskid})
        if(response.status===200){
            setRefresh(!refresh)
        }
    }

    return(
        <div className="popout">

            {/* top layer */}
            <div className="top-layer">
                <p className="wording">Task Assigning</p>
                <button onClick={onClose} className="close">Close</button>
            </div>

            {/* Assigning Task */}
            
            <div className="topsection">
                <button className={`sectiontabbutton ${currentSection === "addPeople" ? "active" : "inactive"}`} onClick={()=>setCurrentSection("addPeople")}>
                    Add People
                </button>
                <button className={`sectiontabbutton ${currentSection === "assign" ? "active" : "inactive"}`} onClick={()=>setCurrentSection("assign")}>
                    Assigning Task
                </button>
            </div>

            <div>
            {  /* { ADDING PEOPLE HERE VVVVVVVVVVVVVVVVVVVVVVVVVVVVVV */
                (currentSection==="addPeople") && (
                    <div className="whole_list">
                        <strong>Users Added in this Task</strong>
                        <ul className="participant-list">
                            {taskParticipants.map((participant, index) => (
                                <li key={index} className="participant-item">
                                <div className="participant-info">
                                    <span className="participant-name">{participant}</span>
                                    <div className="action-container">
                                    {participant === creator 
                                        ? (<div className="action-container">
                                        <button className="creator-button" disabled>
                                          Creator (cannot be removed)
                                        </button>
                                      </div>)
                                        :  participant===username
                                        ? (<button onClick={() => handleRemovePeopleInTask(participant)} className="action-button">
                                        Leave
                                        </button>)
                                        : friendList.includes(participant) 
                                        ? (<button onClick={() => handleRemovePeopleInTask(participant)} className="action-button">
                                        Remove
                                        </button>)
                                        : (<div className="action-container">
                                            <button className="creator-button" disabled>
                                              Not in friendlist (cannot be removed)
                                            </button>
                                          </div>)
                                    }
                                    </div>
                                </div>
                                </li>
                            ))}
                        </ul>


                        



                        <strong>Add users</strong>
                        <ul className="participant-list">
                            {notTaskParticipants.map((participant, index) => (
                                <li key={index} className="participant-item">
                                <div className="participant-info">
                                    <span className="participant-name">{participant}</span>
                                    <div className="action-container">
                                    <button onClick={() => handleAddPeopleInTask(participant)} className="action-button">
                                        Add
                                    </button>
                                    </div>
                                </div>
                                </li>
                            ))}
                        </ul>
                    
                    </div>
                )
            }

            {  /* ASSIGNING PEOPLE HERE VVVVVVVVVVVVVVVVVVVVVVVVVVVVV    */
                (currentSection==="assign") && (
                    <div className="whole_list">
                        <strong>Users Assigned</strong>
                        <ul className="participant-list">
                            {taskAssignedPpl.map((participant,index) => (
                                <li key={index} className="participant-item">
                                    <div className="participant-info">
                                        <span className="participant-name">{participant}</span>
                                        <div className="action-container">
                                            <button onClick={()=>handleRemoveAssignPeopleInTask(participant)} className="action-button">
                                                Unassign
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>



                        <strong>Users Unassigned</strong>     
                        <ul className="participant-list">
                            {notTaskAssignedPpl.map((participant,index) => (
                                <li key={index} className="participant-item">
                                    <div className="participant-info">
                                        <span className="participant-name">{participant}</span>
                                        <div className="action-container">
                                            <button onClick={()=> handleAssignPeopleInTask(participant)} className="action-button">
                                                Assign
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>

                        


                    </div>
                )
            }
            </div>


        </div>
    )
}

export default AssigningTaskPopout;