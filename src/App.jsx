import React from "react";
const { useState, useEffect, useRef } = React;

const CONFIG = {
  name: "My Love",
  age: 26,
  pin: "0610",
  hint: "Her birthday: 6th October → 0610",
  birthday: { month: 9, day: 6 },
  puzzleImage: "https://placehold.co/360x360/ff6b9d/ffffff?text=Her+Photo",
  memories: [
    { src: "https://placehold.co/500x350/ff8fab/ffffff?text=Photo+1" },
    { src: "https://placehold.co/500x350/ffb3c6/ffffff?text=Photo+2" },
    { src: "https://placehold.co/500x350/ff6b9d/ffffff?text=Photo+3" },
    { src: "https://placehold.co/500x350/ffc2d1/ffffff?text=Photo+4" },
  ],
  wishes: [
    "May God bless you with endless joy 🙉",
    "Wishing you health, peace and success ✨",
    "May all your dreams come true 🌟",
    "May every day bring you a new smile 😊",
    "Happy Birthday — have a blessed year 🎉",
  ],
  letter: [
    "Dear Birthday Girl,",
    "",
    "On this special day, I wish you all the happiness",
    "the world has to offer.",
    "",
    "May God shower you with good health,",
    "peace of mind and endless blessings.",
    "",
    "May every candle you blow bring a wish come true,",
    "and may this year be your brightest one yet.",
    "",
    "Happy 26th Birthday! 🎂🏐�✨",
    "",
    "— With warmest wishes.",
  ],
};

export default function App() {
  return (
    <div className="w-full min-h-screen flex items-center justify-center text-white bg-black">
      <div className="text-center p-8">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-pink-300 to-rose-500 text-transparent bg-clip-text mb-4">
          Birthday Surprise 🎁
        </h1>
        <p className="text-pink-200/80 mb-6">Paste the full App code from the Playground here to enable all interactive scenes.</p>
        <p className="text-sm text-pink-300/60">PIN: {CONFIG.pin} ⃐ Birthday: 6 Oct</p>
      </div>
    </div>
  );
}
