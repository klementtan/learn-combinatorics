import React, { useState, useEffect, useContext } from 'react';
import { Typography, Breadcrumb, Menu, Table, Tag, Card, Button, Collapse, Col } from 'antd';
import { LockTwoTone, UnlockTwoTone } from '@ant-design/icons';
import { unlockAttemptHint, unlockAttemptAnswer } from '@/services/attempt';
import { Player, ControlBar, BigPlayButton } from 'video-react';
import PdfViewer from '../../commons/PdfViewer';
import { parseKatex } from '@/utils/Katex';
import { connect } from 'umi';
import './HintsAndSolution.css';
import Row from 'antd/es/descriptions/Row';
import Divider from 'antd/es/divider';

const HintsAndSolution = (props) => {
  const attempt = props.attempt;
  const { hints, answer } = attempt;
  const [loading, setLoading] = useState(false);
  const unlockHint = async () => {
    await setLoading(true);
    unlockAttemptHint(attempt.id)
      .then(async (response) => {
        const { dispatch } = props;
        if (dispatch) {
          await dispatch({
            type: 'attempt/fetch',
            payload: attempt.problem.id,
          });
        }
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
      });
  };
  const parseAnswer = (numerator, denominator) => {
    if (denominator === 1) {
      return parseKatex(numerator);
    } else {
      var res = String.raw`$\frac{`;

      res += numerator;
      res += String.raw`}{`;
      res += denominator;
      res += String.raw`}$`;
      return parseKatex(res);
    }
  };
  const unlockAnswer = async () => {
    await setLoading(true);
    unlockAttemptAnswer(attempt.id)
      .then(async (response) => {
        const { dispatch } = props;
        if (dispatch) {
          await dispatch({
            type: 'attempt/fetch',
            payload: attempt.problem.id,
          });
        }
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
      });
  };
  return (
    <Card
      style={{
        marginBottom: '1em',
      }}
      title={'Hints and Solution'}
    >
      <Card title={'Hints'}>
        <Collapse>
          {hints && hints.unlocked.length === 0 && hints.locked.length === 0 && (
            <Collapse.Panel key={'empty'} header={'No Hints'} collapsible={'disabled'} />
          )}
          {hints.unlocked.map((hint, index) => {
            return (
              <Collapse.Panel
                key={'UNLOCKED_HINT' + index}
                header={
                  <Typography.Text>
                    <UnlockTwoTone twoToneColor={'#1890ff'} />
                    {` Hint ${index + 1} : ${hint.title}`}
                  </Typography.Text>
                }
              >
                {hint.body && (
                  <>
                    <Divider
                      orientation="left"
                      style={{
                        marginTop: '1em',
                      }}
                    >
                      Hint
                    </Divider>
                    <Typography.Text
                      style={{
                        marginTop: '1em',
                      }}
                    >
                      {parseKatex(hint.body)}
                    </Typography.Text>
                  </>
                )}
                {hint.hint_video_url && (
                  <>
                    <Divider
                      orientation="left"
                      style={{
                        marginTop: '1em',
                      }}
                    >
                      {' '}
                      Hint Video
                    </Divider>
                    <Player
                      fluid
                      src={hint.hint_video_url}
                      style={{
                        marginTop: '5em',
                      }}
                    >
                      <ControlBar autoHide={false} />
                      <BigPlayButton position="center" />
                    </Player>
                  </>
                )}

                {hint.hint_body_pdf_url && (
                  <>
                    <Divider
                      orientation="left"
                      style={{
                        marginTop: '1em',
                      }}
                    >
                      Hint PDF
                    </Divider>
                    <PdfViewer
                      style={{
                        marginTop: '5em',
                      }}
                      pdf={hint.hint_body_pdf_url}
                    />
                  </>
                )}
              </Collapse.Panel>
            );
          })}
          {hints.locked.map((hint, index) => {
            return (
              <Collapse.Panel
                key={'LOCKED_HINT_' + index}
                collapsible={'disabled'}
                header={
                  <Typography.Text>
                    {' '}
                    <LockTwoTone twoToneColor={'#ff0000'} />{' '}
                    {`Hint ${index + 1 + hints.unlocked.length} : ${hint.title}  `}
                    {index === 0 && (
                      <Button loading={loading} type="primary" onClick={unlockHint}>
                        Unlock Hint
                      </Button>
                    )}{' '}
                  </Typography.Text>
                }
              />
            );
          })}
        </Collapse>
      </Card>

      <Card
        title={'Solution'}
        style={{
          marginTop: '1em',
        }}
      >
        <Collapse>
          <Collapse.Panel
            collapsible={answer === 'locked' && 'disabled'}
            header={
              answer === 'locked' ? (
                <Typography.Text>
                  {' '}
                  <LockTwoTone twoToneColor={'#ff0000'} /> Unlock all hints first{' '}
                  {attempt.hints.locked.length === 0 && (
                    <Button loading={loading} type="primary" onClick={unlockAnswer}>
                      {' '}
                      Unlock Answer
                    </Button>
                  )}
                </Typography.Text>
              ) : (
                <Typography.Text>See More</Typography.Text>
              )
            }
            key={'locked'}
          >
            {answer !== 'locked' && (
              <>
                {
                  <div>
                    {' '}
                    <Typography.Text strong> Answer: </Typography.Text>{' '}
                    {parseAnswer(answer.answer_value_numerator, answer.answer_value_denominator)}
                  </div>
                }{answer.explanation_body && (
                  <>
                    <Divider
                      style={{
                        marginTop: '1em',
                      }}
                      orientation="left"
                    >
                      Explanation
                    </Divider>
                    {answer.explanation_body.split('\n').map((line) => (
                      <Typography.Text>{parseKatex(line)}</Typography.Text>
                    ))}
                  </>
                )}
                {answer.explanation_video_url && (
                  <div>
                    <Divider
                      orientation="left"
                      style={{
                        marginTop: '1em',
                      }}
                    >
                      Explanation Video
                    </Divider>
                    <Player fluid src={answer.explanation_video_url}>
                      <ControlBar autoHide={false} />
                      <BigPlayButton position="center" />
                    </Player>
                  </div>
                )}
                {answer.explanation_body_pdf_url && (
                  <div>
                    <Divider
                      orientation="left"
                      style={{
                        marginTop: '1em',
                      }}
                    >
                      Explanation PDF
                    </Divider>
                    <PdfViewer pdf={answer.explanation_body_pdf_url} />
                  </div>
                )}
                
              </>
            )}
          </Collapse.Panel>
        </Collapse>
      </Card>
    </Card>
  );
};

export default connect(({ attempt, loading }) => ({
  attempt: attempt,
  loading: loading.models.attempt,
}))(HintsAndSolution);
