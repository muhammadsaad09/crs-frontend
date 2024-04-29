"use client";
import React, { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";
import happyIcon from "@/public/happy.png";
import neutralIcon from "@/public/neutral.png";
import sadIcon from "@/public/sad.png";
import Image from "next/image";

const creditRisk: any = {
  low: "Low Risk",
  medium: "Medium Risk",
  high: "High Risk",
};

const smiley: any = {
  low: happyIcon,
  medium: neutralIcon,
  high: sadIcon,
};

const Home = () => {
  const [predictedScore, setPredictedScore] = useState("");
  const [risk, setRisk] = useState("");
  const [emoji, setEmoji] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [currentText, setCurrentText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const text =
    "Welcome to Scorecast. Unlock your full financial potential by knowing your credit score. Lets embark on this journey towards financial success and health together!";
  const delay = 50; // milliseconds
  const [inputValues, setInputValues] = useState<any>({
    input1: "",
    input2: "",
    input3: "",
    input4: "",
    input5: "",
    input6: "",
    input7: "",
  });
  const [errors, setErrors] = useState<any>({
    input1: "",
    input2: "",
    input3: "",
    input4: "",
    input5: "",
    input6: "",
    input7: "",
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    let error = "";

    if (value.trim() === "") {
      error = "Input cannot be empty";
    } else if (!/^\d*\.?\d*$/.test(value)) {
      error = "Input must contain only numbers";
    }

    setInputValues({
      ...inputValues,
      [name]: value,
    });

    setErrors({
      ...errors,
      [name]: error,
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    let hasError = false;

    Object.keys(inputValues).forEach((key) => {
      const value = inputValues[key];
      let error = "";

      if (value.trim() === "") {
        error = "Input cannot be empty";
        hasError = true;
      } else if (!/^\d*\.?\d*$/.test(value)) {
        error = "Input must contain only numbers";
        hasError = true;
      }

      setErrors({
        ...errors,
        [key]: error,
      });
    });
    console.log("Error:", hasError);

    if (!hasError) {
      try {
        console.log("here it is");
        setLoading(true);
        const response = await fetch("http://127.0.0.1:8000/predict/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(inputValues),
        });
        if (response.ok) {
          const data = await response.json();
          console.log(data?.predicted_score);
          setPredictedScore(data?.predicted_score);
          setRisk(creditRisk[data?.credit_risk]);
          setEmoji(smiley[data?.credit_risk]);
          setIsOpen(true);
        } else {
          console.error("Failed to login");
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    }
  };
  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setCurrentText((prevText) => prevText + text[currentIndex]);
        setCurrentIndex((prevIndex) => prevIndex + 1);
      }, delay);

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, delay, text]);
  return (
    <main className="flex justify-center">
      <div className="relative shadow-custom bg-white flex h-screen w-[800px] flex-col items-center justify-center">
        {isOpen && (
          <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-4 rounded shadow-lg">
              <div className="flex justify-end">
                {/* Button to close the popup */}
                <button
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => {
                    setIsOpen(false);
                    setInputValues({
                      input1: "",
                      input2: "",
                      input3: "",
                      input4: "",
                      input5: "",
                      input6: "",
                    });
                  }}
                >
                  <svg
                    className="h-6 w-6 fill-current"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M13.414 12l4.293 4.293a1 1 0 01-1.414 1.414L12 13.414l-4.293 4.293a1 1 0 01-1.414-1.414L10.586 12 6.293 7.707a1 1 0 011.414-1.414L12 10.586l4.293-4.293a1 1 0 111.414 1.414L13.414 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
              {/* Popup content */}
              <div className="flex flex-col justify-center items-center my-6 mx-24">
                <h2 className="text-lg font-bold text-[22px] mb-4">
                  Credit Score Forecast
                </h2>
                <div>
                  Your Credit Score is:{" "}
                  <span className="font-semibold">{predictedScore}</span>
                </div>
                <p className="my-2">You are at {risk}!</p>
                <Image src={emoji} alt="emoji" className="mt-4" width={80} />
              </div>
            </div>
          </div>
        )}
        {loading && (
          <div className="absolute top-0 w-full">
            <BarLoader width={"100%"} color="#2d3436" />
          </div>
        )}
        <div className="text-[28px] text-[#2d3436] font-semibold p-4">
          Scorecast
        </div>
        <div className="w-[450px] text-center">{currentText}</div>
        <div className="my-8">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              <div>
                <label className="text-[#2f3542] text-[15px]">
                  Profit Margin:*
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="input1"
                    value={inputValues.input1}
                    onChange={handleChange}
                    placeholder="Enter Profit Margin"
                    className="bg-[#F1F1F1] text-[15px]  p-2 outline-[#636e72] rounded-lg w-[250px]"
                  />
                  {errors.input1 && (
                    <p className="text-[14px] text-red-500">{errors.input1}</p>
                  )}
                </div>
              </div>
              <div>
                <label className="text-[#2f3542] text-[15px]">
                  Return on Total Assets:*
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="input2"
                    value={inputValues.input2}
                    onChange={handleChange}
                    placeholder="Enter Return on Total Assets"
                    className="bg-[#F1F1F1] text-[15px]  p-2 outline-[#636e72] rounded-lg w-[250px]"
                  />
                  {errors.input2 && (
                    <p className="text-[14px] text-red-500">{errors.input2}</p>
                  )}
                </div>
              </div>
              <div>
                <label className="text-[#2f3542] text-[15px]">
                  Credit Limit:*
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="input3"
                    value={inputValues.input3}
                    onChange={handleChange}
                    placeholder="Enter Credit Limit"
                    className="bg-[#F1F1F1] text-[15px]  p-2 outline-[#636e72] rounded-lg w-[250px]"
                  />
                  {errors.input3 && (
                    <p className="text-[14px] text-red-500">{errors.input3}</p>
                  )}
                </div>
              </div>
              <div>
                <label className="text-[#2f3542] text-[15px]">
                  Likelihood of Failure (%):*
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="input4"
                    value={inputValues.input4}
                    onChange={handleChange}
                    placeholder="Enter Likelihood of Failure"
                    className="bg-[#F1F1F1] text-[15px]  p-2 outline-[#636e72] rounded-lg w-[250px]"
                  />
                  {errors.input4 && (
                    <p className="text-[14px] text-red-500">{errors.input4}</p>
                  )}
                </div>
              </div>
              <div>
                <label className="text-[#2f3542] text-[15px]">
                  No of Employees:*
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="input5"
                    value={inputValues.input5}
                    onChange={handleChange}
                    placeholder="Enter No. of Employees"
                    className="bg-[#F1F1F1] text-[15px]  p-2 outline-[#636e72] rounded-lg w-[250px]"
                  />
                  {errors.input5 && (
                    <p className="text-[14px] text-red-500">{errors.input5}</p>
                  )}
                </div>
              </div>
              <div>
                <label className="text-[#2f3542] text-[15px]">Gearing:*</label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="input6"
                    value={inputValues.input6}
                    onChange={handleChange}
                    placeholder="Enter Gearing"
                    className="bg-[#F1F1F1] text-[15px]  p-2 outline-[#636e72] rounded-lg w-[250px]"
                  />
                  {errors.input6 && (
                    <p className="text-[14px] text-red-500">{errors.input6}</p>
                  )}
                </div>
              </div>
              <div>
                <label className="text-[#2f3542] text-[15px]">
                  Net Current Assets:*
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="input7"
                    value={inputValues.input7}
                    onChange={handleChange}
                    placeholder="Enter Net Current Assets"
                    className="bg-[#F1F1F1] text-[15px]  p-2 outline-[#636e72] rounded-lg w-[250px]"
                  />
                  {errors.input7 && (
                    <p className="text-[14px] text-red-500">{errors.input7}</p>
                  )}
                </div>
              </div>
            </div>
            <div className="flex justify-center mt-5">
              <button
                type="submit"
                className="text-white px-4 py-2 font-semibold rounded outline-none w-[120px]  bg-[#2d3436] text-[15px] py-2 px-4"
              >
                Forecast
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default Home;
