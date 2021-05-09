import { Button, Tag, Input, Table,Space, Col,Row,Typography } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { SearchOutlined, LockOutlined } from '@ant-design/icons';
import {getAllProblems} from "@/services/problem";
import AttemptStatusTag from "@/components/ProblemAttempt/AttemptStatusTag";
import DoubtStatusTag from "@/components/Doubt/DoubtStatusTag";
import {ProblemDifficultyTag, PROBLEM_DIFFICULTY_MAP} from "@/components/Problems/ProblemDifficulty";
import Pie from "@/pages/Dashboard/components/Charts/Pie";
import Yuan from "@/utils/Yuan";
import {connect} from 'umi'
import {
  Chart,
  Interval,
  Axis,
  Tooltip,
  Coordinate,
  Legend,
  Interaction,
  getTheme,
} from "bizcharts";
import DataSet from "@antv/data-set";
import List from "antd/es/list";
import moment from 'moment'
import Divider from "antd/es/divider";
const TimePieChart = (props) => {
  const {dataIndex, attempts} = props
  const [data, setData] = useState([])
  const cols = {
    percent: {
      formatter: val => {
        val = val * 100 + '%';
        return val;
      },
    },
  };
  const getData = () => {
    let dataMap = {}
    let total = 0
    attempts.forEach(attempt => {
      let obj = attempt[dataIndex]
      if (!(obj.id in dataMap)) {
        dataMap[obj.id] = {
          item: obj.title,
          count: 0
        }
      }
      dataMap[obj.id].count += attempt.attempt_time
      total +=  attempt.attempt_time
    })
    console.log(attempts)
    let res = []
    Object.keys(dataMap).forEach(id => {
      res.push({
        percent: Number((dataMap[id].count/total).toFixed(2)),
        ...dataMap[id]
      })
    })
    res = res.sort((a,b) => {
      return   b.count - a.count
    })
    return res
  }

  useEffect(() => {
   setData(getData())
  }, [attempts, dataIndex])
  return (
    <Row
      justify={'center'}
    >
      <Col
        span={14}
      >
        <Chart height={400} data={data} scale={cols} autoFit>
          <Coordinate type="theta" radius={0.75} />
          <Tooltip showTitle={false} />
          <Axis visible={false} />
          <Interval
            position="percent"
            adjust="stack"
            color="item"
            style={{
              lineWidth: 1,
              stroke: '#fff',
            }}
            label={['count', {
              content: (data) => {
                return `${data.item}: ${(data.percent * 100).toFixed(2)}%`;
              },
            }]}
            state={{
              selected: {
                style: (t) => {
                  const res = getTheme().geometries.interval.rect.selected.style(t);
                  return { ...res, fill: 'red' }
                }
              }
            }}
          />
          <Interaction type='element-single-selected' />
        </Chart>
      </Col>
      <Col
        span={8}
      >
        <List
          style={{
            width: '100%'
          }}
          dataSource={data}
          renderItem={currData => (
            <List.Item key={currData.item}>
              <List.Item.Meta title={currData.item} description={moment.duration(currData.count, "seconds").locale('en').humanize()}/>
            </List.Item>
          )}
        />
      </Col>
    </Row>
  );
};
export default connect(({ attempts, loading }) => ({
  attempts: attempts,
  loading: loading.models.attempts,
}))(TimePieChart);

