import React, { useState } from "react";
import "./AssigningTaskPopout.css"


function AssigningTaskPopout ({onClose}) {

    return(
        <div className="popout">

            {/* top layer */}
            <div className="close-button">
            <p className="wording">Task Assigning</p>
            <button onClick={onClose} >Close</button>
            </div>

            {/* Assigning Task */}


        </div>
    )
}

export default AssigningTaskPopout;