import './deletelist.css';
import Side from '../../Components/Side/side.js';
import DeletedList from './deletelist.js';

const DeletedListpage = () => {
  return (
    <div className='main_layout'>
      <Side style={{ flex: 1 }} />
      <DeletedList style={{ flex: 6 }} />
    </div>
  );
}

export default DeletedListpage;