// in src/users.tsx
import { useMediaQuery } from "@mui/material";
import { List, SimpleList, Datagrid, TextField, useRecordContext } from "react-admin";
import { useCallback, useEffect, useState } from "react";
import './users.css';
import Diary from "./diary";

export const UserList = () => {
  const isSmall = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const [userList, setUserList] = useState([]);
  const [info, setInfo] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [kakaoId, setKakaoId] = useState(null);
  const [userId, setUserId] = useState(null);
  const [save, setSave] = useState(false);
  const [savedUser, setSavedUser] = useState(null);
  const [selectedDate, setSelectedDate] = useState(''); // Initialize with an empty string

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
      fetch(`http://3.38.118.228:8080/api/dailyReport/${kakaoId}`)
        .then((response) => response.json())
        .then((data) => setSelectedUser(data));
    }
    setRefresh(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh]);

  useEffect(() => {
    console.log(`selectedDate: ${selectedDate}`);
  }, [selectedDate]);


  const CustomRow = () => {
    const record = useRecordContext();
    // setUserId(record.kakaoId); // handleClick 안에 있으면 handleClick 이벤트가 끝나고 나서 실행되기 때문에 뺐다.

    const handleClick = () => {
      setKakaoId(record.kakaoId);
      setUserId(record.id);

      const currentDate = new Date();
      currentDate.setDate(currentDate.getDate() - 1);
      console.log(`currentDate: ${currentDate}`);

      const formattedDate = currentDate.toISOString().split('T')[0];
      console.log(`formattedDate: ${formattedDate}`);

      setSelectedDate(formattedDate);
      fetch(`http://3.38.118.228:8080/api/dailyReport/final/${kakaoId}`)
        .then((response) => response.json())
        .then((data) => setSelectedUser(data));
    };

    return (
      <div onClick={handleClick}>
        <TextField source="username" record={record} />
        {" "}
        <TextField source="stampCount" record={record} />
      </div>
    );
  };

  //useCallback을 함으로써 메모리 할당 최적화를 했음 야호!
  const handleRefresh = useCallback(() => {
    setRefresh(true);
  }, []);

  const handleSave = () => {
    setSave(true);
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
    setSavedUser(data);
  
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
  
  const handleNewPage = () => {
    if (savedUser && selectedDate) {
      console.log(`${userId}`);
      const url = `http://3.34.55.218/api/dailyReport/user/${userId}/${selectedDate}`;
      const newWindow = window.open(url, '_blank');
      if (newWindow) {
        newWindow.document.body.innerHTML = `
          <div id="diary-container"></div>
          <script>
            function renderDiary() {
              const selectedUser = ${JSON.stringify(savedUser)};
              const diaryContainer = document.getElementById('diary-container');
              diaryContainer.innerHTML = '';
              const diaryComponent = document.createElement('div');
              diaryComponent.innerHTML = \`
                <div class="dbDiary">
                  <div class="dateBg">
                    <p class="date">\${selectedUser.date}</p>
                  </div>
                  <p class="title">\${selectedUser.title}</p>
                  <hr class="line"></hr>
                  <p class="body">\${selectedUser.bodyText}</p>
                  <div class="keywords">
                    <p class="keyword1st">\${selectedUser.keyword1st}</p>
                    <p class="keyword2nd">\${selectedUser.keyword2nd}</p>
                    <p class="keyword3rd">\${selectedUser.keyword3rd}</p>
                  </div>
                </div>
              \`;
              diaryContainer.appendChild(diaryComponent);
            }
            renderDiary();
          </script>
        `;
      }
    }
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
        <>
          <h3>kakaoId : {selectedUser.kakaoId}</h3>
          <h2>username : {selectedUser.username}</h2>
          {/* Diary 컴포넌트화 */}
          <div className="diaries">
            <div className="diary">
              <p>AI 일기</p>
              <Diary selectedUser={selectedUser} />
              <button onClick={handleRefresh} style={{
                margin: '20px'
              }}>Refresh</button>
              <button onClick={handleSave} style={{
                margin: '20px'
              }}>Save</button>
              <button onClick={handleNewPage} style={{ margin: '20px' }}>
                new page
              </button>

            </div>
            {save && (
              <div className="diary">
                <p>저장된 일기</p>
                <Diary selectedUser={savedUser} />
              </div>
            )}
          </div>
        </>
      )}

    </div>
  );
};
