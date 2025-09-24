import React from "react";
import { GoPeople } from "react-icons/go";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { PiShoppingCartLight } from "react-icons/pi";
import { FaRupeeSign } from "react-icons/fa";
import { Star } from "lucide-react";

function CoursePage({ course }) {
  return (
    <div className="bg-blue-50 p-5" style={{ fontFamily: "Inter, sans-serif" }}>
      <div className="rounded-xl pl-5">
        
        <h5 className="font-bold text-xs tracking-tight text-[#0f1e2e] pl-5">{course.level}</h5>
        <h1 className="pt-5 text-4xl font-extrabold text-[#17324e] pl-5">{course.title}</h1>
        <h3 className="pt-3 text-gray-600 font-bold pl-5">{course.subtitle}</h3>

        <div className="flex items-center gap-6 text-gray-600 tracking-tight font-medium pl-5">
          <span className="inline-block pt-5">{course.rating} ({course.ratingsCount} ratings)</span>
          <span className="flex items-center gap-2 pt-5">
            <GoPeople className="w-5 h-5" />
            {course.students} students
          </span>
        </div>

        <div className="p-5 flex">
          <span className="flex font-bold text-xl bg-green-800 text-white p-2 rounded-md">
            <FaRupeeSign className="mt-1" />{course.price}
          </span>
          <span className="text-gray-600 line-through text-xl pl-3 flex pt-2 font-bold">
            <FaRupeeSign className="mt-1" />{course.oldPrice}
          </span>
          <span className="ml-3 bg-red-600 p-2 rounded-md text-white font-bold text-xl">{course.discount}</span>
        </div>

        <h2 className="pt-5 font-bold text-2xl text-[#17324e] pl-5">About this Course</h2>
        <div className="mt-4 text-gray-700 text-base leading-relaxed pl-5">{course.about}</div>

        {course.videoUrl && (
          <div className="my-6 w-full flex justify-center">
            <iframe
              src={course.videoUrl}
              width={800}
              height={450}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="Course Video"
              style={{ borderRadius: '12px' }}
            ></iframe>
          </div>
        )}

        <div className="p-5">
          <h2 className="pt-5 font-bold text-2xl text-[#17324e]">What You'll Learn</h2>
          <div className="grid md:grid-cols-2 gap-4 mt-5">
            {course.skills.map((skill, index) => (
              <div key={index} className="flex items-center space-x-2">
                <IoMdCheckmarkCircleOutline className="text-green-500 text-xl" />
                <p className="text-gray-700">{skill}</p>
              </div>
            ))}
          </div>
        </div>

        <h2 className="pt-5 font-bold text-2xl text-[#17324e] pl-5">Requirements</h2>
        <ul className="mt-4 text-gray-700 text-base leading-relaxed pl-5 list-disc list-inside space-y-2 pb-5">
          {course.requirements.map((req, i) => (
            <li key={i}>{req}</li>
          ))}
        </ul>

        <h2 className="pt-5 pb-3 font-bold text-2xl text-[#17324e] pl-5">Student Reviews</h2>
        <div className="pl-5">
          {course.reviews.map((r, idx) => (
            <div key={idx} className="flex items-center gap-4 mb-6 bg-white rounded-lg shadow p-4">
              <img src={r.image} alt={r.name} className="w-14 h-14 rounded-full object-cover border" />
              <div>
                <h4 className="font-bold text-lg text-[#17324e]">{r.name}</h4>
                <div className="flex items-center mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400 mr-1" />
                  ))}
                </div>
                <p className="text-gray-700">{r.comment}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="p-5">
          <button className="hover:bg-blue-900 cursor-pointer w-full bg-blue-700 rounded-md text-xl font-bold text-white py-2 flex items-center justify-center gap-2">
            <PiShoppingCartLight /> Add To Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default CoursePage;
