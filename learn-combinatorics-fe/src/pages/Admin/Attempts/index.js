import React, { useEffect, useState } from 'react';
import { connect, history, useLocation } from 'umi';
import PageContainer from '@ant-design/pro-layout/es/components/PageContainer';
import AttemptList from './components/AttemptList';
import ChapterCreate from '@/pages/Admin/Chapters/components/ChapterCreate';
import qs from 'qs';
import ChapterDetails from '@/pages/Admin/Chapters/components/ChapterDetails';
import ViewAttempt from '@/pages/Admin/Attempts/components/ViewAttempt';

const Attempt = props => {
  const getChapters = async () => {
    const { dispatch } = props;
    if (dispatch) {
      await dispatch({
        type: 'all_attempt/fetch',
      });
    }
  };
  const queryParam = qs.parse(useLocation().search, { ignoreQueryPrefix: true });
  useEffect(async () => {
    await getChapters();
  }, []);

  const activeTab = queryParam['active_tab'] || 0;

  const components = [<AttemptList />, <ViewAttempt />];
  return (
    <PageContainer
      tabList={[
        {
          tab: 'Attempts',
          key: 0,
        },
        {
          tab: 'View Attempt',
          key: 1,
        },
      ]}
      tabActiveKey={activeTab}
      onTabChange={val => history.push(`/admin/attempts?active_tab=${val}`)}
    >
      {components[activeTab]}
    </PageContainer>
  );
};
export default connect(({ all_attempt, loading }) => ({
  all_attempt: all_attempt,
  loading: loading.models.all_attempt,
}))(Attempt);
