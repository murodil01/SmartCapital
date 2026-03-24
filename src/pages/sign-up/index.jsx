// import { Form, Input, message } from "antd";
// import { useNavigate } from "react-router-dom";
// import logo from "../../assets/images/logo.png";
// import sign_bg from "../../assets/images/sign_bg.png";
// import { MoveRight } from "lucide-react";
// import Password from "../../components/sign-up/password";
// import { useState } from "react";
// import { authAPI } from "../../api/auth";

// const SignUp = () => {
//   const [step, setStep] = useState("phone");
//   const [phoneNumber, setPhoneNumber] = useState("");
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const handlePhoneSubmit = (values) => {
//     setPhoneNumber(values.phone);
//     setStep("password");
//   };

//   // const handleRegister = async (passwordData) => {
//   //   setLoading(true);
//   //   try {
//   //     const registerData = {
//   //       phone: phoneNumber,
//   //       password: passwordData.password,
//   //       confirm_password: passwordData.confirmPassword,
//   //     };

//   //     const response = await authAPI.register(registerData);
//   //     message.success("Registration successful! Please sign in.");
//   //     navigate("/"); // SignIn sahifasiga o'tadi
//   //   } catch (error) {
//   //     message.error(error.error || "Registration failed");
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };

//   const handleRegister = async (passwordData) => {
//     setLoading(true);
//     try {
//       const registerData = {
//         phone: phoneNumber,
//         password: passwordData.password,
//         confirm_password: passwordData.confirmPassword,
//       };

//       await authAPI.register(registerData);

//       message.success("Registration successful! Please sign in.");
//       navigate("/");
//     } catch (error) {
//       message.error(error.error || "Registration failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex flex-col lg:flex-row gap-0 h-screen">
//       {/* LEFT SIDE */}
//       <div
//         className="flex flex-col gap-6 lg:gap-12.5 p-7.5 w-full lg:w-120 text-white lg:p-10 bg-no-repeat bg-cover bg-position-[center_top] lg:bg-center"
//         style={{ backgroundImage: `url(${sign_bg})` }}
//       >
//         <div className="flex items-center gap-3">
//           <img src={logo} alt="Logo" className="w-10" />
//           <h3 className="text-[24px] font-medium text-white">SmartCapital</h3>
//         </div>

//         <p className="text-[20px] sm:text-[24px] md:text-[28px] lg:text-[32px] xl:text-[34px] uppercase font-semibold leading-relaxed max-w-full lg:max-w-80">
//           Stay <span className="text-[#71A0FE]">organized</span> save{" "}
//           <span className="text-[#71A0FE]">more</span> and achieve your
//           financial <span className="text-[#71A0FE]">goals</span>
//         </p>
//       </div>

//       {/* RIGHT SIDE */}
//       <div className="bg-white rounded-t-3xl lg:rounded-none flex flex-col flex-1 items-center -mt-5 lg:mt-0 justify-center relative p-4">
//         {/* PHONE STEP */}
//         {step === "phone" && (
//           <>
//             {/* Top-right "Get started" */}
//             <div className="relative lg:absolute lg:top-8 lg:right-8 flex justify-end lg:justify-start items-center gap-3 lg:gap-5 mb-4 lg:mb-0">
//               <button
//                 onClick={() => navigate("/")}
//                 className="text-[#6A74A5] text-[14px] lg:text-[16px] font-normal"
//               >
//                 Already have an account?
//               </button>
//               <button
//                 onClick={() => navigate("/")}
//                 className="text-[#4458FE] cursor-pointer font-medium text-[14px] lg:text-[16px] border-2 border-[#4458FE] py-1.5 px-4 lg:py-2 lg:px-6 rounded-[27px] hover:bg-[#4458FE] hover:text-white transition"
//               >
//                 Sign in
//               </button>
//             </div>

//             {/* Form container */}
//             <div className="w-full max-w-155 p-4 md:p-0">
//               <h3 className="text-[clamp(24px,5vw,32px)] font-bold mb-2 text-[#3A3F63]">
//                 CREATE AN ACCOUNT
//               </h3>
//               <p className="text-[#6A74A5] font-normal text-[14px] sm:text-[16px] mb-6">
//                 Create your account and start your financial journey today
//               </p>

//               <Form layout="vertical" onFinish={handlePhoneSubmit}>
//                 <Form.Item
//                   label={
//                     <span
//                       style={{
//                         color: "#3A3F63",
//                         fontWeight: 600,
//                         fontSize: "16px",
//                       }}
//                     >
//                       Phone Number
//                     </span>
//                   }
//                   name="phone"
//                   rules={[
//                     {
//                       required: true,
//                       message: "Please enter your phone number!",
//                     },
//                     {
//                       pattern: /^\+998\d{9}$/,
//                       message: "Please enter valid phone number!",
//                     },
//                   ]}
//                   required={false}
//                 >
//                   <Input
//                     placeholder="+998 XX XXX XX XX"
//                     autoComplete="tel"
//                     style={{
//                       borderRadius: 4,
//                       border: "1px solid #DAE0F2",
//                       padding: "12px 16px",
//                     }}
//                   />
//                 </Form.Item>

//                 <Form.Item>
//                   <button
//                     type="submit"
//                     className="w-full mt-5 lg:mt-10 lg:w-75 cursor-pointer flex items-center justify-center gap-3 bg-[#cccfdd] text-[#6A74A5] py-3.5 rounded-[27px] font-semibold text-[16px] sm:text-[18px] shadow-md hover:opacity-90 transition"
//                   >
//                     Sign up <MoveRight />
//                   </button>
//                 </Form.Item>
//               </Form>
//             </div>
//           </>
//         )}

//         {/* PASSWORD STEP */}
//         {step === "password" && (
//           <Password
//             onBack={() => setStep("phone")}
//             onSuccess={handleRegister}
//             loading={loading}
//           />
//         )}
//       </div>
//     </div>
//   );
// };

// export default SignUp;

import { Form, Input, message } from "antd";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/images/logo.png";
import sign_bg from "../../assets/images/sign_bg.png";
import { MoveRight } from "lucide-react";
import Password from "../../components/sign-up/password";
import { useState, useEffect } from "react";
import { authAPI } from "../../api/auth";
import AOS from "aos";
import "aos/dist/aos.css";

const SignUp = () => {
  const [step, setStep] = useState("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [mobileLeftHeight, setMobileLeftHeight] = useState("100vh");
  const [mobileRightVisible, setMobileRightVisible] = useState(false);
  const isMobile = window.innerWidth < 768; // STATIC
  const navigate = useNavigate();

  // AOS faqat mobile uchun
  useEffect(() => {
    if (isMobile) {
      AOS.init({ duration: 800, once: true });
    }
  }, [isMobile]);

  // Mobile left side height animatsiyasi
  useEffect(() => {
    if (isMobile) {
      let height = 100;
      const interval = setInterval(() => {
        height -= 2;
        if (height <= 35) {
          height = 35;
          clearInterval(interval);
          setMobileRightVisible(true);
        }
        setMobileLeftHeight(height + "vh");
      }, 28);
      return () => clearInterval(interval);
    } else {
      setMobileLeftHeight("auto");
      setMobileRightVisible(true);
    }
  }, [isMobile]);

  const handlePhoneSubmit = (values) => {
    setPhoneNumber(values.phone);
    setStep("password");
  };

  const handleRegister = async (passwordData) => {
    setLoading(true);
    try {
      const registerData = {
        phone: phoneNumber,
        password: passwordData.password,
        confirm_password: passwordData.confirmPassword,
      };

      await authAPI.register(registerData);

      message.success("Registration successful! Please sign in.");
      navigate("/");
    } catch (error) {
      message.error(error.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="flex flex-col lg:flex-row gap-0 h-screen overflow-hidden"
      {...(isMobile ? { "data-aos": "fade-zoom-in" } : {})}
    >
      {/* LEFT SIDE */}
      <div
        className="flex flex-col gap-6 lg:gap-12.5 p-7.5 w-full lg:w-120 text-white lg:p-10 bg-no-repeat bg-cover bg-position-[center_top] lg:bg-center transition-all duration-700 ease-in-out md:w-1/2"
        style={{
          backgroundImage: `url(${sign_bg})`,
          height: mobileLeftHeight,
        }}
      >
        <div className="flex items-center gap-3">
          <img src={logo} alt="Logo" className="w-10" />
          <h3 className="text-[24px] font-medium text-white">SmartCapital</h3>
        </div>

        <p className="text-[20px] sm:text-[24px] md:text-[28px] lg:text-[32px] xl:text-[34px] uppercase font-semibold leading-relaxed max-w-full lg:max-w-80">
          Stay <span className="text-[#71A0FE]">organized</span> save{" "}
          <span className="text-[#71A0FE]">more</span> and achieve your
          financial <span className="text-[#71A0FE]">goals</span>
        </p>
      </div>

      {/* RIGHT SIDE */}
      <div
        className="bg-white rounded-t-3xl lg:rounded-none flex flex-col flex-1 items-center -mt-5 lg:mt-0 justify-center relative p-4"
        style={
          isMobile
            ? {
                opacity: mobileRightVisible ? 1 : 0,
                transform: mobileRightVisible
                  ? "translateY(0)"
                  : "translateY(24px)",
                transition: "opacity 0.6s ease, transform 0.6s ease",
              }
            : {}
        }
      >
        {/* PHONE STEP */}
        {step === "phone" && (
          <>
            {/* Top-right "Get started" */}
            <div className="relative lg:absolute lg:top-8 lg:right-8 flex justify-end lg:justify-start items-center gap-3 lg:gap-5 mb-4 lg:mb-0">
              <button
                onClick={() => navigate("/")}
                className="text-[#6A74A5] text-[14px] lg:text-[16px] font-normal"
              >
                Already have an account?
              </button>
              <button
                onClick={() => navigate("/")}
                className="text-[#4458FE] cursor-pointer font-medium text-[14px] lg:text-[16px] border-2 border-[#4458FE] py-1.5 px-4 lg:py-2 lg:px-6 rounded-[27px] hover:bg-[#4458FE] hover:text-white transition"
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

              <Form layout="vertical" onFinish={handlePhoneSubmit}>
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
                    {
                      pattern: /^\+998\d{9}$/,
                      message: "Please enter valid phone number!",
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
                    type="submit"
                    className={`w-full lg:w-75 cursor-pointer flex items-center justify-center gap-3 ${
                      loading
                        ? "bg-gray-400 text-[#6A74A5]"
                        : "bg-linear-to-r from-[#4F8AFF] to-[#4B5EFF] text-white"
                    }  py-3.5 rounded-[27px] font-semibold text-[16px] sm:text-[18px] shadow-md hover:opacity-90 transition`}
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
            onSuccess={handleRegister}
            loading={loading}
          />
        )}
      </div>
    </div>
  );
};

export default SignUp;