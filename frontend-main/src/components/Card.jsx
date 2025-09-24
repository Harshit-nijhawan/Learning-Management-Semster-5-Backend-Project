import React from "react";
import { useState } from "react";
import { HeartIcon, StarIcon } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getToken } from "../utils/cookieUtils";

const Card = ({ title, author, rating, img, hours, category, courseId }) => {
  const [mouseOver, setMouseOver] = useState(false);
  const [inCart, setInCart] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleCartToggle = async () => {
    if (!user) {
      alert("Please login to manage cart");
      return;
    }

    if (loading) return;
    setLoading(true);

    try {
      const token = getToken();

      if (inCart) {
        // Remove from cart
        const response = await fetch(
          `http://localhost:3001/api/protected/cart/${courseId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          setInCart(false);
          alert("Course removed from cart");
        } else {
          alert("Failed to remove course from cart");
        }
      } else {
        // Add to cart
        const response = await fetch(
          "http://localhost:3001/api/protected/cart",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ courseId }),
          }
        );

        if (response.ok) {
          setInCart(true);
          alert("Course added to cart");
        } else {
          const errorData = await response.json();
          alert(errorData.message || "Failed to add course to cart");
        }
      }
    } catch (error) {
      console.error("Error managing cart:", error);
      alert("Error managing cart");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex flex-col justify-between p-3 bg-white shadow-md rounded-md hover:-translate-y-1 duration-300 w-full gap-2 hover:cursor-pointer text-black"
      onMouseEnter={() => setMouseOver(true)}
      onMouseLeave={() => setMouseOver(false)}
    >
      <div className="relative overflow-hidden rounded-sm">
        <img src={img} alt="" className=" h-52 w-full object-cover" />
        <span
          className={`absolute bg-white p-2 rounded-full top-1 right-1 ${
            mouseOver ? "flex" : "hidden"
          } items-center justify-center inset-shadow-sm inset-shadow-red-700`}
        >
          <HeartIcon
            width={18}
            height={18}
            className=" text-black"
            fill="red"
          />
        </span>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <span className="py-1 px-2 text-xs bg-white/30 rounded-full text-black border-1 border-black">
            {category}
          </span>
          <div className="flex items-center gap-1">
            <StarIcon fill="yellow" className="outline-none" width={17} />
            <span className="text-sm">{rating}</span>
          </div>
        </div>
        <p className="font-bold">{title}</p>
        <div className="flex gap-2 items-center justify-between">
          <span>{author}</span>
          <span>{hours} hrs</span>
        </div>
        <div>
          <button
            className={`bg-blue-500 text-white py-1 px-2 rounded-sm text-sm hover:cursor-pointer ${
              loading ? "opacity-50" : ""
            }`}
            onClick={handleCartToggle}
            disabled={loading}
          >
            {loading
              ? "Loading..."
              : inCart
              ? "Remove from cart"
              : "Add to cart"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Card;
