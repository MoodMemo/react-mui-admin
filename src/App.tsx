
import { Admin, Resource, ListGuesser, EditGuesser, ShowGuesser } from 'react-admin';
import { dataProvider } from './dataProvider';
import Users from './Users';

export const App = () => (
    <Admin dataProvider={dataProvider}>
        <Resource name="users" list={Users} />
    </Admin>
    // <Users />
);

    