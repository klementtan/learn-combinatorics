import React, {useState} from "react";
import {Card, Row, Col, Avatar, Button, Form, Input, Divider, Typography, Tag, Alert} from 'antd';
import {verifyNusEmailRequest, verifyOtp} from "@/services/user"
import {ACCESS_LEVELS, UserAccessLevelTag} from "@/components/Users/UsersAccessLevel";
import {connect} from "umi";

const NusEmailVerification = (props) => {
  const { user, loading} = props
  const { currentUser } = user
  const [submitEmailLoading, setSubmitEmailLoading] = useState(false)
  const [submitEmailResponse, setSubmitEmailResponse] = useState(null)
  const [submitOtpLoading, setSubmitOtpLoading] = useState(false)
  const [submitOtpResponse, setSubmitOtpResponse] = useState(null)
  const onFinishSendEmail = async (nus_email) => {
    setSubmitEmailLoading(true)
    await verifyNusEmailRequest(nus_email).then(() => {
      setSubmitEmailResponse({success: "OTP successfully sent to email"})
    }).catch((err) => {
      setSubmitEmailResponse({error: "Failed to send OTP to email"})
    })
    setSubmitEmailLoading(false)
  }
  const onSubmitOtp = async (otp) => {
    setSubmitOtpLoading(true)
    await verifyOtp(otp).then(() => {
        setSubmitOtpResponse({success: "Email Verified"})
    }).catch((err) => {
      setSubmitOtpResponse({error: "Invalid OTP entered"})
    })
    const {dispatch} = props
    if (dispatch) {
      await dispatch({
        type: 'user/fetchCurrent'
      });
    }
    setSubmitOtpLoading(false)
  }
  const renderAccessLevelTags = () => {

    return (
      currentUser.roles.map((role, idx) => {
        return (<UserAccessLevelTag
          style={{
            marginLeft: "1em"
          }}
          role={role.name} key={idx}/>)
      })
    )
  }
  const isNusEmailVerified = () => {
    return currentUser.roles.map(role => role.name).includes(ACCESS_LEVELS.NUS_USER)
  }
  return(
    <Card
      title={"Profile"}
      style={{marginTop: "1em"}}
    >
      <Row
        justify={"center"}
      >

        <Form
          style={{width: "75%"}}
          name="basic"
          initialValues={{ nus_email:currentUser.nus_email }}
          onFinish={onFinishSendEmail}
        >
          <Form.Item
            label={"Access Levels"}
          >
            {
              renderAccessLevelTags()
            }
          </Form.Item>
          <Form.Item
            label="Nus Email"
            name="nus_email"
          >
            <Input
              disabled={isNusEmailVerified()}
            />
          </Form.Item>


          <Form.Item >
            <Button type="primary" htmlType="submit" loading={submitEmailLoading} disabled={isNusEmailVerified()}>
              Send OTP to email
            </Button>
            {
              submitEmailResponse && submitEmailResponse.success && <Alert style={{marginTop: "0.5em"}} message={submitEmailResponse.success} type={"success"}/>
            }
            {
              submitEmailResponse && submitEmailResponse.error && <Alert style={{marginTop: "0.5em"}} message={submitEmailResponse.error} type={"error"}/>
            }
          </Form.Item>
        </Form>


        {
          submitEmailResponse && submitEmailResponse.success &&
          <Form
            style={{
              marginTop:"0.5em",
              width: "75%"
            }}
            name="basic"
            onFinish={onSubmitOtp}
          >

            <Form.Item
              label="OTP"
              name="otp"
            >
              <Input />
            </Form.Item>

            <Form.Item >
              <Button type="primary" htmlType="submit" loading={submitOtpLoading || loading}>
                Submit
              </Button>
            </Form.Item>
            {
              submitOtpResponse && submitOtpResponse.success && <Alert message={submitOtpResponse.success} type={"success"}/>
            }
            {
              submitOtpResponse && submitOtpResponse.error && <Alert message={submitOtpResponse.error} type={"error"}/>
            }
          </Form>
        }
      </Row>
    </Card>
  )
}

export default connect(({ user, loading }) => ({
  user: user,
  loading: loading.models.user,
}))(NusEmailVerification);

