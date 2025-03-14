import { Button, Form, Input, message } from "antd";
import { axiosPost } from "../helper/axiosConfig";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();

    const onFinish = async (values) => {
        console.log("Form Values:", values);
        const { data, error } = await axiosPost("/auth/register", values);
        if (error) {
            message.error(data.message||'User Register Failed')

            console.log(error);
        }
        else {
            message.success(data.message||'User Register Success')
            navigate("/login")
        }
    };

    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
            <Form form={form} onFinish={onFinish} layout="vertical" style={{ width: "300px" }}>
                <Form.Item
                    label="Username"
                    name="username"
                    rules={[{ required: true, message: "Please enter your username" }]}
                >
                    <Input placeholder="Enter your username" />
                </Form.Item>
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
                        Register
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default RegisterPage;
