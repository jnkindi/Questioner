
import usersList from '../models/users.json';

const users = ((typeof (usersList) !== 'object') ? [] : usersList);

export default users;