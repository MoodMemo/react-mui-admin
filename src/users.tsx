// in src/users.tsx
import { useMediaQuery } from "@mui/material";
import { List, SimpleList, Datagrid, TextField } from "react-admin";
import { useEffect, useState } from "react";

export const UserList = () => {
  const isSmall = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const [userList, setUserList] = useState([]);

  useEffect(() => {
    fetch("http://3.38.118.228:8080/api/home")
      .then((response) => response.json())
      .then((data) => setUserList(data));
  }, []);

  return (
    <List>
      {isSmall ? (
        <SimpleList
          primaryText={(record) => record.username}
          secondaryText={(record) => record.kakaoId}
          data={userList}
        />
      ) : (
        <Datagrid rowClick="edit" data={userList}>
          <TextField source="kakaoId" />
          <TextField source="username" />
        </Datagrid>
      )}
    </List>
  );
};
