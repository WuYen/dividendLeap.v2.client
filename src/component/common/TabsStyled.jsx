import React from 'react';
import { styled } from '@mui/system';
import { Box, Radio, FormControlLabel, RadioGroup } from '@mui/material';

// Styled components
const Container = styled(Box)`
  --primary-color: #185ee0;
  --secondary-color: #e6eef9;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TabsContainer = styled(Box)`
  display: flex;
  position: relative;
  background-color: #fff;
  box-shadow: 0 0 1px 0 rgba(24, 94, 224, 0.15), 0 6px 12px 0 rgba(24, 94, 224, 0.15);
  padding: 5px;
  border-radius: 99px;
`;

const TabLabel = styled(FormControlLabel)`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 25px;
  width: 66px;
  min-width: 66px;
  font-weight: 500;
  border-radius: 99px;
  cursor: pointer;
  transition: color 0.15s ease-in;
  &.active {
    color: var(--primary-color);
  }
`;

const Glider = styled(Box)`
  position: absolute;
  display: flex;
  height: 25px;
  width: 66px;
  min-width: 66px;
  background-color: var(--secondary-color);
  z-index: 1;
  border-radius: 99px;
  transition: 0.25s ease-out;
`;

export function PostTabs(props) {
  const { activeTag, onSetActiveTag, containTargetPosts } = props;
  const tagArray = containTargetPosts ? ['標的', '全部'] : ['全部'];
  return <Tabs tagArray={tagArray} activeTag={activeTag} onTabClick={onSetActiveTag} />;
}

export function Tabs(props) {
  const { tagArray, activeTag, onTabClick } = props;

  return (
    <Container>
      <TabsContainer>
        <RadioGroup row value={activeTag} onChange={(e) => onTabClick(e.target.value)}>
          {tagArray.map((tag) => (
            <React.Fragment key={tag}>
              <FormControlLabel
                value={tag}
                control={<Radio style={{ display: 'none' }} />}
                label={<TabLabel className={`tab ${activeTag === tag ? 'active' : ''}`}>{tag}</TabLabel>}
              />
            </React.Fragment>
          ))}
        </RadioGroup>
        <Glider
          style={{
            transform: `translateX(${(tagArray.indexOf(activeTag) - 1) * 100 + 100}%)`,
          }}
        />
      </TabsContainer>
    </Container>
  );
}

export default Tabs;
