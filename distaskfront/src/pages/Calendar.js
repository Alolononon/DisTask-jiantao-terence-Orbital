
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getDay, startOfWeek } from "date-fns";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Calendar, dateFnsLocalizer, momentLocalizer  } from "react-big-calendar";
import { format } from "date-fns/format";
import { parse } from "date-fns";
import moment from 'moment-timezone';
import {Dropdown, DropdownButton} from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';

const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone; // Get the user's time zone
moment.tz.setDefault(userTimeZone);
const localizer = momentLocalizer(moment);


export default function CalendarPage() {
    const username = sessionStorage.getItem('username')
    const [AllTasks, setAllTasks] =useState([])
    const [refresh, setRefresh] = useState(false);
    const [status, setstatus] = useState("incomplete")
    const [filteredTasks, setFilteredTasks] = useState([])
    const [events, setEvents] = useState([])
    const [filter, setFilter] = useState(" Incomplete Tasks only");
    
    //fetch all task data
    useEffect(()=> {
        const fetchTodos = async () => {
          try{
            const response = await axios.post('http://localhost:5000/fetchAllTasks', {username})
            setAllTasks(response.data.tasks)
            return
            } catch (error) {
              console.error('Error feetching ToDos from database: ', error)
          }
        }
        fetchTodos();
    }, [refresh,username]);


    //fitler
    useEffect(()=> {

        if(filter===" All Tasks"){
            setFilteredTasks( AllTasks )
        } 
        else if(filter===" Main Tasks only"){
            const parentTaskIds = AllTasks.map(task => task.id)
            const mainTasks = AllTasks.filter(task=> !task.parentID || !parentTaskIds.includes(task.parentID) )
            setFilteredTasks( mainTasks)
        }
        else if(filter===" Incomplete Main Tasks with its Subtasks"){
            const parentTaskIds = AllTasks.map(task => task.id)
            const mainTasks = AllTasks.filter(task=> !task.completed && (!task.parentID || !parentTaskIds.includes(task.parentID)) )
            
            const collatingTasks = new Set(mainTasks);
            const findSubtasks = (parentId) => {
                AllTasks.forEach(task => {
                    if (task.parentID === parentId) {
                        collatingTasks.add(task);
                        findSubtasks(task.id); // Recursively find subtasks
                    }
                });
            };

            mainTasks.forEach(task=> findSubtasks(task.id))
            setFilteredTasks( Array.from(collatingTasks))
        }
        else if(filter===" Incomplete Tasks only"){
            const parentTaskIds = AllTasks.map(task => task.id)
            const mainTasks = AllTasks.filter(task=> !task.completed && (!task.parentID || !parentTaskIds.includes(task.parentID)) )
            
            const collatingTasks = new Set(mainTasks);
            const findSubtasks = (parentId) => {
                AllTasks.forEach(task => {
                    if (!task.completed && task.parentID === parentId ) {
                        collatingTasks.add(task);
                        findSubtasks(task.id); // Recursively find subtasks
                    }
                });
            };

            mainTasks.forEach(task=> findSubtasks(task.id))
            setFilteredTasks( Array.from(collatingTasks))
        }
        else if(filter === " Incomplete Main Tasks"){
            const parentTaskIds = AllTasks.map(task => task.id)
            const mainTasks = AllTasks.filter(task=> !task.completed && ( !task.parentID || !parentTaskIds.includes(task.parentID)) )

            setFilteredTasks( mainTasks)
        }

    },[AllTasks, filter])



    // compacting filtered tasks into a format for Big Calendarrrrr
    useEffect(()=> {
        setEvents(
            filteredTasks.map((task) => ({
                title: task.taskContent,
                allDay: task.dueDate.isFullDay,
                start: new Date(task.dueDate.date),
                end: new Date(task.dueDate.date),
                completed : task.completed,
            }))
        )
    },[AllTasks,filteredTasks])

    
    // style for the events in the calendar
    const eachEventStyleControl = (event) => {
        const style = {
            style: {
                textDecoration:event.completed ? 'line-through' : 'none',
                color: event.completed ? 'gray' : 'black',
                backgroundColor: event.completed ? '#d3d3d3' : '#add8e6',
            }
        }
        return style;
    }



    return (
        <div>
            <h1>Due Date Calendar</h1>
            
            
            <Dropdown>
                <Dropdown.Toggle>
                    <FontAwesomeIcon icon={faFilter} />
                    {filter}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                    <Dropdown.Item onClick={()=> setFilter(" Incomplete Tasks only")}>Incomplete Tasks only</Dropdown.Item>
                    <Dropdown.Item onClick={()=> setFilter(" All Tasks")}>All Tasks</Dropdown.Item>
                    <Dropdown.Item onClick={()=> setFilter(" Incomplete Main Tasks with its Subtasks")}> Incomplete Main Tasks with its Subtasks</Dropdown.Item>
                    <Dropdown.Item onClick={()=> setFilter(" Main Tasks only")}>Main Tasks only</Dropdown.Item>
                    <Dropdown.Item onClick={()=> setFilter(" Incomplete Main Tasks")}> Incomplete Main Tasks</Dropdown.Item>
                    
                </Dropdown.Menu>

            </Dropdown>



            <Calendar 
                localizer={localizer} 
                events={events} 
                startAccessor="start" 
                endAccessor="end" 
                style={{height:500, margin:"50px"}}
                eventPropGetter={eachEventStyleControl}
                titleAccessor={event => event.title} // Accessor to display only the title
            />
        </div>
    )
}