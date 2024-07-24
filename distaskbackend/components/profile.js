
const connection = require('./db')
const multer = require('multer')

const express = require('express');
const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({storage: storage});


// const profile = (req,res)=> {
   

//     console.log("here")



//     const query = ''
//     connection.query(query,[], (err,result)=> {
//         if(err){
//             console.error('Error editing task: ' + err)
//             res.status(403).json({error: err.message})
//         } else{
//             console.log("profile pic updated")
//             res.json({})
//         }

//     })
// }


const profile = (req, res) => {

    // Middleware to handle the file upload
    upload.single('profilePic')(req, res, (err) => {
        const action = req.body.action;

        //inserting profile picture into a account
        if(action === "updating profilePic"){
            if (err) {
                return res.status(500).json({ error: 'Error uploading file' });
            }

            const profilePic = req.file.buffer;
            const username = req.body.username; 
    
            const query = 'UPDATE sakila.accounts SET profilePic = ? WHERE username = ?';
            connection.query(query, [profilePic, username], (err, result) => {
                if (err) {
                    console.error('Error saving profile picture: ' + err);
                    res.status(500).json({ error: err.message });
                } else {
                    console.log('Profile picture updated');
                    res.json({ message: 'Profile picture updated successfully' });
                }
            });
            
        }
            
            
        else if(action === "fetchProfilePhoto"){
            console.log('here')
            if(err){
                return res.status(500).json({error: 'error fetching profile picture'})
            }

            const username = req.body.username; 
            
            const query = 'SELECT profilePic FROM sakila.accounts WHERE username = ?';
            connection.query(query, [ username], (err, result) => {
                if (err) {
                    console.error('Error saving profile picture: ' + err);
                    return res.status(500).json({ error: err.message });
                }
                if (result.length > 0 && result[0].profilePic) {
                    const profilePic = result[0].profilePic;
                    
                    const imgBuffer = Buffer.from(profilePic, 'base64'); // Assuming profilePic is stored as base64 in the database
                    res.setHeader('Content-Type', 'image/jpeg'); // Adjust the content type if your images are not JPEGs
                    res.send(imgBuffer);
                } else {
                    console.log('pic not found')
                    res.json(null);
                }
            });

        }

        else if(action === "fetchMultipleProfilePhotos"){
            if(err){
                return res.status(500).json({error: 'error fetching multiple profile pictures'})
            }
            const listOfUsernames = req.body.listOfUsernames; 
            
            const query = 'SELECT username, profilePic FROM sakila.accounts WHERE username IN (?)';
            connection.query(query, [listOfUsernames], (err, results) => {
                if (err) {
                    console.error('Error fetching multiple profile pictures: ' + err);
                    return res.status(500).json({ error: err.message });
                }

                // const profilePics = results.map(result => ({
                //     username: result.username,
                //     profilePic: result.profilePic ? Buffer.from(result.profilePic).toString('base64') : null
                // }));
                const profilePics = {};
                results.forEach(result => {
                    profilePics[result.username] = result.profilePic ? Buffer.from(result.profilePic).toString('base64') : null;
                });
        

                //console.log(profilePics)
                
                res.json({ profilePics });
            });
        }
 
             
            
            
    });




};

module.exports = profile;