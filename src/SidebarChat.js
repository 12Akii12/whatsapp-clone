import React from 'react';
import "./SidebarChat.css";
import { Avatar } from "@material-ui/core";

function SidebarChat() {
    return (
        <div className="sidebarChat">
          <Avatar src="https://www.redicals.com/wp-content/uploads/2013/07/php_programmer.jpg" />
            <div className="sidebarChat_info">
                <h2>Room Name</h2>
                <p>This is the last message</p>
            </div>
        </div>
    )
}

export default SidebarChat
