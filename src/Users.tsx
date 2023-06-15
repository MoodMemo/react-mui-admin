import React, { useState, useEffect } from 'react';
import { List, SimpleList } from "react-admin";
import axios from 'axios';

interface User {
  kakaoId: string;
  username: string;
}

function Users() {
  const [users, setUsers] = useState<User[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setError(null);
        setUsers(null);
        setLoading(true);
        const response = await axios.get<User[]>(
          'http://3.38.118.228:8080/api/home'
        );
        setUsers(response.data);
      } catch (e: any) {
        setError(e);
      }
      setLoading(false);
    };

    fetchUsers();
  }, []);

  if (loading) return <div>로딩중..</div>;
  if (error) return <div>에러가 발생했습니다</div>;
  if (!users) return null;
  return (
    <ul>
      {users.map((user) => (
        <li>
          {user.kakaoId} ({user.username})
        </li>
      ))}
    </ul>
  );
}

export default Users;
