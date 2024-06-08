import React, { useEffect, useRef, useState } from 'react';
import { FaPlus } from "react-icons/fa"; // example - use react-icons/fa for icons

const Index = () => {
  const canvasRef = useRef(null);
  const [player, setPlayer] = useState({ x: 50, y: 50 });
  const [words, setWords] = useState([{ x: 200, y: 200, word: 'hello' }]);
  const [currentWord, setCurrentWord] = useState('');
  const [typedWord, setTypedWord] = useState('');
  const [score, setScore] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    const handleKeyDown = (e) => {
      const { key } = e;
      setPlayer((prev) => {
        let newX = prev.x;
        let newY = prev.y;
        if (key === 'w') newY -= 10;
        if (key === 'a') newX -= 10;
        if (key === 's') newY += 10;
        if (key === 'd') newX += 10;
        return { x: newX, y: newY };
      });
    };

    const checkWordEncounter = () => {
      words.forEach((wordObj, index) => {
        if (
          player.x < wordObj.x + 50 &&
          player.x + 50 > wordObj.x &&
          player.y < wordObj.y + 50 &&
          player.y + 50 > wordObj.y
        ) {
          setCurrentWord(wordObj.word);
          setWords((prev) => prev.filter((_, i) => i !== index));
        }
      });
    };

    const draw = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.fillStyle = 'blue';
      context.fillRect(player.x, player.y, 50, 50);

      context.fillStyle = 'black';
      words.forEach((wordObj) => {
        context.fillText(wordObj.word, wordObj.x, wordObj.y);
      });

      checkWordEncounter();
    };

    const gameLoop = () => {
      draw();
      requestAnimationFrame(gameLoop);
    };

    window.addEventListener('keydown', handleKeyDown);
    gameLoop();

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [player, words]);

  const handleInputChange = (e) => {
    const { value } = e.target;
    setTypedWord(value);
    if (value === currentWord) {
      setScore((prev) => prev + 10);
      setCurrentWord('');
      setTypedWord('');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-3xl font-bold underline mb-4">Side-Scrolling Word Game</h1>
      <canvas ref={canvasRef} width={800} height={600} className="border border-black mb-4"></canvas>
      {currentWord && (
        <div className="mb-4">
          <p className="text-xl">Type the word: {currentWord}</p>
          <input
            type="text"
            value={typedWord}
            onChange={handleInputChange}
            className="border border-gray-400 p-2"
          />
        </div>
      )}
      <div className="absolute top-4 right-4 text-xl">Score: {score}</div>
    </div>
  );
};

export default Index;