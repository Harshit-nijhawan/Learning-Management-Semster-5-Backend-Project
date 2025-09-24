import per1 from "../assets/person1.jpeg";
import per2 from "../assets/person2.jpeg";

const coursesData = [
  {
    id: "gen-ai",
    level: "Beginner to Advanced",
    title: "Your Complete Guide to Generative AI",
    subtitle: "Zero to Generative AI Pro – Learn, Build, Innovate",
    rating: 4.8,
    ratingsCount: "12,847",
    students: "45,623",
    price: 2999,
    oldPrice: 6000,
    discount: "50% OFF",
    videoUrl: "https://www.youtube.com/embed/NRmAXDWJVnU",
    about: `Learn the fundamentals of Generative AI and how to build your own AI-powered applications. 
            Gain hands-on experience with GPT, and other cutting-edge tools in this practical bootcamp.`,
    skills: [
      "Build modern React applications from scratch",
      "Master React hooks and state management",
      "Implement responsive and accessible user interfaces",
      "Deploy React applications to production",
      "Work with APIs and handle asynchronous data",
      "Apply industry best practices and patterns",
    ],
    requirements: [
      "Basic programming experience (Python recommended).",
      "A computer with internet access.",
      "No prior Generative AI experience required.",
    ],
    reviews: [
      { image: per1, name: "Akshit", comment: "Excellent course! Sarah explains everything clearly and the projects are really practical." },
      { image: per2, name: "Priya", comment: "Loved the hands-on approach and the real-world examples. Highly recommend!" },
      { image: per2, name: "Rahul", comment: "The best Generative AI course for beginners and pros alike." }
    ]
  },

  {
    id: "fullstack",
    level: "Beginner to Advanced",
    title: "Fullstack Development Bootcamp",
    subtitle: "Frontend, Backend, DevOps – Become a Fullstack Pro",
    rating: 4.9,
    ratingsCount: "9,200",
    students: "38,000",
    price: 3499,
    oldPrice: 7000,
    discount: "50% OFF",
    videoUrl: "https://www.youtube.com/embed/wS974JC_CoE",
    about: `Master both frontend and backend development with hands-on projects in React, Node.js, databases, and deployment. Build real-world applications and become a versatile fullstack developer.`,
    skills: [
      "Modern JavaScript (ES6+)",
      "React for frontend development",
      "Node.js and Express for backend",
      "MongoDB and SQL databases",
      "REST APIs and authentication",
      "Deployment and DevOps basics"
    ],
    requirements: [
      "Basic programming experience.",
      "A computer with internet access.",
      "No prior fullstack experience required."
    ],
    reviews: [
      { image: per1, name: "Riya", comment: "Comprehensive and practical! Learned everything I needed for fullstack jobs." },
      { image: per2, name: "Aman", comment: "Projects are real-world and the explanations are clear. Highly recommend!" }
    ]
  },

  {
    id: "cloud-computing",
    level: "Beginner to Advanced",
    title: "Cloud Computing Masterclass",
    subtitle: "Learn AWS, Azure, and Google Cloud",
    rating: 4.7,
    ratingsCount: "9,230",
    students: "38,400",
    price: 3499,
    oldPrice: 7000,
    discount: "50% OFF",
  videoUrl: "https://www.youtube.com/embed/M988_fsOSWo",
    about: `Master cloud platforms including AWS, Azure, and Google Cloud. Learn cloud architecture, services, 
            and how to deploy scalable applications in the cloud.`,
    skills: [
      "Cloud fundamentals and service models (IaaS, PaaS, SaaS)",
      "Deploy applications on AWS, Azure & GCP",
      "Cloud storage and databases",
      "Security best practices in cloud computing",
      "CI/CD pipelines in the cloud",
      "Serverless computing & microservices",
    ],
    requirements: [
      "Basic IT knowledge.",
      "A computer with internet access.",
      "No prior cloud experience required.",
    ],
    reviews: [
      { image: per1, name: "Meena", comment: "Covers AWS, Azure, and GCP in detail – excellent for certifications." },
      { image: per2, name: "Rohit", comment: "Hands-on labs are very useful and practical." },
    ],
  },

  {
    id: "cyber-security",
    level: "Beginner to Professional",
    title: "Cyber Security Bootcamp",
    subtitle: "Learn to protect systems from attacks",
    rating: 4.6,
    ratingsCount: "7,800",
    students: "28,900",
    price: 2999,
    oldPrice: 6500,
    discount: "55% OFF",
    videoUrl: "https://www.youtube.com/embed/inWWhr5tnEA",
    about: `Learn ethical hacking, penetration testing, and cyber defense strategies. 
            Protect systems, networks, and applications from real-world cyber threats.`,
    skills: [
      "Introduction to Cyber Security & Networking",
      "Ethical hacking fundamentals",
      "Penetration testing techniques",
      "Malware analysis & prevention",
      "Firewalls, VPNs, IDS/IPS",
      "Incident response & forensics",
    ],
    requirements: [
      "Basic knowledge of computers and networking.",
      "Willingness to practice hands-on labs.",
    ],
    reviews: [
      { image: per2, name: "Ankit", comment: "Helped me crack my CEH certification prep. Very practical." },
      { image: per1, name: "Sonia", comment: "Clear explanations and very good real-world examples." },
    ],
  },
  
];

export default coursesData;
