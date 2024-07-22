import { useEffect, useState } from "react";
import './ProfilePage.css'
import axios from 'axios';
import { addISOWeekYears } from "date-fns";

const ProfilePage = () => {

    const [user, setUser] = useState({})
    const [file, setFile] = useState(null);
    const username = sessionStorage.getItem('username')

    useEffect(()=>{
        const fetchProfilePic = async () => {
            try{
                const formData = new FormData();
                formData.append('username',username)
                formData.append('action',"fetchProfilePhoto")
                const response = await axios.post('/profile', formData, {
                    responseType: 'json', 
                });
    
                const binaryData = new Uint8Array(response.data.profilePic.data);
                const base64String = btoa(String.fromCharCode(...binaryData));
                const imageUrl = `data:image/jpeg;base64,${base64String}`;
                
                setUser(prevState => ({
                    ...prevState,
                    profilePic: imageUrl
                }));
            }catch(err){
                console.error('error fetching phrofile piture: ', err)
            }
        }
        fetchProfilePic();
    },[])


    // const handleFileChange = (e) => {
    //     const file = e.target.files[0];
    //     setFile(file);
    //     if (file) {
    //         const reader = new FileReader();
    //         reader.onloadend = () => {
    //           setUser(prevState => ({
    //             ...prevState,
    //             profilePic: reader.result
    //           }));
    //         };
    //         reader.readAsDataURL(file);
    //       }
    // }

    // making the picture become 300 x 300 px for making space in database
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFile(file);
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const img = new Image();
                img.src = reader.result;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    
                    // Set the dimensions to 300x300
                    const maxDimension = 300;
                    let width = img.width;
                    let height = img.height;
    
                    // Calculate the new dimensions while preserving the aspect ratio
                    if (width > height) {
                        if (width > maxDimension) {
                            height *= maxDimension / width;
                            width = maxDimension;
                        }
                    } else {
                        if (height > maxDimension) {
                            width *= maxDimension / height;
                            height = maxDimension;
                        }
                    }
    
                    canvas.width = width;
                    canvas.height = height;
                    ctx.drawImage(img, 0, 0, width, height);
                    
                    canvas.toBlob((blob) => {
                        setFile(blob);
                        setUser(prevState => ({
                            ...prevState,
                            profilePic: canvas.toDataURL('image/jpeg')
                        }));
                    }, 'image/jpeg');
                };
            };
            reader.readAsDataURL(file);
        }
    };
    



    const handleSubmit = async (e) => {
        
        e.preventDefault();
        
        if (file) {
            const formData = new FormData();
            formData.append('profilePic', file);
            formData.append('username',username)
            formData.append('action',"updating profilePic")

            try {
                const response = await axios.post('/profile', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                console.log(response.data.message);
            } catch (error) {
                console.error('There was an error updating the profile picture!', error);
            }
            setFile(null)
            

        }
    }; 

    return(
        <div className="profile">
            <h1>Your Profile</h1>

        <div>


            {user.profilePic
                ?   <div className="profile-pic-container">
                        <img src={user.profilePic } alt="Profile" />
                    </div>
                :   <div className="profile-pic-container">
                        no profile picture
                    </div>
            }

            <div>
                <input
                    type="file"
                    onChange={handleFileChange}
                />
                {file &&
                    <button type="submit" onClick={handleSubmit}>Update Profile</button>

                }
            </div>

            <div>
                <h3>Your Username: {username}</h3>
            </div>



        </div>

        </div>
    )
}

export default ProfilePage;