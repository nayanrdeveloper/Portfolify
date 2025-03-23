"use client";

import React from "react";

/**
 * TemplateOne - A dark-themed portfolio layout with all data as constants.
 */
export default function TemplateOne() {
  // Constants for name, bio, projects, etc.
  const name = "Aditya Kumar";
  const title = "A skilled web developer, crafting cutting-edge applications...";
  const bio = "Short introduction about me. Passionate about technology.";
  const about =
    "Here you can talk about your experience, background, and goals in the world of programming and technology. Share your journey to give the audience an insight into who you are.";
  const skills = ["JavaScript", "React", "Node.js"];
  const projects = [
    {
      id: "1",
      name: "Portfolio Website",
      description: "A personal portfolio showcasing my projects and skills.",
      image: "/images/project1.png",
      link: "#",
    },
    {
      id: "2",
      name: "E-Commerce App",
      description: "A full-stack e-commerce platform using Next.js and Node.",
      image: "/images/project2.png",
      link: "#",
    },
  ];

  return (
    <div className="bg-gray-900 text-gray-100 min-h-screen flex flex-col">
      {/* Hero Section */}
      <header className="bg-gray-900 py-20 px-6 text-center">
        <h1 className="text-3xl md:text-5xl font-bold mb-4">
          HEY, I aM {name.toUpperCase()}
        </h1>
        <p className="text-xl md:text-2xl text-blue-400 font-semibold">
          {title}
        </p>
        <p className="max-w-3xl mx-auto mt-4 text-gray-300">
          A skilled web developer, crafting cutting-edge applications to advance
          the realms of programming and technology.
        </p>
        <div className="mt-8">
          <a
            href="#about"
            className="inline-block bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-full"
          >
            Learn More
          </a>
        </div>
      </header>

      {/* About Section */}
      <section id="about" className="py-16 px-6 bg-gray-800">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">About Me</h2>
          <div className="md:flex md:space-x-10">
            {/* Bio Text */}
            <div className="md:w-1/2">
              <p className="mb-4 text-gray-300">{about}</p>
              <p className="mb-4 text-gray-300">{bio}</p>
            </div>
            {/* Skills */}
            <div className="md:w-1/2 mt-6 md:mt-0">
              <h3 className="text-xl font-semibold mb-4">My Skills</h3>
              <ul className="space-y-2">
                {skills.map((skill) => (
                  <li
                    key={skill}
                    className="inline-block bg-gray-700 rounded-full px-4 py-2 mr-2 mb-2"
                  >
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-16 px-6 bg-gray-900">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-8">Projects</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {projects.map((project) => (
              <div key={project.id} className="bg-gray-800 p-4 rounded-lg">
                {/* If you have images, you can use Next.js Image */}
                {/* 
                <Image
                  src={project.image}
                  alt={project.name}
                  width={500}
                  height={300}
                  className="rounded mb-4"
                /> 
                */}
                <h3 className="text-xl font-semibold mb-2">{project.name}</h3>
                <p className="text-gray-300 mb-4">{project.description}</p>
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline"
                  >
                    View Project
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact / Form Section */}
      <section id="contact" className="py-16 px-6 bg-gray-800 flex-1">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">Contact Me</h2>
          <p className="mb-8 text-gray-300">
            Please leave a message or any query here. I will respond to your
            message promptly.
          </p>
          <form className="space-y-4 max-w-xl">
            <div>
              <label className="block text-gray-300 mb-2" htmlFor="name">
                Name
              </label>
              <input
                id="name"
                type="text"
                className="w-full px-4 py-2 rounded bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-2" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                className="w-full px-4 py-2 rounded bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-2" htmlFor="message">
                Message
              </label>
              <textarea
                id="message"
                rows={4}
                className="w-full px-4 py-2 rounded bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-full"
            >
              Submit
            </button>
          </form>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-gray-900 py-6 text-center">
        <div className="max-w-5xl mx-auto text-gray-400">
          <p className="mb-2">© 2025 {name}. All rights reserved.</p>
          <p>Follow me on social media</p>
        </div>
      </footer>
    </div>
  );
}
