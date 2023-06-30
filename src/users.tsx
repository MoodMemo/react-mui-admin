// in src/users.tsx
import { useMediaQuery } from "@mui/material";
import { List, SimpleList, Datagrid, TextField, useRecordContext } from "react-admin";
import { useEffect, useState } from "react";
import './users.css';

export const UserList = () => {
  const isSmall = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const [userList, setUserList] = useState([]);
  const [info, setInfo] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    fetch("http://3.38.118.228:8080/api/userStampCount")
      .then((response) => response.json())
      .then((data) => {
        setUserList(data.data);
        setInfo(data.info);
        // console.log(data[0].kakaoId);
      });
  }, []);

  useEffect(() => {
    if (refresh && selectedUser) {
      fetch(`http://3.38.118.228:8080/api/dailyReport/${userId}`)
        .then((response) => response.json())
        .then((data) => setSelectedUser(data));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh])


  const CustomRow = () => {
    const record = useRecordContext();
    // setUserId(record.kakaoId); // handleClick 안에 있으면 handleClick 이벤트가 끝나고 나서 실행되기 때문에 뺐다.

    const handleClick = () => {
      setUserId(record.kakaoId);
      fetch(`http://3.38.118.228:8080/api/dailyReport/final/${userId}`)
        .then((response) => response.json())
        .then((data) => setSelectedUser(data));
    };

    return (
      <div onClick={handleClick}>
        <span><TextField source="username" record={record} /></span>
        <span> </span>
        <span><TextField source="stampCount" record={record} /></span>
      </div>
    );
  };

  const handleRefresh = () => {
    setRefresh(true);
  };

  const handleSave = () => {
    // 데이터를 POST 요청의 본문에 포함시킬 객체 생성
    const data = {
      // 필요한 데이터 속성들을 추가
      kakaoId: selectedUser.kakaoId,
      username: selectedUser.username,
      date: selectedUser.date,
      title: selectedUser.title,
      bodyText: selectedUser.bodyText,
      keyword1st: selectedUser.keyword1st,
      keyword2nd: selectedUser.keyword2nd,
      keyword3rd: selectedUser.keyword3rd,
      time: selectedUser.time
      // ... 추가 데이터 속성들
    };
  
    fetch("http://3.38.118.228:8080/api/dailyReport", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data), // 데이터를 JSON 문자열로 변환하여 본문에 포함
    })
      .then((response) => response.json())
      .then((responseData) => {
        // POST 요청에 대한 응답 처리
        console.log(responseData);
        // 추가적인 로직 수행
      })
      .catch((error) => {
        // 에러 처리
        console.error("Error:", error);
      });
  };

  return (
    <div>
      <h2 style={{
        margin: '30px 0px 0px 20px'
      }}>{info}</h2>

      {!selectedUser && (
        <List>
          {isSmall ? (
            <SimpleList
              primaryText={(record) => record.username}
              secondaryText={(record) => record.kakaoId}
              data={userList}
              // onClick={handleClick}
            />
          ) : (
            <Datagrid data={userList}>
              {/* <TextField source="kakaoId" />
              <TextField source="username" /> */}
              <CustomRow />
            </Datagrid>
          )}
        </List>
      )}

      {selectedUser && (
        <div className="selectedUser">
          <h3>kakaoId : {selectedUser.kakaoId}</h3>
          <h2>username : {selectedUser.username}</h2>
          <br></br>
          <div className="dbDiary">
            <div className="dateBg">
              <p className="date">{selectedUser.date}</p>
            </div>

            <p className="title">{selectedUser.title}</p>
            
            <hr className="line"></hr>

            <p className="body">{selectedUser.bodyText}</p>

            <div className="keywords">
              <p className="keyword1st">{selectedUser.keyword1st}</p>
              <p className="keyword2nd">{selectedUser.keyword2nd}</p>
              <p className="keyword3rd">{selectedUser.keyword3rd}</p>
            </div>

            {/* <p>{selectedUser.time}</p> */}
          </div>
            <button onClick={handleRefresh} style={{
              margin: '20px'
            }}>Refresh</button>
            <button onClick={handleSave} style={{
              margin: '20px'
            }}>Save</button>
        </div>
      )}
    </div>
  );
};
