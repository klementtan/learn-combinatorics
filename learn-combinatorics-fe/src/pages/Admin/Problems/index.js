import React, { useEffect, useState } from 'react';
import { connect, history, useLocation } from 'umi';
import PageContainer from '@ant-design/pro-layout/es/components/PageContainer';
import ChapterList from './components/ProblemList';
import ChapterCreate from '@/pages/Admin/Problems/components/ProblemCreateContainer';
import qs from 'qs';
import ChapterDetails from '@/pages/Admin/Problems/components/ProblemDetailsContainer';

const Problems = props => {
  const getProblems = async () => {
    const { dispatch } = props;
    if (dispatch) {
      await dispatch({
        type: 'lectures/fetch',
      });
      await dispatch({
        type: 'problems/fetch',
      });
    }
  };
  const queryParam = qs.parse(useLocation().search, { ignoreQueryPrefix: true });
  useEffect(async () => {
    await getProblems();
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
          tab: 'Problems',
          key: 0,
        },
        {
          tab: 'Create Problems',
          key: 1,
        },
        {
          tab: 'Problems Details',
          key: 2,
        },
      ]}
      tabActiveKey={activeTab}
      onTabChange={val => history.push(`/admin/problems?active_tab=${val}`)}
    >
      {components[activeTab]}
    </PageContainer>
  );
};
export default connect(({ problems, loading }) => ({
  problems: problems,
  loading: loading.models.lectures,
}))(Problems);
