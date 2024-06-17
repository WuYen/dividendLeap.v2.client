import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { debounce } from '../../utility/debounce';

export function AuthorList(props) {
  const { data } = props;
  const [filteredData, setFilteredData] = useState(data);
  const navigate = useNavigate();

  const handleFilterData = debounce((searchText) => {
    const filtered = data.filter((item) => item.name.toLowerCase().includes(searchText.toLowerCase()));
    setFilteredData(filtered);
  }, 400);

  return (
    <>
      <SearchBar onSearchTextChange={handleFilterData} />
      {filteredData.map((item) => (
        <AuthorListItem key={item.name} authoInfo={item} navigate={navigate} />
      ))}
    </>
  );
}

const AuthorListItem = (props) => {
  const { authoInfo, navigate } = props;
  const handleArrowClick = (e) => {
    e.stopPropagation(); // 防止事件繼續往上層傳遞
    e.preventDefault();
    navigate(`/my/author/${authoInfo.name}`);
  };
  const handleLikeClick = (e) => {
    // e.stopPropagation(); // 防止事件繼續往上層傳遞
    // e.preventDefault();
    // api.get(`/my/author/${item.name}/like?token=${userInfo.id}`);
  };
  return (
    <div style={styles.container}>
      <div style={styles.textContainer}>
        <div style={styles.headerContainer}>
          <div style={styles.likeContainer} onClick={(e) => handleLikeClick(e)}>
            <ThumbUpIcon />
            <span style={styles.likeCount}> {authoInfo.likes}</span>
          </div>
          <div style={styles.text}>{authoInfo.name}</div>
        </div>
      </div>
      <div style={styles.arrowContainer} onClick={(e) => handleArrowClick(e)}>
        <ArrowIcon />
      </div>
    </div>
  );
};

const SearchBar = ({ onSearchTextChange }) => {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    onSearchTextChange(searchText);
  }, [searchText, onSearchTextChange]);

  const handleSearchClick = () => {
    if (searchText) {
      navigate(`/my/author/${searchText}`);
    }
  };

  return (
    <div
      style={{
        maxWidth: '450px',
        margin: '0 auto 20px',
        position: 'relative',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '8fr 2fr',
          gap: '10px',
          alignItems: 'center',
          placeItems: 'center',
        }}
      >
        <input className='text-input' type='text' value={searchText} onChange={(e) => setSearchText(e.target.value)} required={true} placeholder={'Search author'} />
        <button className='regis-button' style={{ width: '100%', maxWidth: '100%' }} onClick={handleSearchClick}>
          查詢
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: '20px 12px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    margin: '0px auto 20px',
    maxWidth: '450px',
    textAlign: 'left',
  },
  textContainer: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
  },
  headerContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  text: {
    fontWeight: 'bold',
    fontSize: '16px',
    marginLeft: '8px',
  },
  arrowContainer: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
  },
  actionContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  likeContainer: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    marginRight: '12px',
    marginLeft: '8px',
  },
  likeCount: {
    marginLeft: '4px',
    fontSize: '16px',
    paddingTop: '2px',
    color: 'gray',
  },
  thumbUpIcon: {
    width: '20px',
    height: '20px',
  },
};

const ArrowIcon = () => (
  <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24px' height='24px' fill='currentColor'>
    <path fillRule='evenodd' d='M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z' clipRule='evenodd' />
  </svg>
);

const ThumbUpIcon = () => (
  <svg width='24px' height='24px' viewBox='0 0 1024.00 1024.00' className='icon' version='1.1' xmlns='http://www.w3.org/2000/svg' fill='#000000'>
    <g id='SVGRepo_bgCarrier' strokeWidth='0'></g>
    <g id='SVGRepo_tracerCarrier' strokeLinecap='round' strokeLinejoin='round'></g>
    <g id='SVGRepo_iconCarrier'>
      <path d='M601.5 531.8h278.8v16H601.5zM639.3 657.4h224v16h-224zM686.8 779h160.8v16H686.8z' fill='#F73737'></path>
      <path
        d='M216.3 927.8H62.2V425.6h155.4l-1.3 502.2z m-110.1-44h66.2l1.1-414.2h-67.3v414.2zM822.1 927.8H268.9l-0.4-502L633.3 96.2l85.2 91.5-66.8 196.7h310L822.1 927.8z m-509.3-44H788l117-455.4H655.8l-65.5-0.1 78.1-229.9-37.8-40.5-318.1 287.4 0.3 438.5z'
        fill='#353535'
      ></path>
    </g>
  </svg>
);
