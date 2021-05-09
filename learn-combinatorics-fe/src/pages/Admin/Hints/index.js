import React, { useEffect, useState } from 'react';
import { connect, history, useLocation } from 'umi';
import PageContainer from '@ant-design/pro-layout/es/components/PageContainer';
import HintList from './components/HintList';
import HintCreate from '@/pages/Admin/Hints/components/HintCreateContainer';
import qs from 'qs';
import HintDetailsContainer from "@/pages/Admin/Hints/components/HintDetailsContainer";

const Hints = props => {
  const getHints = async () => {
    const { dispatch } = props;
    if (dispatch) {
      await dispatch({
        type: 'problems/fetch',
      });
      await dispatch({
        type: 'hints/fetch',
      });
    }
  };
  const queryParam = qs.parse(useLocation().search, { ignoreQueryPrefix: true });
  useEffect(async () => {
    await getHints();
  }, []);

  const activeTab = queryParam['active_tab'] || 0;

  const components = [
    <HintList />,
    <HintCreate/> ,
    <HintDetailsContainer/> ,
  ];
  return (
    <PageContainer
      tabList={[
        {
          tab: 'Hints',
          key: 0,
        },
        {
          tab: 'Create Hint',
          key: 1,
        },
        {
          tab: 'Hint Details',
          key: 2,
        },
      ]}
      tabActiveKey={activeTab}
      onTabChange={val => history.push(`/admin/hints?active_tab=${val}`)}
    >
      {components[activeTab]}
    </PageContainer>
  );
};
export default connect(({ hints, loading }) => ({
  hints: hints,
  loading: loading.models.lectures,
}))(Hints);
