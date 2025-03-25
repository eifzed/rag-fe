import React from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import { isAuthenticated } from "../utils/auth";
import profile from "../assets/profile.jpeg";
import heroImage1 from "../assets/ideas-flow.svg";
import heroImage2 from "../assets/happy-news.svg";
import heroImage3 from "../assets/newspaper.svg";
import heroImage4 from "../assets/knowledge.svg";
import smartSearchIcon from "../assets/search.svg";
import chatIcon from "../assets/chat.svg";
import organizationIcon from "../assets/organize.svg";
import "../styles/slider.css";

const LandingPage = () => {
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
    customPaging: function(i) {
      return (
        <div
          style={{
            width: "10px",
            height: "10px",
            borderRadius: "50%",
            background: "#ddd",
            display: "inline-block",
            margin: "0 4px"
          }}
        />
      );
    },
    appendDots: dots => (
      <div
        style={{
          position: "absolute",
          bottom: "10px",
          width: "100%",
          textAlign: "center",
          padding: "10px 0"
        }}
      >
        <ul style={{ margin: "0", padding: "0" }}> {dots} </ul>
      </div>
    )
  };
  const heroImages = [heroImage1, heroImage2, heroImage3, heroImage4];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Hero Section with Image Carousel */}
        <div className="py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="text-left">
              <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                Your <span className="text-indigo-600">Smart</span> Knowledge
                Assistant
              </h1>
              <p className="mt-4 text-lg text-gray-500 sm:text-xl">
                Transform your documents into interactive conversations. Ask
                questions, get instant answers, and manage your knowledge with
                ease.
              </p>
              <div className="mt-8 flex gap-4">
                <Link
                  to={isAuthenticated() ? "/contexts" : "/signup"}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-300"
                >
                  Get Started
                </Link>
                <Link
                  to={isAuthenticated() ? "/chat" : "/signup"}
                  className="inline-flex items-center px-6 py-3 border border-indigo-600 text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 transition-colors duration-300"
                >
                  Try Chat
                </Link>
              </div>
            </div>
            <div className="flex justify-center">
              {/* Fixed height/width container to maintain consistent dimensions */}
              <div className="w-full max-w-md h-82 overflow-hidden relative">
                <Slider {...sliderSettings}>
                  {heroImages.map((image, index) => (
                    <div key={index} className="outline-none">
                      <img
                        src={image}
                        alt={`AI Knowledge Assistant ${index + 1}`}
                        className="w-full h-81 object-contain"
                      />
                    </div>
                  ))}
                </Slider>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section with Icons */}
        <div className="py-16 bg-white rounded-2xl shadow-sm my-12">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Powerful Features
          </h2>
          <div className="grid grid-cols-1 gap-12 sm:grid-cols-3">
            <div className="p-6 transition-all duration-300 hover:shadow-md rounded-xl text-center">
              <div className="flex justify-center mb-6">
                <img
                  src={smartSearchIcon}
                  alt="Smart Search"
                  className="w-16 h-16"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                Smart Search
              </h3>
              <p className="mt-3 text-gray-500">
                Find exactly what you need with natural language questions. No
                more endless scrolling through documents.
              </p>
            </div>
            <div className="p-6 transition-all duration-300 hover:shadow-md rounded-xl text-center">
              <div className="flex justify-center mb-6">
                <img
                  src={chatIcon}
                  alt="Interactive Chat"
                  className="w-16 h-16"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                Interactive Chat
              </h3>
              <p className="mt-3 text-gray-500">
                Have natural conversations with your documents. Get instant,
                accurate answers from your knowledge base.
              </p>
            </div>
            <div className="p-6 transition-all duration-300 hover:shadow-md rounded-xl text-center">
              <div className="flex justify-center mb-6">
                <img
                  src={organizationIcon}
                  alt="Easy Organization"
                  className="w-16 h-16"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                Easy Organization
              </h3>
              <p className="mt-3 text-gray-500">
                Keep your information organized and accessible. Create custom
                knowledge bases for different topics or projects.
              </p>
            </div>
          </div>
        </div>

        {/* How It Works Section with Connected Steps */}
        <div className="py-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-indigo-50 rounded-3xl -z-10"></div>
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            How It Works
          </h2>

          {/* Better connection method using SVG arrows or background pattern */}
          <div
            className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-indigo-200 -z-5"
            style={{ top: "140px" }}
          ></div>
          <div
            className="hidden md:block absolute left-1/3 h-3 w-3 transform rotate-45 border-t-0 border-l-0 border-r-2 border-b-2 border-indigo-400"
            style={{ top: "138px", left: "calc(33.3% - 8px)" }}
          ></div>
          <div
            className="hidden md:block absolute left-2/3 h-3 w-3 transform rotate-45 border-t-0 border-l-0 border-r-2 border-b-2 border-indigo-400"
            style={{ top: "138px", left: "calc(66.6% - 8px)" }}
          ></div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3 relative">
            <div className="text-center relative">
              <div className="w-16 h-16 mx-auto bg-indigo-600 rounded-full flex items-center justify-center text-white text-xl font-bold mb-6 shadow-md">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                Create a Context
              </h3>
              <p className="mt-3 text-gray-600">
                Create a context that represents a group of knowledge to
                organize your information.
              </p>
            </div>
            <div className="text-center relative">
              <div className="w-16 h-16 mx-auto bg-indigo-600 rounded-full flex items-center justify-center text-white text-xl font-bold mb-6 shadow-md">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                Add Your Documents
              </h3>
              <p className="mt-3 text-gray-600">
                Upload or connect your documents to build your knowledge base
                quickly and easily.
              </p>
            </div>
            <div className="text-center relative">
              <div className="w-16 h-16 mx-auto bg-indigo-600 rounded-full flex items-center justify-center text-white text-xl font-bold mb-6 shadow-md">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                Start Chatting
              </h3>
              <p className="mt-3 text-gray-600">
                Ask questions naturally and get accurate answers from your
                knowledge base instantly.
              </p>
            </div>
          </div>
        </div>

        {/* About Me Section with Card Design */}
        <div className="py-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            About Me
          </h2>
          <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="w-40 h-40 rounded-full overflow-hidden bg-gray-200 shadow-md border-4 border-white">
                <img
                  src={profile}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl font-bold text-gray-900">
                  Fazrin Adinugraha
                </h3>
                <p className="mt-2 text-lg text-indigo-600 font-medium">
                  Software Engineer
                </p>
                <p className="mt-4 text-gray-600">
                  Passionate about building intelligent and high-performing
                  applications. This knowledge assistant is passion project
                  designed to help you interact with your documents in a more
                  natural way.
                </p>
                <div className="mt-6 flex gap-6 justify-center md:justify-start">
                  <a
                    href="https://github.com/eifzed"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-gray-800 transition-colors duration-300"
                  >
                    <span className="sr-only">GitHub</span>
                    <svg
                      className="h-8 w-8"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </a>
                  <a
                    href="https://www.linkedin.com/in/fazrinadinugraha/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-blue-600 transition-colors duration-300"
                  >
                    <span className="sr-only">LinkedIn</span>
                    <svg
                      className="h-8 w-8"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </a>
                  <a
                    href="mailto:fazrinadinugraha@gmail.com"
                    className="text-gray-500 hover:text-red-600 transition-colors duration-300"
                  >
                    <span className="sr-only">Email</span>
                    <svg
                      className="h-8 w-8"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
