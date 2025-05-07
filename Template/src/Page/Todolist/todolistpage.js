import './todolist.css';
import Side from '../../Components/Side/side.js';
import Todolist from './todolist.js';

const TodoListPage = () => {
  return (
    <div className='main_layout'>
        <Side style={{ flex: 1 }} />
        <Todolist style={{ flex: 6}}/>
    </div>
  );
}

export default TodoListPage;