import React, { useEffect, useState } from 'react';
import { connect, history, useLocation } from 'umi';
import PageContainer from '@ant-design/pro-layout/es/components/PageContainer';
import ChapterList from './components/LectureList';
import ChapterCreate from '@/pages/Admin/Lectures/components/LectureCreate';
import qs from 'qs';
import ChapterDetails from '@/pages/Admin/Lectures/components/LectureDetails';

const Lectures = props => {
  const getLectures = async () => {
    const { dispatch } = props;
    if (dispatch) {
      await dispatch({
        type: 'lectures/fetch',
      });
      await dispatch({
        type: 'chapters/fetch',
      });
    }
  };
  const queryParam = qs.parse(useLocation().search, { ignoreQueryPrefix: true });
  useEffect(async () => {
    await getLectures();
  }, []);

  const activeTab = queryParam['active_tab'] || 0;

  const components = [
    <ChapterList />,
    <ChapterCreate> create chapters </ChapterCreate>,
    <ChapterDetails> Chapters Details</ChapterDetails>,
  ];
  return (
    <PageContainer
      tabList={[
        {
          tab: 'Lectures',
          key: 0,
        },
        {
          tab: 'Create Lectures',
          key: 1,
        },
        {
          tab: 'Lectures Details',
          key: 2,
        },
      ]}
      tabActiveKey={activeTab}
      onTabChange={val => history.push(`/admin/lectures?active_tab=${val}`)}
    >
      {components[activeTab]}
    </PageContainer>
  );
};
export default connect(({ lectures, loading }) => ({
  lectures: lectures,
  loading: loading.models.lectures,
}))(Lectures);
