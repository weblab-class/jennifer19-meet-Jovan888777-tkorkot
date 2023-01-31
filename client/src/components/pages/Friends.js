import React, { useEffect, useState } from "react";
import { get, post } from "../../utilities";
import "./Friends.css";


import ProfileDisplay from "../modules/ProfileDisplay";
import FriendDisplay from "../modules/FriendDisplay";
import "./Friends.css";

const Friends = (props) => {
  /*
  */
  const [users, setUsers] = useState([]);
  const [filteredUsers, setfilteredUsers] = useState([]);
  const [loaded, setLoaded] = useState(false);


  const loadUsers = () => {
    get("/api/users")
      .then((allUsers) => setUsers(allUsers))
      .catch((err) => console.log(`failed to get users:${err}`));

  }

  const searching = (text) => {
    if (text !== "") {
      setfilteredUsers(users.filter((element) => {return element.name.toLowerCase().includes(text)}));
      setLoaded(true);
    }
    else setLoaded(false);
  }

  useEffect(() => {
    loadUsers();
  }, [props]);

  return (
    <div>
      <h1> Friends </h1>
      <div className="search-wrapper">
        <label for="search">Search Users</label>
        <input type="search" id = "search" onChange={(text)=>{searching(text.target.value);}}></input>
          {loaded ? filteredUsers.map((element) => (
            <FriendDisplay name = {element.name} kerb = {element.kerb} my_id = {element._id} user_id = {props.userId} handleProfile = {props.handleProfile} reqs = {element.requests} friends = {element.friends}/>
          )) : users.map((element) => (
            <FriendDisplay name = {element.name} kerb = {element.kerb} my_id = {element._id} user_id = {props.userId} handleProfile = {props.handleProfile} reqs = {element.requests} friends = {element.friends}/> ))}        
      </div>
    </div>
  );
};

export default Friends;
