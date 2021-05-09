import {connect} from "umi";
import React, {useState} from "react";
import {Card, Row, Col, Avatar, Button, Form, Input, Divider, Typography, Tag, Alert} from 'antd';
import {verifyNusEmailRequest, verifyOtp} from "@/services/user"
import {UserAccessLevelTag} from "@/components/Users/UsersAccessLevel";
const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};
const NusEmailVerification = (props) => {
  const { user, loading} = props
  const { currentUser } = user
  const [submitEmailLoading, setSubmitEmailLoading] = useState(false)
  const [submitEmailResponse, setSubmitEmailResponse] = useState(null)
  const [submitOtpLoading, setSubmitOtpLoading] = useState(false)
  const [submitOtpResponse, setSubmitOtpResponse] = useState(null)
  const onFinishSendEmail = async (nus_email) => {
    setSubmitEmailLoading(true)
    verifyNusEmailRequest(nus_email).then(() => {
      setSubmitEmailResponse({success: "OTP successfully sent to email"})
    }).catch((err) => {
      setSubmitEmailResponse({error: "Failed to send OTP to email"})
    })
    setSubmitEmailLoading(false)
  }
  const onSubmitOtp = async (otp) => {
    setSubmitOtpLoading(true)
    verifyOtp(otp).then(() => {
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
  return(
    <div>
      <Row
        style={{
          marginBottom: "1em"
        }}
      >
        <Typography.Title level={5}
          style={{
            marginRight: "1em"
          }}
        >
          Access level
        </Typography.Title>
        {
          renderAccessLevelTags()
        }
      </Row>

      <Form
        {...layout}
        name="basic"
        initialValues={{ nus_email:currentUser.nus_email }}
        onFinish={onFinishSendEmail}
      >

        <Form.Item
          label="Nus Email"
          name="nus_email"
        >
          <Input />
        </Form.Item>


        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit" loading={submitEmailLoading}>
            Send OTP to email
          </Button>
        </Form.Item>
      </Form>
      {
        submitEmailResponse && submitEmailResponse.success && <Alert message={submitEmailResponse.success} type={"success"}/>
      }
      {
        submitEmailResponse && submitEmailResponse.error && <Alert message={submitEmailResponse.error} type={"error"}/>
      }

      {
        submitEmailResponse && submitEmailResponse.success &&
        <Form
          style={{
            marginTop:"1em"
          }}
          {...layout}
          name="basic"
          onFinish={onSubmitOtp}
        >

          <Form.Item
            label="OTP"
            name="otp"
          >
            <Input />
          </Form.Item>

          <Form.Item {...tailLayout}>
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
    </div>
  )
}

export default connect(({ user, loading }) => ({
  user: user,
  loading: loading.models.user,
}))(NusEmailVerification);

