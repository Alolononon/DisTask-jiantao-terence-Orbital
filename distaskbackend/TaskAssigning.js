const connection = require("./db");



const TaskAssigning = async (req,res) => {
    const response = req.body
    
    // getting all friends
    if (response.action ==="getting all friends") {
        
        const {username} = response

        const query = `
        SELECT user_id, friend_id
        FROM sakila.friends
        WHERE user_id = ? AND status = 'accepted'
        UNION
        SELECT user_id, friend_id
        FROM sakila.friends
        WHERE friend_id = ? AND status = 'accepted'
        `;
        
        connection.query(query, [username, username], (err, results) => {
            if (err) throw err;

            const friends = results.map(data => {
                return data.user_id === username ? data.friend_id : data.user_id;
            })
            
            return res.json({friends});
          });
    }


    if(response.action==="get Participants from Task") {
        const {taskid} = response;
        const query = `
        SELECT participants FROM sakila.todos WHERE id = ? `;

        connection.query(query, [taskid], (err,result)=> {
            if(err) throw err;
            let participants = JSON.parse(result[0].participants);
            
            return res.json({participants})
        })
    }



    if(response.action==='adding participants into task') {
        const {participant, taskid} = response;
        query = `UPDATE sakila.todos SET participants = JSON_ARRAY_APPEND(participants, \'$\', ? ) WHERE id = ? `

        connection.query(query, [participant, taskid], (err,result)=> {
            if(err) throw err;
            console.log(result)
            res.status(200).json({})
        })
    }

    if(response.action==='remove participants from task'){
        const {participant, taskid} = response;
        query = `UPDATE sakila.todos SET participants = JSON_REMOVE(participants, JSON_UNQUOTE(JSON_SEARCH(participants,\'one\', ?))) WHERE id = ? `
        connection.query(query, [participant, taskid], (err,result)=> {
            if(err) throw err;
            console.log(result)
            res.status(200).json({})
        })
    }


    //getting ppl thats assigned to this task
    if(response.action==='get Ppl assigned from Task'){
        const {taskid} = response;
        const query = `SELECT usersAssigned FROM sakila.todos WHERE id = ? `;
        connection.query(query, [taskid], (err, result) => {
            if (err) throw err;
            let usersAssigned = result[0].usersAssigned ? JSON.parse(result[0].usersAssigned) : [];
            return res.json({ usersAssigned });
        });
    }


    if(response.action==='assign people in task') {
        const {participant, taskid} = response;
        const query = `UPDATE sakila.todos SET usersAssigned = JSON_ARRAY_APPEND(IFNULL(usersAssigned, '[]'), '$', ?) WHERE id = ?`;

        connection.query(query, [participant, taskid], (err, result) => {
            if (err) throw err;
            res.status(200).json({});
        });
    }



    if(response.action==='Remove assigned people in task'){
        const {participant, taskid} = response;
        query = `UPDATE sakila.todos SET usersAssigned = JSON_REMOVE(usersAssigned, JSON_UNQUOTE(JSON_SEARCH(usersAssigned,\'one\', ?))) WHERE id = ? `
        connection.query(query, [participant, taskid], (err,result)=> {
            if(err) throw err;
            console.log(result)
            res.status(200).json({})
        })
    }

}

module.exports = TaskAssigning;