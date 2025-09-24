import React from "react";
import { Star } from "lucide-react";
import Navbar from "./Navbar";

function App() {
  const data = [
    {
      image: "https://images.unsplash.com/photo-1697577418970-95d99b5a55cf?w=500&auto=format&fit=crop&q=60",
      name: "Generative AI",
      description: "Learn to build AI-powered apps and workflows using AI's like ChatGPT and large language models.",
      rating: "5.0",
    },
    {
      image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fG1hY2hpbmUlMjBsZWFybmluZ3xlbnwwfHwwfHx8MA%3D%3D",
      name: "Machine Learning",
      description: "Master supervised, unsupervised, and neural network techniques for predictive modeling.",
      rating: "4.9",
    },
    {
      image: "https://images.unsplash.com/photo-1620825937374-87fc7d6bddc2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8Y3liZXIlMjBzZWN1cml0eXxlbnwwfHwwfHx8MA%3D%3D",
      name: "Cybersecurity & Ethical Hacking",
      description: "Gain skills to secure systems, networks, and applications against modern cyber threats.",
      rating: "4.8",
    },
    {
      image: "https://images.unsplash.com/photo-1667984390533-64bdefe719ea?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8Y2xvdWQlMjBjb21wdXRpbmd8ZW58MHx8MHx8fDA%3D",
      name: "Cloud Computing (AWS, Azure, GCP)",
      description: "Understand cloud infrastructure, deployment, and DevOps practices for scalable applications.",
      rating: "4.8",
    },
    {
      image: "https://images.unsplash.com/photo-1599658880436-c61792e70672?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8ZGF0YSUyMHNjaWVuY2V8ZW58MHx8MHx8fDA%3D",
      name: "Data Science & Analytics",
      description: "Learn data wrangling, visualization, and statistical modeling for decision-making.",
      rating: "4.7",
    },
    {
      image: "https://images.unsplash.com/photo-1617839625591-e5a789593135?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cXVhbnR1bSUyMGNvbXB1dGluZ3xlbnwwfHwwfHx8MA%3D%3D",
      name: "Quantum Computing Basics",
      description: "Explore quantum principles and programming with frameworks like Qiskit and Cirq.",
      rating: "4.6",
    },
    {
      image: "https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGRldmVsb3BtZW50fGVufDB8fDB8fHww",
      name: "Full-Stack Web Development",
      description: "Build dynamic websites and apps using React, Node.js, Express, and databases.",
      rating: "4.9",
    },
    {
      image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmxvY2slMjBjaGFpbnxlbnwwfHwwfHx8MA%3D%3D",
      name: "Blockchain & Web3 Development",
      description: "Develop decentralized apps (dApps) and smart contracts on Ethereum/Solana.",
      rating: "4.5",
    },
    {
      image: "https://images.unsplash.com/photo-1695902173528-0b15104c4554?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8QXJ0aWZpY2lhbCUyMEludGVsbGlnZW5jZSUyMGluJTIwQ29tcHV0ZXIlMjBWaXNpb258ZW58MHx8MHx8fDA%3D",
      name: "Artificial Intelligence in Computer Vision",
      description: "Apply AI to image recognition, object detection, and real-world visual data.",
      rating: "4.8",
    },
    {
      image: "https://images.unsplash.com/photo-1669023414162-5bb06bbff0ec?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8UHJvZ3JhbW1pbmclMjBGb3VuZGF0aW9ucyUyMChEU0ElMjAlMjYlMjBPT1ApfGVufDB8fDB8fHww",
      name: "Programming Foundations (DSA & OOP)",
      description: "Strengthen problem-solving with data structures, algorithms, and core programming concepts.",
      rating: "5.0",
    },
  ];

  return (
    <>
      <Navbar />
      <div className="bg-zinc-100 min-h-screen">
        <div className="mt-20 text-4xl p-8 font-bold">
          Trending Courses
          <p className="font-medium text-xl mt-3 text-gray-500">
            Level Up with Today’s Hottest Skills
          </p>
        </div>

        <div className="w-full flex flex-wrap gap-10 justify-center items-center p-7">
          {data.map((item, index) => (
            <div
              key={index}
              className="w-80 h-[450px] bg-white rounded-md flex flex-col shadow-md"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-48 object-cover rounded-t-md"
              />
              <h3 className="font-bold p-2 text-xl">{item.name}</h3>
              <p className="pl-2 text-gray-600 tracking-tight font-medium">
                {item.description}
              </p>
              <div className="pr-6 pb-4 mt-auto flex justify-end gap-1">
                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                <span className="font-semibold">{item.rating}</span>
              </div>
              <button className="bg-blue-700 text-white px-5 py-2 m-4 rounded-md w-[90%] hover:bg-blue-800 transition">
                Explore Course
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default App;
