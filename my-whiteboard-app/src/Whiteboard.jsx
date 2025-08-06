import React, { useRef, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const Whiteboard = () => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const contextRef = useRef(null);
  const [color, setColor] = useState('black');
  const [lineWidth, setLineWidth] = useState(5);
  const socketRef = useRef(null);
  const prevCoordsRef = useRef({ x: 0, y: 0 }); // New: Ref to store previous coordinates

  const presetColors = ['#000000', '#FF0000', '#008000', '#0000FF', '#FFFF00', '#FFFFFF'];

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth * 2;
    canvas.height = window.innerHeight * 2;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;

    const context = canvas.getContext("2d");
    context.scale(2, 2);
    context.lineCap = "round";
    context.strokeStyle = color;
    context.lineWidth = lineWidth;
    contextRef.current = context;

    socketRef.current = io('https://shan-whiteboard-backend.onrender.com/'); // REPLACE with your backend ngrok URL

    socketRef.current.on('drawing', (data) => {
      const { offsetX, offsetY, prevX, prevY, color, lineWidth } = data;
      const remoteContext = contextRef.current;
      remoteContext.strokeStyle = color;
      remoteContext.lineWidth = lineWidth;
      remoteContext.beginPath();
      remoteContext.moveTo(prevX, prevY);
      remoteContext.lineTo(offsetX, offsetY);
      remoteContext.stroke();
      remoteContext.closePath();
    });

    return () => {
      socketRef.current.disconnect();
    };

  }, [color, lineWidth]);

  const startDrawing = ({ nativeEvent }) => {
    let currentX, currentY;
    if (nativeEvent.touches) {
      currentX = nativeEvent.touches[0].clientX - nativeEvent.target.getBoundingClientRect().left;
      currentY = nativeEvent.touches[0].clientY - nativeEvent.target.getBoundingClientRect().top;
    } else {
      currentX = nativeEvent.offsetX;
      currentY = nativeEvent.offsetY;
    }

    contextRef.current.beginPath();
    contextRef.current.moveTo(currentX, currentY);
    setIsDrawing(true);
    // New: Store the initial coordinates
    prevCoordsRef.current = { x: currentX, y: currentY };
  };

  const draw = ({ nativeEvent }) => {
    if (!isDrawing) {
      return;
    }
    let currentX, currentY;
    if (nativeEvent.touches) {
      currentX = nativeEvent.touches[0].clientX - nativeEvent.target.getBoundingClientRect().left;
      currentY = nativeEvent.touches[0].clientY - nativeEvent.target.getBoundingClientRect().top;
    } else {
      currentX = nativeEvent.offsetX;
      currentY = nativeEvent.offsetY;
    }

    // Draw on our own canvas
    contextRef.current.lineTo(currentX, currentY);
    contextRef.current.stroke();

    // New: Emit data using stored previous coordinates
    if (socketRef.current) {
        socketRef.current.emit('drawing', {
            offsetX: currentX,
            offsetY: currentY,
            prevX: prevCoordsRef.current.x,
            prevY: prevCoordsRef.current.y,
            color,
            lineWidth,
        });
    }

    // New: Update previous coordinates for the next drawing segment
    prevCoordsRef.current = { x: currentX, y: currentY };
  };

  const endDrawing = () => {
    contextRef.current.closePath();
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    if (socketRef.current) {
        socketRef.current.emit('clearCanvas');
    }
  };

  return (
    <div className="relative">
      <div className="fixed top-0 left-0 w-full bg-gray-800 text-white shadow-lg p-4 flex justify-center items-center space-x-4 z-10">
        {presetColors.map((c) => (
            <div
                key={c}
                onClick={() => setColor(c)}
                className={`w-8 h-8 rounded-full cursor-pointer border-2 ${color === c ? 'border-white' : 'border-transparent'}`}
                style={{ backgroundColor: c }}
            />
        ))}

        <div className="w-px h-8 bg-gray-500 mx-2" />

        <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-8 h-8 border-none bg-transparent cursor-pointer rounded-full overflow-hidden"
        />

        <div className="w-px h-8 bg-gray-500 mx-2" />

        <div className="flex flex-col items-center justify-center">
            <span className="text-xs mb-1">Size</span>
            <div 
                className="rounded-full bg-white"
                style={{ width: `${lineWidth}px`, height: `${lineWidth}px` }}
            />
        </div>
        
        <input
            type="range"
            min="1"
            max="20"
            value={lineWidth}
            onChange={(e) => setLineWidth(e.target.value)}
            className="w-28"
        />
        
        <div className="w-px h-8 bg-gray-500 mx-2" />

        <button
            onClick={clearCanvas}
            className="px-4 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition-colors"
        >
            Clear
        </button>
      </div>

      <canvas
        onMouseDown={startDrawing}
        onMouseUp={endDrawing}
        onMouseMove={draw}
        onTouchStart={startDrawing}
        onTouchEnd={endDrawing}
        onTouchMove={draw}
        ref={canvasRef}
        className="w-full h-screen bg-gray-100 cursor-crosshair shadow-inner"
      />
    </div>
  );
};

export default Whiteboard;