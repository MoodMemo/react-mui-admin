// in src/users.tsx
import { useMediaQuery } from "@mui/material";
import { List, SimpleList, Datagrid, TextField, useRecordContext } from "react-admin";
import { useEffect, useState } from "react";

export const UserList = () => {
  const isSmall = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const [userList, setUserList] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetch("http://3.38.118.228:8080/api/home")
      .then((response) => response.json())
      .then((data) => {
        setUserList(data)
        // console.log(data[0].kakaoId);
      });
  }, []);

  // const handleClick = () => {
  //   const record = useRecordContext();
  //   const value = record.kakaoId;
  //   fetch(`http://3.38.118.228:8080/api/dailyReport/${value}`)
  //     .then((response) => response.json())
  //     .then((data) => setSelectedUser(data));
  // };

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
        <TextField source="kakaoId" record={record} />
        <TextField source="username" record={record} />
      </div>
    );
  };

  return (
    <div>
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
        <div>
          <h2>{selectedUser.username}</h2>
          <p>{selectedUser.date}</p>
          <p>{selectedUser.title}</p>
          <p>{selectedUser.bodyText}</p>
          <p>{selectedUser.keyword && selectedUser.keyword.join(", ")}</p>
          <p>{selectedUser.time}</p>
        </div>
      )}

    </div>
  );
};
