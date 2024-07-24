import axios from 'axios';
import { useEffect, useState } from 'react';

const fetchMultipleProfilePic = async (listOfUsernames) => {
    



    try {
        const formData = new FormData();
        listOfUsernames.forEach(username => formData.append('listOfUsernames[]', username));
        formData.append('action', "fetchMultipleProfilePhotos");
        
        const response = await axios.post('/profile', formData, {
            responseType: 'json',
        });
        // console.log(response.data.profilePics);

        // Assuming response data contains an array of base64 strings
        return response.data.profilePics;
    } catch (err) {
        console.error('Error fetching profile pictures: ', err);
        return null;
    }


    
}


export default fetchMultipleProfilePic;