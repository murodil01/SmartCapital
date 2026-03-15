import { MoveLeft } from "lucide-react";
import { Form, Input, message } from "antd";

const ForgotPassword = ({ onSuccess, onBack }) => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    // Backendda new-password API yo'q, shuning uchun demo
    console.log(values);

    message.success("Reset link sent to your phone!");
    setTimeout(() => {
      onSuccess();
    }, 1000);
  };

  return (
    <div className="flex flex-col">
      <h3 className="text-[clamp(24px,5vw,32px)] font-bold mb-2 text-[#3A3F63]">
        FORGOT PASSWORD?
      </h3>

      <p className="text-[#6A74A5] font-normal text-[14px] sm:text-[16px] mb-6">
        Don’t worry! Enter your registered phone number to reset your password
      </p>

      <Form form={form} layout="vertical" onFinish={onFinish}>
        {/* Phone number */}
        <Form.Item
          label={
            <span
              style={{ color: "#3A3F63", fontWeight: 600, fontSize: "16px" }}
            >
              Phone Number
            </span>
          }
          name="phone"
          rules={[
            { required: true, message: "Please enter your phone number!" },
          ]}
          required={false}
        >
          <Input
            placeholder="+998 94 123 12 12"
            autoComplete="tel"
            style={{
              borderRadius: 4,
              border: "1px solid #DAE0F2",
              padding: "12px 16px",
            }}
          />
        </Form.Item>

        {/* Button */}
        <Form.Item>
          <button
            type="submit"
            className="w-full mt-5 lg:mt-10 lg:w-75 cursor-pointer flex items-center justify-center gap-3 bg-linear-to-r from-[#4B5EFF] to-[#4F8AFF] text-white py-3.5 rounded-[27px] font-semibold text-[16px] sm:text-[18px] shadow-md hover:opacity-90 transition"
          >
            Reset Password
          </button>
        </Form.Item>
      </Form>

      <p className="text-[#6A74A5] text-[16px] font-semibold my-4">
        Remember your password?
      </p>

      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-[#6A74A5]"
      >
        <MoveLeft size={20} />
        Sign in
      </button>
    </div>
  );
};

export default ForgotPassword;
