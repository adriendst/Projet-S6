import React from 'react';
import {Button, Form, Input} from "antd";
import {Link} from "react-router-dom";
import './Register.css'
import {KeyOutlined, MailOutlined} from "@ant-design/icons";

const onFinish = (values: any) => {
    console.log('Success:', values);
};

const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
};

const Register = () => {
    return (
        <div className={'register'}>
            <div className={'border'}>
            <Form
                name="register"
                style={{width: '300px'}}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <Form.Item
                    name="email"
                    rules={[
                        {
                            type: 'email',
                            message: 'The input is not valid E-mail!',
                        },
                        {
                            required: true,
                            message: 'Please input your E-mail!',
                        },
                    ]}
                >
                    <Input prefix={<MailOutlined className="site-form-item-icon"/>} placeholder="Email"/>
                </Form.Item>

                <Form.Item
                    name="password"
                        rules={[
                        {
                            required: true,
                            message: 'Please input your password!',
                        },
                    ]}
                    hasFeedback
                >
                    <Input.Password prefix={<KeyOutlined className="site-form-item-icon"/>} placeholder="Password"/>
                </Form.Item>

                <Form.Item
                    name="confirm"
                    dependencies={['password']}
                    hasFeedback
                    rules={[
                        {
                            required: true,
                            message: 'Please confirm your password!',
                        },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('The two passwords that you entered do not match!'));
                            },
                        }),
                    ]}
                >
                    <Input.Password prefix={<KeyOutlined className="site-form-item-icon"/>} placeholder="Confirm Password"/>
                </Form.Item>

                <Form.Item className={'endForm'}>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
                <div>Already have an account ?</div><div><Link to={'/login'}>Login now !</Link></div>
            </div>
        </div>
    );
};

export default Register;
