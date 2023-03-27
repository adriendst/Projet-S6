import React from 'react';
import {Button, Checkbox, Form, Input} from "antd";
import {Link} from "react-router-dom";
import './Login.css'
import {KeyOutlined, MailOutlined} from "@ant-design/icons";

const onFinish = (values: any) => {
    console.log('Success:', values);
};

const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
};

const Login = () => {
    return (
        <div className={'login'}>
            <div className={'border'}>
                <Form
                    name="login"
                    style={{width: '300px'}}
                    initialValues={{remember: true}}
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
                        rules={[{required: true, message: 'Please input your password!'}]}
                    >
                        <Input.Password prefix={<KeyOutlined className="site-form-item-icon"/>} placeholder="Password"/>
                    </Form.Item>
                    <div className={'endForm'}>
                        <Form.Item name="remember" valuePropName="checked">
                            <Checkbox>Remember me</Checkbox>
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                Submit
                            </Button>
                        </Form.Item>
                    </div>
                </Form>
                <div>Doesn't have an account yet ?</div>
                <div><Link to={'/register'}>Register now !</Link></div>
            </div>
        </div>
    );
};

export default Login;
