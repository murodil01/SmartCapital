import { Form, Input, Checkbox, message } from "antd";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/images/logo.png";
import sign_bg from "../../assets/images/sign_bg.png";
import { MoveRight } from "lucide-react";
import { useState } from "react";
import ForgotPassword from "../../components/sign-in/forgot-password";
import NewPassword from "../../components/sign-in/new-password";
import { authAPI } from "../../api/auth";

const SignIn = () => {
  const [step, setStep] = useState("phone");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignIn = async (values) => {
    setLoading(true);
    try {
      const loginData = {
        phone: values.phone,
        password: values.password,
      };

      await authAPI.login(loginData);

      message.success("Login successful!");
      navigate("/home");
    } catch (error) {
      message.error(error.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-0 h-screen">
      {/* LEFT SIDE */}
      <div
        className="flex flex-col gap-6 lg:gap-12.5 p-7.5 w-full lg:w-120 text-white lg:p-10 bg-no-repeat bg-cover bg-position-[center_top] lg:bg-center"
        style={{ backgroundImage: `url(${sign_bg})` }}
      >
        <div className="flex items-center gap-3">
          <img src={logo} alt="Logo" className="w-10" />
          <h1 className="text-[24px] font-medium text-white">SmartCapital</h1>
        </div>

        <p className="text-[20px] sm:text-[24px] md:text-[28px] lg:text-[32px] xl:text-[34px] uppercase font-semibold leading-relaxed max-w-full lg:max-w-80">
          Stay <span className="text-[#71A0FE]">organized</span> save{" "}
          <span className="text-[#71A0FE]">more</span> and achieve your
          financial <span className="text-[#71A0FE]">goals</span>
        </p>
      </div>

      {/* RIGHT SIDE */}
      <div className="bg-white rounded-t-3xl lg:rounded-none flex flex-col flex-1 items-center -mt-5 lg:mt-0 justify-center relative p-4">
        {/* Top-right "Get started" */}
        <div className="relative lg:absolute lg:top-8 lg:right-8 flex justify-end lg:justify-start items-center gap-3 lg:gap-5 mb-4 lg:mb-0">
          <button
            onClick={() => navigate("/sign-up")}
            className="text-[#6A74A5] text-[14px] lg:text-[16px] font-normal cursor-pointer"
          >
            Don’t have an account?
          </button>
          <button className="text-[#4458FE] font-medium text-[14px] lg:text-[16px] border-2 border-[#4458FE] py-1.5 px-4 lg:py-2 lg:px-6 rounded-[27px] hover:bg-[#4458FE] hover:text-white transition">
            Get started
          </button>
        </div>

        {/* Form container */}
        <div className="w-full max-w-155 p-4 md:p-0">
          {step === "phone" && (
            <>
              <h3 className="text-[clamp(24px,5vw,32px)] font-bold mb-2 text-[#3A3F63]">
                WELCOME TO SMARTCAPITAL
              </h3>
              <p className="text-[#6A74A5] font-normal text-[14px] sm:text-[16px] mb-6">
                Smart way to manage your personal finances
              </p>

              <Form layout="vertical" onFinish={handleSignIn}>
                <Form.Item
                  label={
                    <span
                      style={{
                        color: "#3A3F63",
                        fontWeight: 600,
                        fontSize: "16px",
                      }}
                    >
                      Phone Number
                    </span>
                  }
                  name="phone"
                  rules={[
                    {
                      required: true,
                      message: "Please enter your phone number!",
                    },
                  ]}
                  required={false}
                >
                  <Input
                    placeholder="+998 XX XXX XX XX"
                    autoComplete="tel"
                    style={{
                      borderRadius: 4,
                      border: "1px solid #DAE0F2",
                      padding: "12px 16px",
                    }}
                  />
                </Form.Item>

                <Form.Item
                  label={
                    <span
                      style={{
                        color: "#3A3F63",
                        fontWeight: 600,
                        fontSize: "16px",
                      }}
                    >
                      Password
                    </span>
                  }
                  name="password"
                  rules={[
                    { required: true, message: "Please enter your password!" },
                  ]}
                  required={false}
                >
                  <Input.Password
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    style={{
                      borderRadius: 4,
                      border: "1px solid #DAE0F2",
                      padding: "12px 16px",
                    }}
                  />
                </Form.Item>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center my-6 sm:my-10 gap-2 sm:gap-0">
                  <Checkbox className="text-[#3A3F63] font-normal">
                    Remember me on this device
                  </Checkbox>
                  <button
                    type="button"
                    onClick={() => setStep("forgotPassword")}
                    className="text-[#3A3F63] font-medium text-[14px] sm:text-[16px] cursor-pointer mt-2 sm:mt-0"
                  >
                    Forgot Password?
                  </button>
                </div>

                <Form.Item>
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full lg:w-75 cursor-pointer flex items-center justify-center gap-3 ${
                      loading ? "bg-gray-400" : "bg-[#cccfdd]"
                    } text-[#6A74A5] py-3.5 rounded-[27px] font-semibold text-[16px] sm:text-[18px] shadow-md hover:opacity-90 transition`}
                  >
                    {loading ? "Signing in..." : "Sign in"} <MoveRight />
                  </button>
                </Form.Item>
              </Form>
            </>
          )}
          {/* FORGOT PASSWORD */}
          {step === "forgotPassword" && (
            <ForgotPassword
              onBack={() => setStep("phone")}
              onSuccess={() => setStep("newPassword")}
            />
          )}
          {/* NEW PASSWORD */}
          {step === "newPassword" && (
            <NewPassword
              onBack={() => setStep("forgotPassword")}
              onSuccess={() => setStep("phone")}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default SignIn;
