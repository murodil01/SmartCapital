import { Form, Input } from "antd";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/images/logo.png";
import sign_bg from "../../assets/images/sign_bg.png";
import { MoveRight } from "lucide-react";
import Password from "../../components/sign-up/password";
import { useState } from "react";

const SignUp = () => {
  const [step, setStep] = useState("phone");
  const navigate = useNavigate();

  return (
    <div className="flex flex-col lg:flex-row gap-0 h-screen">
      {/* LEFT SIDE */}
      <div
        className="flex flex-col gap-6 lg:gap-12.5 w-full lg:w-120 text-white p-6 lg:p-10 bg-no-repeat bg-center bg-cover"
        style={{ backgroundImage: `url(${sign_bg})` }}
      >
        <div className="flex items-center gap-3">
          <img src={logo} alt="Logo" className="w-10" />
          <h1 className="text-[24px] font-medium text-white">SmartCapital</h1>
        </div>

        <p className="text-2xl sm:text-3xl uppercase font-semibold leading-relaxed max-w-full lg:max-w-65">
          Stay <span className="text-[#71A0FE]">organized</span> save{" "}
          <span className="text-[#71A0FE]">more</span> and achieve your
          financial <span className="text-[#71A0FE]">goals</span>
        </p>
      </div>

      {/* RIGHT SIDE */}
      <div className="bg-white rounded-t-3xl lg:rounded-none flex flex-col flex-1 items-center -mt-5 lg:mt-0 justify-center relative p-4">
        {/* PHONE STEP */}
        {step === "phone" && (
          <>
            {/* Top-right "Get started" */}
            <div className="relative lg:absolute lg:top-8 lg:right-8 flex justify-end lg:justify-start items-center gap-3 lg:gap-5 mb-4 lg:mb-0">
              <button className="text-[#6A74A5] text-[14px] lg:text-[16px] font-normal">
                Already have an account?
              </button>
              <button
                onClick={() => navigate("/")}
                className="text-[#4458FE] font-medium text-[14px] lg:text-[16px] border-2 border-[#4458FE] py-1.5 px-4 lg:py-2 lg:px-6 rounded-[27px] hover:bg-[#4458FE] hover:text-white transition"
              >
                Sign in
              </button>
            </div>

            {/* Form container */}
            <div className="w-full max-w-155 p-4 md:p-0">
              <h3 className="text-[clamp(24px,5vw,32px)] font-bold mb-2 text-[#3A3F63]">
                CREATE AN ACCOUNT
              </h3>
              <p className="text-[#6A74A5] font-normal text-[14px] sm:text-[16px] mb-6">
                Create your account and start your financial journey today
              </p>

              <Form layout="vertical">
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

                <Form.Item>
                  <button
                    onClick={() => setStep("password")}
                    className="w-full mt-5 lg:mt-10 lg:w-75 cursor-pointer flex items-center justify-center gap-3 bg-[#cccfdd] text-white py-3.5 rounded-[27px] font-semibold text-[16px] sm:text-[18px] shadow-md hover:opacity-90 transition"
                  >
                    Sign up <MoveRight />
                  </button>
                </Form.Item>
              </Form>
            </div>
          </>
        )}

        {/* PASSWORD STEP */}
        {step === "password" && (
          <Password
            onBack={() => setStep("phone")}
            onSuccess={() => navigate("/")} // endi SignIn sahifasiga o'tadi
          />
        )}
      </div>
    </div>
  );
};

export default SignUp;
