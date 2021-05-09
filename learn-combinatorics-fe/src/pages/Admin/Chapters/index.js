import React, { useEffect, useState } from 'react';
import { connect, history, useLocation } from 'umi';
import PageContainer from '@ant-design/pro-layout/es/components/PageContainer';
import ChapterList from './components/ChapterList';
import ChapterCreate from '@/pages/Admin/Chapters/components/ChapterCreate';
import qs from 'qs';
import ChapterDetails from '@/pages/Admin/Chapters/components/ChapterDetails';

const Chapters = props => {
  const getChapters = async () => {
    const { dispatch } = props;
    if (dispatch) {
      await dispatch({
        type: 'chapters/fetch',
      });
    }
  };
  const queryParam = qs.parse(useLocation().search, { ignoreQueryPrefix: true });
  useEffect(async () => {
    await getChapters();
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
          tab: 'Chapters',
          key: 0,
        },
        {
          tab: 'Create Chapters',
          key: 1,
        },
        {
          tab: 'Chapters Details',
          key: 2,
        },
      ]}
      tabActiveKey={activeTab}
      onTabChange={val => history.push(`/admin/chapters?active_tab=${val}`)}
    >
      {components[activeTab]}
    </PageContainer>
  );
};
export default connect(({ chapters, loading }) => ({
  chapters: chapters,
  loading: loading.models.chapters,
}))(Chapters);
