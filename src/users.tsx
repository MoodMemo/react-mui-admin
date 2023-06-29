// in src/users.tsx
import { useMediaQuery } from "@mui/material";
import { List, SimpleList, Datagrid, TextField, useRecordContext } from "react-admin";
import { useEffect, useState } from "react";

export const UserList = () => {
  const isSmall = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const [userList, setUserList] = useState([]);
  const [info, setInfo] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [refresh, setRefresh] = useState(false);

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
      const value = selectedUser.kakaoId;
      fetch(`http://3.38.118.228:8080/api/dailyReport/${value}`)
        .then((response) => response.json())
        .then((data) => setSelectedUser(data));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh])


  const CustomRow = () => {
    const record = useRecordContext();

    const handleClick = () => {
      const value = record.kakaoId;
      fetch(`http://3.38.118.228:8080/api/dailyReport/${value}`)
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
        <div style={{
          margin: '50px 150px'
        }}>
        <h3>kakaoId : {selectedUser.kakaoId}</h3>
        <h2>username : {selectedUser.username}</h2>
        <br></br>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          padding: '0px 100px 68px',
          gap: '10px',
          position: 'relative',
          width: '684px',
          height: 'auto',
          background: '#FFFFFF',
          boxShadow: '0px 18px 28px rgba(7, 45, 87, 0.15), 0px 0px 1px rgba(7, 45, 87, 0.31)',
          borderRadius: '30px'
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            padding: '0px 20px',
            gap: '10px',
            width: '158px',
            height: '44px',
            background: '#072D57',
            borderRadius: '0px 0px 12px 12px',
            flex: 'none',
            order: 0,
            flexGrow: 0
          }}><p style={{
            width: '158px',
            height: '20px',
            fontFamily: 'Ubuntu',
            fontStyle: 'normal',
            fontWeight: 700,
            fontSize: '20px',
            lineHeight: '20px',
            letterSpacing: '1.5px',
            color: '#FFFFFF',
            flex: 'none',
            order: 0,
            flexGrow: 0
          }}>{selectedUser.date}</p>
          </div>

          <p style={{
            width: 'auto',
            height: 'auto',
            fontFamily: 'Ubuntu',
            fontStyle: 'normal',
            fontWeight: 700,
            fontSize: '30px',
            margin: '30px 0px 10px 0px',
            lineHeight: '54px',
            color: '#072D57',
            flex: 'none',
            wordBreak: 'keep-all',
            order: 0,
            flexGrow: 0
          }}>{selectedUser.title}</p>
          
          <hr style={{
            width: '484px',
            height: '0px',
            border: '1px solid #DDE2E8',
            flex: 'none',
            order: 0,
            flexGrow: 0
          }}></hr>

          <p style={{
            width: '484px',
            height: 'auto',
            fontFamily: 'Ubuntu',
            fontStyle: 'normal',
            fontWeight: 400,
            fontSize: '20px',
            lineHeight: '30px',
            color: '#5E5E5E',
            flex: 'none',
            order: 0,
            flexGrow: 0
          }}>{selectedUser.bodyText}</p>

          <div style={{
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0px 30px',
            gap: '24px',
            width: 'auto',
            height: '72px',
            border: '2px dashed #072D57',
            borderRadius: '5px',
            flex: 'none',
            order: 0,
            flexGrow: 0
          }}>
          <p style={{
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            padding: '8px 15px',
            gap: '4px',

            width: 'auto',
            height: '32px',

            backgroundColor: '#DDE2E8',
            border: '1px solid #BABABA',
            borderRadius: '2px',

            flex: 'none',
            order: 0,
            flexGrow: 0,

            fontFamily: 'Ubuntu',
            fontStyle: 'normal',
            fontWeight: '400',
            fontSize: '20px',
            lineHeight: '16px',

            color: '#072D57'
          }}>{selectedUser.keyword1st}</p>
          <p style={{
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            padding: '8px 15px',
            gap: '4px',

            width: 'auto',
            height: '32px',

            backgroundColor: '#DDE2E8',
            border: '1px solid #BABABA',
            borderRadius: '2px',

            flex: 'none',
            order: 0,
            flexGrow: 0,

            fontFamily: 'Ubuntu',
            fontStyle: 'normal',
            fontWeight: '400',
            fontSize: '20px',
            lineHeight: '16px',

            color: '#072D57'
          }}>{selectedUser.keyword2nd}</p>
          <p style={{
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            padding: '8px 15px',
            gap: '4px',

            width: 'auto',
            height: '32px',

            backgroundColor: '#DDE2E8',
            border: '1px solid #BABABA',
            borderRadius: '2px',

            flex: 'none',
            order: 0,
            flexGrow: 0,

            fontFamily: 'Ubuntu',
            fontStyle: 'normal',
            fontWeight: '400',
            fontSize: '20px',
            lineHeight: '16px',

            color: '#072D57'
          }}>{selectedUser.keyword3rd}</p>
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
