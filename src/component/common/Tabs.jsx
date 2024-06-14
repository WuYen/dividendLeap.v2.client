import React from 'react';

export function PostTabs(props) {
  const { activeTag, onSetActiveTag, containTargetPosts } = props;
  const tagArray = containTargetPosts ? ['標的', '全部'] : ['全部']; //Array.from(tags).concat('全部');
  return <Tabs tagArray={tagArray} activeTag={activeTag} onTabClick={onSetActiveTag} />;
}

export function Tabs(props) {
  const { tagArray, activeTag, onTabClick } = props;

  return (
    <div className='container'>
      <div className='tabs'>
        {tagArray.map((tag) => (
          <React.Fragment key={tag}>
            <input
              type='radio'
              id={`radio-${tag}`}
              name='tabs'
              checked={activeTag === tag}
              onChange={() => onTabClick(tag)}
            />
            <label className={`tab ${activeTag === tag ? 'active' : ''}`} htmlFor={`radio-${tag}`}>
              {tag}
            </label>
          </React.Fragment>
        ))}
        <span
          className='glider'
          style={{
            transform: `translateX(${(tagArray.indexOf(activeTag) - 1) * 100 + 100}%)`,
          }}
        ></span>
      </div>
    </div>
  );
}

export default Tabs;
