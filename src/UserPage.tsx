// UserPage.tsx

import { useState, useEffect } from "react";
import { useParams } from "react-router";
import Diary from "./diary";

const UserPage = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const kakaoId = useParams().kakaoId;
  const date = useParams().date;

  useEffect(() => {
    fetch(`http://3.38.118.228:8080/api/dailyReport/user/${kakaoId}/${date}`)
      .then((response) => response.json())
      .then((data) => setSelectedUser(data));
  }, [kakaoId, date]);

  if (!selectedUser) return <div>No data available</div>;
  return <div key={`${kakaoId}-${date}`} className="diaries"><div className="diary"><Diary selectedUser={selectedUser} selectedDate={date} /></div></div>;
};

export default UserPage;