// in src/App.tsx
import { Admin, Resource } from "react-admin";
import { dataProvider } from './dataProvider';
import { PostList, PostEdit, PostCreate } from "./posts";
import { UserList } from "./users";
import PostIcon from "@mui/icons-material/Book";
import UserIcon from "@mui/icons-material/Group";
import { Dashboard } from "./Dashboard";
import { authProvider } from "./authProvider";

export const App = () => (
  <Admin authProvider={authProvider} dataProvider={dataProvider} dashboard={Dashboard}>
    {/* <Resource name="posts" list={PostList} edit={PostEdit} create={PostCreate} icon={PostIcon}/> */}
    <Resource name="users" list={UserList} icon={UserIcon} recordRepresentation="name"/>
    {/* <Resource name="home" list={UserList} /> */}
  </Admin>
)