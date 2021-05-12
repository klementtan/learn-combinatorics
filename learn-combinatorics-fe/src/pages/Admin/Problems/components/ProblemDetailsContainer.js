import {
  Button,
  Form,
  Tag,
  Input,
  Checkbox,
  Table,
  Typography,
  List,
  Select,
  Row,
  Col,
} from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import {
  SearchOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  WarningFilled,
} from '@ant-design/icons';
import {
  createAnswer,
  createProblem,
  getAllProblems,
  updateAnswer,
  updateProblem,
  upsertExplanationBodyPdf,
  upsertExplanationVideo,
  upsertProblemPdf,
} from '@/services/problem';
import AttemptStatusTag from '@/components/ProblemAttempt/AttemptStatusTag';
import DoubtStatusTag from '@/components/Doubt/DoubtStatusTag';
import ProblemDifficulty from '@/components/Problems/ProblemDifficulty';
import { connect, history, useLocation, Redirect } from 'umi';
import qs from 'qs';
import { createLecture } from '@/services/lecture';
import ProblemCreate from '@/pages/Admin/Problems/components/ProblemCreate';
import { ACCESS_LEVELS } from '@/components/Users/UsersAccessLevel';
import ProblemCreatePdf from '@/pages/Admin/Problems/components/ProblemCreatePdf';
import Divider from 'antd/es/divider';
import AnswerCreate from '@/pages/Admin/Problems/components/AnswerCreate';
import AnswerExplanationVideo from '@/pages/Admin/Problems/components/AnswerExplanationVideo';
import ProblemDisplay from '@/components/ProblemAttempt/ProblemDisplay';
import AnswerExplanationPdf from '@/pages/Admin/Problems/components/AnswerExplanationPdf';
import Tooltip from 'antd/es/tooltip';
import { getProblem } from '@/services/problem';
import { isValidFile } from '@/utils/utils';

const ProblemCreateContainer = props => {
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { chapters } = props;
  const [chapter, setChapter] = useState({});
  const [createdId, setCreatedId] = useState(-1);
  const [validationErrors, setValidationError] = useState([]);
  const [prevPrams, setPrevParams] = useState({});
  const params = qs.parse(useLocation().search, { ignoreQueryPrefix: true });
  const [hints, setHints] = useState([]);
  const [prevProblem, setPrevProblem] = useState({});
  const [problem, setProblem] = useState({
    lecture_id: null,
    problem: {
      difficulty: 1,
      title: null,
      body: '',
      privilege_level: ACCESS_LEVELS.PUBLIC_USER,
    },
  });
  const [answer, setAnswer] = useState({
    explanation_body: '',
    answer_value_numerator: 0,
    answer_value_denominator: 1,
  });
  const [problemPdf, setProblemPdf] = useState({});
  const [explanationPdf, setExplanationPdf] = useState({});
  const [explanationVideo, setExplanationVideo] = useState({});
  const onSelectProblem = problemId => {
    return history.push(`/admin/problems?problem_id=${problemId}&active_tab=2`);
  };
  function loadProblem() {
    if (params.problem_id) {
      getProblem(params.problem_id).then(resp => {
        const problemResp = resp.problem;
        const lectureResp = problemResp.lecture;
        const answerResp = problemResp.answer;
        setPrevProblem(problemResp);
        setProblem({
          lecture_id: lectureResp.id,
          problem: {
            difficulty: problemResp.difficulty,
            title: problemResp.title,
            body: problemResp.body,
            privilege_level: problemResp.privilege_level,
          },
        });
        setAnswer({
          explanation_body: answerResp.explanation_body,
          answer_value_numerator: answerResp.answer_value_numerator,
          answer_value_denominator: answerResp.answer_value_denominator,
        });
        if (problemResp.problem_pdf_url) {
          setProblemPdf(problemResp.problem_pdf_url);
        }
        if (answerResp.explanation_video_url) {
          setExplanationVideo(answerResp.explanation_video_url);
        }
        if (answerResp.explanation_body_pdf_url) {
          setExplanationPdf(answerResp.explanation_body_pdf_url);
        }
        setHints(problemResp.hints);
      });
    }
  }

  useEffect(() => {
    if (JSON.stringify(params) !== JSON.stringify(prevPrams)) {
      setPrevParams(params);
    } else {
      return;
    }
    loadProblem();
  }, [params]);
  const validate = () => {
    let currValidationError = [];
    if (!problem.lecture_id) {
      currValidationError.push('Choose the lecture that the problem belongs to.');
    }
    if (!(problem.problem.difficulty >= 0)) {
      currValidationError.push('Choose difficulty.');
    }
    if (!problem.problem.title) {
      currValidationError.push('Enter title');
    }

    if (!problem.problem.privilege_level) {
      currValidationError.push('Choose Access Level');
    }

    if (!(problem.problem.body || isValidFile(problemPdf))) {
      currValidationError.push('Enter at least "Problem Body" or "Problem body pdf file" ');
    }

    if (!(answer.answer_value_denominator && answer.answer_value_denominator)) {
      currValidationError.push('Answer value not entered');
    }

    if (
      !(
        answer.explanation_body?.length > 0 ||
        explanationPdf instanceof File ||
        explanationVideo instanceof File
      )
    ) {
      currValidationError.push(
        'Enter at least "Explanation Body", "Explanation body pdf file", "Explanation Video"',
      );
    }
    return currValidationError;
  };

  useEffect(() => {
    setValidationError(validate());
  }, [problem, answer, problemPdf, explanationPdf, explanationVideo]);
  const onFinish = async lecturePayload => {
    setErrorMessage('');
    setSuccess(false);
    setLoading(true);
    setCreatedId(-1);
    updateProblem(params.problem_id, problem)
      .then(async problemResp => {
        const createdProblem = problemResp.problem;
        const problemId = createdProblem.id;
        setCreatedId(problemId);
        const answerPayload = {
          problem_id: problemId,
          answer: answer,
        };

        await updateAnswer(createdProblem.answer.id, answerPayload).then(async answerResp => {
          const createdAnswer = answerResp.answer;
          const answerId = createdAnswer.id;

          if (explanationVideo instanceof File) {
            await upsertExplanationVideo(answerId, explanationVideo);
          }

          if (explanationPdf instanceof File) {
            await upsertExplanationBodyPdf(answerId, explanationPdf);
          }
        });
        if (problemPdf instanceof File) {
          await upsertProblemPdf(problemId, problemPdf);
        }

        setSuccess(true);
        loadProblem();
      })
      .catch(err => {
        setErrorMessage(err.error);
      })
      .finally(() => setLoading(false));
  };

  return (
    <>
      <Row justify={'center'}>
        <div style={{ width: '75%', marginBottom: '1em' }}>
          <Select
            showSearch
            style={{ width: '100%' }}
            placeholder="Select Problem"
            optionFilterProp="children"
            onSelect={onSelectProblem}
            value={prevProblem?.id ? `${prevProblem.id}.  ${prevProblem.title}` : null}
          >
            {props.problems.map((currProblem, idx) => {
              return (
                <Select.Option key={idx} value={currProblem.id}>
                  {currProblem.id}. {currProblem.title}
                </Select.Option>
              );
            })}
          </Select>
        </div>
      </Row>
      {JSON.stringify(prevProblem) !== JSON.stringify({}) && (
        <>
          <ProblemCreate problem={problem} setProblem={setProblem} />
          <ProblemCreatePdf problemPdf={problemPdf} setProblemPdf={setProblemPdf} />
          <Row justify={'center'}>
            <Col
              style={{
                width: '75%',
              }}
            >
              <Divider orientation="left">Answer and Explanation</Divider>
            </Col>
          </Row>
          <AnswerCreate answer={answer} setAnswer={setAnswer} />
          <AnswerExplanationPdf
            explanationPdf={explanationPdf}
            setExplanationPdf={setExplanationPdf}
          />
          <AnswerExplanationVideo
            explanationVideo={explanationVideo}
            setExplanationVideo={setExplanationVideo}
          />
          <Row justify={'center'}>
            <Form
              style={{
                width: '75%',
              }}
              name="basic"
              onFinish={onFinish}
            >
              <Form.Item>
                <Row>
                  <Button
                    disabled={validationErrors.length > 0}
                    loading={loading}
                    type="primary"
                    htmlType="submit"
                  >
                    Save
                  </Button>
                </Row>
              </Form.Item>
              <Form.Item>
                {success && <Tag color={'green'}>Success</Tag>}

                {errorMessage?.length !== 0 && <Tag color={'orange'}>{errorMessage}</Tag>}
                {validationErrors.map((err, idx) => (
                  <Tag color={'orange'} key={idx} style={{ margin: '0.5em' }}>
                    {err}
                  </Tag>
                ))}
              </Form.Item>
            </Form>
          </Row>
        </>
      )}
    </>
  );
};

export default connect(({ chapters, loading, problems }) => ({
  problems: problems,
  chapters: chapters,
  loading: loading.models.chapters,
}))(ProblemCreateContainer);
