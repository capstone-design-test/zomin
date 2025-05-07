import { Input } from 'antd';
import { IoSearch } from "react-icons/io5";
import './search.css';

const Searchbar = ({ onChange }) => {
    return (
        <div className='search_background'>
            <Input
                placeholder="검색어 입력"
                prefix={<IoSearch style={{ color: '#525252', marginRight: '15px', fontSize:'20px', fontWeight:'bold' }} />}
                onChange={(e) => onChange(e.target.value)}
                className='custom_input'
            />
        </div>
    );
};

export default Searchbar;
