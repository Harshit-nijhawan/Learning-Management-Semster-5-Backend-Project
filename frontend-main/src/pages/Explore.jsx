import React from "react";
import { Search, Star, ArrowRight, Clock } from "lucide-react";
import Card from "../components/Card";
import Navbar from "../components/Navbar";
const Explore = () => {
  const COURSES = [
    {
      id: 1,
      title: "Heurify: Coramral & Learning Ludint Forever!",
      author: "Laurencia Delarosa",
      rating: 4.8,
      ratingCount: 1240,
      level: "Beginner",
      hours: 12,
      category: "Design",
      img: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1600&auto=format&fit=crop",
    },
    {
      id: 2,
      title: "Howleoromin Trascultation: Dowenpling Rangeorrais!",
      author: "Ryuki Takara",
      rating: 4.7,
      ratingCount: 980,
      level: "Intermediate",
      hours: 9,
      category: "Development",
      img: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1600&auto=format&fit=crop",
    },
    {
      id: 3,
      title: "Martch Coursers: White Learning Surney Couses",
      author: "Rafaela Tevos",
      rating: 4.9,
      ratingCount: 2011,
      level: "All Levels",
      hours: 16,
      category: "Marketing",
      img: "https://images.unsplash.com/photo-1544006659-f0b21884ce1d?q=80&w=1600&auto=format&fit=crop",
    },
    {
      id: 4,
      title: "Data Drift & Insight Surfing",
      author: "Imani Howell",
      rating: 4.6,
      ratingCount: 612,
      level: "Intermediate",
      hours: 10,
      category: "Data Science",
      img: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=1600&auto=format&fit=crop",
    },
    {
      id: 5,
      title: "Foundations of Modern UI",
      author: "Jasper Nolan",
      rating: 4.5,
      ratingCount: 420,
      level: "Beginner",
      hours: 6,
      category: "Design",
      img: "https://images.unsplash.com/photo-1529336953121-ad716dc7d5f0?q=80&w=1600&auto=format&fit=crop",
    },
    {
      id: 6,
      title: "Serverless with a Smile",
      author: "Mina Correa",
      rating: 4.2,
      ratingCount: 1108,
      level: "Advanced",
      hours: 14,
      category: "Development",
      img: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1600&auto=format&fit=crop",
    },
  ];

  return (
    <div>
      <Navbar />
      <section className="">
        <div className="px-24 py-10 flex flex-col items-center h-full justify-center gap-5 max-sm:px-2 max-md:px-10">
          <h1 className="text-5xl font-semibold text-[#000000] font-secondary] text-center">
            Explore Courses
          </h1>
          <p className="text-center">
            Empower your growth through engaging, real-world learning
            experiences.
          </p>
          <div className="relative inline-block w-[60vw] max-md:w-full">
            <input
              type="search"
              name="search"
              placeholder="Search Courses"
              className="border-1 border-black py-3 pl-5 pr-35 rounded-full w-full"
            />
            <button className="absolute right-1 px-10 py-2 bg-[hsla(220,97%,58%,1)] text-white rounded-full top-[9%] cursor-pointer">
              Search
            </button>
          </div>
        </div>
      </section>
      <section className="flex justify-between md:px-10 px-2 max-sm:flex-col max-md:gap-2">
        <div>
          <ul className="flex gap-1">
            <li className="px-1 md:px-2 md:py-1 border-1 border-black cursor-pointer max-md:text-sm">
              Web Development
            </li>
            <li className="px-1 md:px-2 md:py-1 border-1 border-black cursor-pointer max-md:text-sm">
              Science
            </li>
            <li className="px-1 md:px-2 md:py-1 border-1 border-black cursor-pointer max-md:text-sm">
              Tech
            </li>
            <li className="px-1 md:px-2 md:py-1 border-1 border-black cursor-pointer max-md:text-sm">
              Marketing
            </li>
          </ul>
        </div>
        <div>
          <select name="filters" id="filters">
            <option value="newest">Newest</option>
            <option value="mostrated">Most rated</option>
            <option value="mostrelevant">Most Relevant</option>
            <option value="mostrelevant">By price:asc</option>
            <option value="mostrelevant">By price:desc</option>
          </select>
        </div>
      </section>

      <main className="px-1 md:px-4 lg:px-8 h-full mt-10">
        <section className="sm:grid lg:grid-cols-4 gap-4 sm:grid-cols-2 md:grid-cols-3 flex flex-wrap justify-center">
          {COURSES.map((course) => (
            <Card
              title={course.title}
              author={course.author}
              rating={course.rating}
              level={course.level}
              img={course.img}
              hours={course.hours}
              category={course.category}
              key={course.id}
            />
          ))}
        </section>
      </main>
    </div>
  );
};

export default Explore;
