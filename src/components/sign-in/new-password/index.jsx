import { MoveLeft } from "lucide-react";
import { Form, Input } from "antd";

const NewPassword = ({ onSuccess, onBack }) => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log("Password saved:", values);
    onSuccess(); // Welcome ga o'tadi
  };

  return (
    <div className="flex flex-col">
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 mb-4 text-[#6A74A5]"
      >
        <MoveLeft size={20} />
        Back
      </button>

      <h3 className="text-[clamp(24px,5vw,32px)] font-bold mb-2 text-[#3A3F63]">
        SET NEW PASSWORD
      </h3>

      <p className="text-[#6A74A5] font-normal text-[14px] sm:text-[16px] mb-6">
        Your password must be at least 8 characters and include letters and
        numbers
      </p>

      <Form form={form} layout="vertical" onFinish={onFinish}>
        {/* Password */}
        <Form.Item
          label={
            <span
              style={{ color: "#3A3F63", fontWeight: 600, fontSize: "16px" }}
            >
              New Password
            </span>
          }
          name="password"
          rules={[
            { required: true, message: "Please enter your password!" },
            { min: 8, message: "Password must be at least 8 characters!" },
          ]}
          required={false}
        >
          <Input.Password
            placeholder="Enter your password"
            autoComplete="new-password"
            style={{
              borderRadius: 4,
              border: "1px solid #DAE0F2",
              padding: "12px 16px",
            }}
          />
        </Form.Item>

        {/* Confirm Password */}
        <Form.Item
          label={
            <span
              style={{ color: "#3A3F63", fontWeight: 600, fontSize: "16px" }}
            >
              Confirm New Password
            </span>
          }
          name="confirmPassword"
          dependencies={["password"]}
          rules={[
            { required: true, message: "Please confirm your password!" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("Passwords do not match!"));
              },
            }),
          ]}
          required={false}
        >
          <Input.Password
            placeholder="Confirm your password"
            autoComplete="new-password"
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
            Save
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

export default NewPassword;
