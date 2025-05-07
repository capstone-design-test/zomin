import './completelist.css';
import Side from '../../Components/Side/side.js';
import CompletedList from './completelist.js';

const CompletedListpage = () => {
  return (
    <div className='main_layout'>
      <Side style={{ flex: 1 }} />
      <CompletedList style={{ flex: 6 }} />
    </div>
  );
}

export default CompletedListpage;