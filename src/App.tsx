// in src/App.tsx
import { Admin, CustomRoutes, Resource } from "react-admin";
import { dataProvider } from './dataProvider';
import { PostList, PostEdit, PostCreate } from "./posts";
import { UserList } from "./users";
import PostIcon from "@mui/icons-material/Book";
import UserIcon from "@mui/icons-material/Group";
import { Dashboard } from "./Dashboard";
import { authProvider } from "./authProvider";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserPage from "./UserPage";

export const App = () => (
  <Admin authProvider={authProvider} dataProvider={dataProvider} dashboard={Dashboard}>
    <Resource name="users" list={UserList} icon={UserIcon} recordRepresentation="name"/> 
    <CustomRoutes noLayout>
      <Route path="/dailyReport/:kakaoId" element={<UserPage />} />
    </CustomRoutes>
  </Admin>
)