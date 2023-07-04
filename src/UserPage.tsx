// UserPage.tsx

import { useState, useEffect } from "react";
import { useParams } from "react-router";
import Diary from "./diary";

const UserPage = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const kakaoId = useParams().kakaoId;

  console.log(kakaoId);
  useEffect(() => {
    fetch(`http://3.38.118.228:8080/api/dailyReport/user/${kakaoId}`)
        .then((response) => response.json())
        .then((data) => setSelectedUser(data));
  }, []);

  if(!selectedUser) return <></>;
  return <div className="diaries"><div className="diary"><Diary selectedUser={selectedUser}/></div></div>;
}

export default UserPage;