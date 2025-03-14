import { Button, Form, Input, message } from "antd";
import { axiosPost } from "../helper/axiosConfig";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();

    const onFinish = async (values) => {
        console.log("Form Values:", values);
        const { data, error } = await axiosPost("/auth/login", values);
        if (error) {
            message.error(data?.message || 'Login Failed')
            console.log(error);
        }
        else {
            message.success(data?.message || 'Login Successful')
            // Store user token or data in localStorage or context
            console.log("Response data :", data);

            if (data.data?.token) {
                localStorage.setItem('token', data.data.token);
            }
            navigate("/dashboard")
        }
    };

    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
            <Form form={form} onFinish={onFinish} layout="vertical" style={{ width: "300px" }}>
                <Form.Item
                    label="Email"
                    name="email"
                    rules={[{ required: true, message: "Please enter your email", type: "email" }]}
                >
                    <Input placeholder="Enter your email" />
                </Form.Item>
                <Form.Item
                    label="Password"
                    name="password"
                    rules={[{ required: true, message: "Please enter your password" }]}
                >
                    <Input.Password placeholder="Enter your password" />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" block>
                        Login
                    </Button>
                </Form.Item>
                <div style={{ textAlign: "center", marginTop: "10px" }}>
                    Don't have an account? <a href="/register">Register now</a>
                </div>
            </Form>
        </div>
    );
};

export default LoginPage;