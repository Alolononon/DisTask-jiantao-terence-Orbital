import React from "react";
import "./Popout.css"


function AssigningTaskPopout ({onClose}) {

    return(
        <div className="popout">

            {/* top layer */}
            <div className="top-layer">
                <p className="wording">Task Assigning</p>
                <button onClick={onClose} className="close">Close</button>
            </div>

            {/* Assigning Task */}
            

        </div>
    )
}

export default AssigningTaskPopout;