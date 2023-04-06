import React from 'react';
import {Button, Checkbox, Form, Input} from "antd";
import {Link, useNavigate} from "react-router-dom";
import './Login.css'
import {KeyOutlined, MailOutlined} from "@ant-design/icons";
import axios, {AxiosResponse} from "axios";
import Layout from "../Layout/Layout";
import {useDispatch} from "react-redux";
import {userConnection} from "../Slice/Slice";

const Login = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const onFinish = (values: any) => {
        axios.post('http://localhost:9090/v1/auth/login', {'email': values.email, 'password': values.password})
            .then((response: AxiosResponse<any, any>) => {
                localStorage.setItem('refreshToken', response.data.refreshToken);
                dispatch(userConnection(response.data));
                axios.defaults.headers.common['authorization'] = `Bearer ${response.data.accessToken}`

            });
        navigate( '/');
    };

    const onFinishFailed = (errorInfo: any) => {

    };

    return (
        <div>
            <Layout/>
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
                            style={{height: '45px'}}

                        >
                            <Input prefix={<MailOutlined className="site-form-item-icon"/>} placeholder="Email"/>
                        </Form.Item>

                        <Form.Item
                            name="password"
                            style={{height: '45px'}}

                            rules={[{required: true, message: 'Please input your password!'}]}
                        >
                            <Input.Password prefix={<KeyOutlined className="site-form-item-icon"/>}
                                            placeholder="Password"/>
                        </Form.Item>
                        <div className={'endForm'}>
                            <Form.Item name="remember" valuePropName="checked" style={{height: '45px'}}
                            >
                                <Checkbox>Remember me</Checkbox>
                            </Form.Item>

                            <Form.Item style={{height: '45px'}}>
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
        </div>
    );
};

export default Login;
