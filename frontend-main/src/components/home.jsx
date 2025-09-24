import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { useAuth } from "../context/AuthContext";
import hero from "../assets/HERO.jpg";
import Footer from "./Footer";
import genai from "../assets/generativeai.png";
import cyber from "../assets/cybersecurity.png";
import cloud from "../assets/cloudcomputing.png";
import fullstack from "../assets/fullstack.png";
import bookimage from "../assets/Booksimage.jpg"
import {
  BookOpen,
  BarChart2,
  Video,
  Smartphone,
  Users,
  Award,
  Sparkles,
  Shield,
  Star,
} from "lucide-react";
import { GoArrowRight } from "react-icons/go";

export default function Home() {
  const navigate = useNavigate();
  const { token } = useAuth ? useAuth() : {};
  const features = [
    {
      icon: <BookOpen className="w-15 h-15 text-blue-600" />,
      title: "Interactive Courses",
      desc: "Learn with engaging videos, quizzes, and projects that simplify complex concepts.",
    },
    {
      icon: <BarChart2 className="w-15 h-15 text-green-600" />,
      title: "Progress Tracking",
      desc: "Stay motivated with dashboards, badges, and milestones that show your growth.",
    },
    {
      icon: <Video className="w-15 h-15 text-purple-600" />,
      title: "Live Classes & Webinars",
      desc: "Join expert-led sessions, ask questions in real-time, and watch recordings anytime.",
    },
    {
      icon: <Smartphone className="w-15 h-15 text-pink-600" />,
      title: "Mobile Learning",
      desc: "Access your courses on phone, tablet, or laptop—learn anytime, anywhere.",
    },
    {
      icon: <Users className="w-15 h-15 text-orange-600" />,
      title: "Community Support",
      desc: "Connect with peers, share ideas, and learn together in active discussion forums.",
    },
    {
      icon: <Award className="w-15 h-15 text-yellow-600" />,
      title: "Assessments & Certifications",
      desc: "Test your skills with quizzes and earn certificates that boost your career.",
    },
  ];

  const stats = [
    {
      title: "10K+",
      desc: "Active Students",
      icon: <Users className="w-15 h-15 text-blue-600" />,
    },
    {
      title: "500+",
      desc: "Courses Available",
      icon: <BookOpen className="w-15 h-15 text-green-600" />,
    },
    {
      title: "24/7",
      desc: "Support Available",
      icon: <Sparkles className="w-15 h-15 text-pink-600" />,
    },
  ];

  const steps = [
    {
      title: "Sign Up",
      desc: "Create your free account and explore our course catalog",
      icon: <Users className="w-15 h-15 text-blue-600" />,
      number: 1,
    },
    {
      title: "Learn",
      desc: "Access high-quality video lessons, assignments, and resources",
      icon: <Video className="w-15 h-15 text-blue-600" />,
      number: 2,
    },
    {
      title: "Get Certified",
      desc: "Complete courses and earn certificates to showcase your skills",
      icon: <Award className="w-15 h-15 text-blue-600" />,
      number: 3,
    },
  ];

  const slides = [
    {
      image: genai,
      text: "Master Generative AI",
      subtext: "Unleash creativity and innovation with cutting-edge Generative AI tools and techniques.",
      button: (
        <Link to="/course/gen-ai">
          <button className="bg-blue-600 text-white px-6 py-3 rounded-xl">
            Explore GenAI
          </button>
        </Link>
      ),
    },
    {
      image: cloud,
      text: "Cloud Computing Essentials",
      subtext: "Learn to design, deploy, and manage scalable applications on the cloud with real-world tools and services.",
      button: (
        <Link to="/course/cloud-computing">
          <button className="bg-purple-600 text-white px-6 py-3 rounded-xl">
            Explore Cloud
          </button>
        </Link>
      ),
    },
    {
      image: cyber,
      text: "Become a CyberSecurity Expert",
      subtext: "Protect digital assets by mastering the principles of ethical hacking, defense strategies, and security tools.",
      button: (
        <Link to="/course/cyber-security">
          <button className="bg-green-600 text-white px-6 py-3 rounded-xl">
            Explore Cybersecurity
          </button>
        </Link>
      ),
    },
    {
      image: fullstack,
      text: "Fullstack Development Bootcamp",
      subtext: "Build dynamic, end-to-end web applications by mastering both frontend and backend technologies.",
      button: (
        <Link to="/course/fullstack">
          <button className="bg-pink-600 text-white px-6 py-3 rounded-xl">
            Explore Fullstack
          </button>
        </Link>
      ),
    },
  ];

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <>
      <Navbar />
      <div className="">
        <div
          style={{
            backgroundImage: `url(${hero})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
          className="flex mt-21 justify-start relative bg-amber-50 min-h-[500px] md:min-h-[580px] bg-cover bg-center bg-no-repeat md:items-start"
        >
          {/* <div className="absolute inset-0 z-10 bg-black/50 md:bg-transparent"></div> */}
          <div className="w-140 mt-15 mx-10 ">
            <h1 className="relative z-10 mt-25 text-[20px] font-bold md:text-[50px] text-gray-900 sm:text-[40px]">
              LEARN ANYTIME,{" "}
              <span className="text-blue-700">GROW ANYWHERE</span>
            </h1>
            <p className="text-gray-600 relative x-10 md:text-xl pb-10">
              Join thousands of learner mastering new skills with our
              interactive learning platform. Start your journey today and unlock
              your potential.
            </p>

            <button
              className="bg-blue-500 text-white relative px-4 py-3 rounded-xl text-xl font-bold mt-10 hover:bg-blue-600 hover:shadow-xl hover:scale-105 transition-all ease-in-out duration-350"
              onClick={() => {
                if (token) {
                  navigate("/dashboard");
                } else {
                  navigate("/register");
                }
              }}
            >
              Get Started
            </button>
          </div>
        </div>

        <div className="text-center mb-5 bg-white/100 py-30">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Everything You Need to Succeed
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our comprehensive platform provides all the tools educators and
            students need for effective online learning
          </p>
        </div>

        <div className="Features grid grid-cols-1 md:grid-cols-3 relative z-10 bg-white p-15 w-[80%] mx-auto md:rounded-2xl md:shadow-[-1px_0px_19px_2px_rgba(0,_0,_0,_0.1)] shadow-none rounded-none">
          {stats.map((val, idx) => (
            <div
              key={idx}
              className="text-center flex flex-col items-center relative"
            >
              <div className="text-5xl font-bold text-blue-600 mb-2">
                {val.icon}
              </div>

              <div className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                {val.title}
              </div>

              <div className="text-gray-500 text-sm">{val.desc}</div>

              {/* vertical divider (only show if not last col) */}
              {idx !== stats.length - 1 && (
                <div className="hidden md:block absolute right-0 top-1/4 h-1/2 w-[2px] bg-gray-300"></div>
              )}
            </div>
          ))}
        </div>

        <div className="md:mt-[-50px] flex justify-center gap-10 bg-gray-100 w-full flex-wrap place-content-stretch items-center py-20">
          {features.map((val, idx) => (
            <div
              key={idx}
              className="w-110 bg-white h-65 shadow-[0px_0px_13px_0px_rgba(0,_0,_0,_0.1)] rounded-md text mt-10 p-5 hover:shadow-lg transition-shadow duration-300 ease-in-out"
            >
              <div className="">{val.icon}</div>
              <h1 className="text-xl font-bold mt-5">{val.title}</h1>
              <p className="mt-3">{val.desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center bg-white py-12 ">
          <div className="bg-green-200 w-[40%] text-[15px] md:w-[18%] md:text-[20px] sm:w-[30%] items-center justify-center inline-flex rounded-full px-1 py-2 text-green-800 font-semibold">
            <Award className="w-5 h-5" /> Trusted Platform
          </div>
          <h1 className="text-4xl font-semibold mt-8">
            Learn from Industry <span className="text-blue-500">Experts</span>
          </h1>
          <p className="opacity-80 mt-4 mb-5">
            Our world-class instructors come from top companies and bring
            real-world experience to every lesson
          </p>
          <button className="bg-blue-500 text-white x-10 relative px-4 py-3 rounded-xl text-xl font-bold mt-10 hover:bg-blue-600 hover:shadow-xl hover:scale-105 transition-all ease-in-out duration-350">
            Start Learning Today
          </button>
        </div>

          <h2 className="text-5xl font-bold text-center text-blue-950 pt-12">Trending Courses</h2>
          <div className="relative w-full h-[600px] overflow-hidden shadow-lg ">
        <div className="relative w-full h-[600px] overflow-hidden shadow-lg my-6">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`absolute w-full h-full transition-opacity duration-1000 ease-in-out ${
                index === current ? "opacity-100" : "opacity-0"
              }`}
            >
              <div className="absolute inset-0 bg-black/40 z-10"></div>
              <div className="relative h-full w-full">
                <img
                  src={slide.image}
                  alt={`slide-${index}`}
                  className="w-full h-full object-cover"
                  style={{
                    width: "100%",
                    height: "600px",
                  }}
                />
                <div className="absolute inset-0 z-20 flex flex-col justify-center items-start px-10">
                  <h2 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">
                    {slide.text}
                  </h2>
                  <h4 className="font-bold text-white pb-4 drop-shadow-md">{slide.subtext}</h4>
                  <div className="mb-8">{slide.button}</div>
                </div>
              </div>
            </div>
          ))}
          </div>

          {/* Dots indicator */}
          <div className="absolute bottom-5 flex justify-center w-full gap-2">
            {slides.map((_, idx) => (
              <div
                key={idx}
                className={`w-3 h-3 rounded-full cursor-pointer ${
                  idx === current ? "bg-white" : "bg-gray-400"
                }`}
                onClick={() => setCurrent(idx)}
              ></div>
            ))}
          </div>
        </div>

        <div className="my-20">
          <div className="text-center mb-16 ">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Get Started in 3 Easy Steps
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Follow our simple process to get up and running quickly with our
              platform.
            </p>
          </div>
          <div className="flex flex-col md:flex-row justify-center items-center md:items-stretch gap-6 md:gap-8 lg:gap-12 mt-12 md:mt-20 px-4">
            {steps.map((val, idx) => (
              <div
                key={idx}
                className="relative text-center w-full max-w-xs md:max-w-sm lg:w-80 flex flex-col items-center py-6 px-4 "
              >
                <div className="absolute -top-3 -right-3 bg-blue-600 text-white w-8 h-8 flex items-center justify-center rounded-full font-bold text-sm">
                  {val.number}
                </div>
                {val.icon}
                <h1 className="mb-3 md:mb-4 text-xl md:text-2xl lg:text-3xl font-bold leading-tight">
                  {val.title}
                </h1>
                <p className="text-sm md:text-base text-gray-700 leading-relaxed">
                  {val.desc}
                </p>
              </div>
            ))}
          </div>
        </div>


        <div className="w-full flex justify-center items-center py-16 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50">
          <div className="flex flex-col md:flex-row items-center gap-8 max-w-4xl w-full bg-white rounded-2xl shadow-xl p-8">
            <img src={bookimage} className="rounded-xl w-full md:w-1/2 h-64 object-cover shadow-lg" alt="Books" />
            <div className="flex-1 flex flex-col justify-center items-start">
              <div className="flex items-center mb-4">
                <BookOpen className="w-10 h-10 text-blue-600 mr-3" />
                <h2 className="text-3xl font-bold text-blue-700">Search Books</h2>
              </div>
              <h3 className="text-lg text-gray-700 mb-4 font-medium">Quickly search, discover, and explore a wide range of books and authors to enhance your learning journey.</h3>
              <Link to="/books">
                <button className="cursor-pointer bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 px-8 font-bold rounded-xl text-lg shadow hover:scale-105 hover:bg-blue-600 transition-all duration-200">
                  Search Books
                </button>
              </Link>
            </div>
          </div>
        </div>

        <div className=" mx-auto text-center py-20 bg-blue-50 text-white">
          <h1 className="text-[45px] text-blue-500 font-bold">
            Ready to Transform Your Future?
          </h1>
          <p className="text-lg text-gray-700 mb-6 mx-auto w-[50%] py-5">
            Join over 50,000 students who are already building the skills they
            need to succeed in tomorrow's economy
          </p>
          <Link to="/register">
            <button className="bg-blue-600 text-white px-6 py-3 rounded-xl text-xl font-semibold shadow-lg hover:bg-blue-700 hover:scale-105 transition mt-5">
              Start Learning Now <GoArrowRight className="inline-block ml-2" />
            </button>
          </Link>
          <Link to="/about">
            <button className="ml-5 bg-white text-blue-600 px-6 py-3 rounded-xl text-xl font-semibold shadow-lg hover:bg-gray-100 hover:scale-105 transition">
              Browse Courses
            </button>
          </Link>
        </div>

        <Footer />
      </div>
    </>
  );
}
