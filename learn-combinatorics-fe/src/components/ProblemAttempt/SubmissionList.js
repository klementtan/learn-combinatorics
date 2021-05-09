import React, { useState, useEffect, useContext } from 'react';
import { Typography, Breadcrumb, Menu, Table, Tag, Card } from 'antd';
import moment from 'moment';
import { parseKatex } from '@/utils/Katex';
import { connect } from 'umi';
const formatSubmission = (submission_value_numerator, submission_value_denominator) => {
  var res = '$';
  res += (parseInt(submission_value_numerator) / parseInt(submission_value_denominator)).toFixed(3);
  res += String.raw`\left( \frac{`;
  res += submission_value_numerator;
  res += String.raw`}{`;
  res += submission_value_denominator;
  res += String.raw`}\right)$`;
  return res;
};
const SubmissionList = props => {
  const { attempt } = props;
  let { submissions } = attempt;
  for (var i = 0; i < submissions.length; i++) {
    submissions[i]['key'] = i;
  }
  const columns = [
    {
      title: ' Date',
      dataIndex: 'created_at',
      render: time => {
        return moment(time)
          .locale('en_us')
          .format('dddd, MMMM Do YYYY, h:mm:ss a');
      },
    },
    {
      title: 'Your Submission',
      render: submission => {
        return parseKatex(
          formatSubmission(
            submission.submission_value_numerator,
            submission.submission_value_denominator,
          ),
        );
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: status => {
        return {
          pass: <Tag color={'green'}>Pass</Tag>,
          fail: <Tag color={'red'}>Fail</Tag>,
        }[status];
      },
    },
  ];
  return (
    <Card
      style={{
        width: '100%',
        marginBottom: '1em',
      }}
      title={'Submissions'}
    >
      <Table loading={props.loading} columns={columns} dataSource={submissions} />
    </Card>
  );
};

export default connect(({ attempt, loading }) => ({
  attempt: attempt,
  loading: loading.models.attempt,
}))(SubmissionList);
