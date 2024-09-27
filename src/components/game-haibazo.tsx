import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useEffect, useState } from 'react';

export default function GameHaiBaZo() {
  const [point, setPoint] = useState(0);
  const [time, setTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [itemPositions, setItemPositions] = useState<
    {
      left: number;
      top: number;
      index: number;
      fading: boolean;
      clicked: boolean;
    }[]
  >([]);
  const [currentItemIndex, setCurrentItemIndex] = useState(1);
  const [previousItemIndex, setPreviousItemIndex] = useState<number | null>(
    null
  );
  const [message, setMessage] = useState('');
  const [messageColor, setMessageColor] = useState('');

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isPlaying) {
      timer = setInterval(() => {
        setTime((prevTime) => prevTime + 100);
      }, 100);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying]);

  const handlePlay = () => {
    if (point > 0) {
      const newPositions = Array.from({ length: point }, (_, index) => ({
        left: Math.random() * (400 - 40),
        top: Math.random() * (400 - 40),
        index: index + 1,
        fading: false,
        clicked: false,
      }));
      setItemPositions(newPositions);
      setIsPlaying(true);
      setTime(0);
      setMessage('');
      setMessageColor('');
      setCurrentItemIndex(1);
      setPreviousItemIndex(null);
    } else {
      setMessage('Please enter a valid number of points.');
      setMessageColor('text-red-500');
    }
  };

  const handleRestart = () => {
    if (point > 0) {
      const newPositions = Array.from({ length: point }, (_, index) => ({
        left: Math.random() * (400 - 40),
        top: Math.random() * (400 - 40),
        index: index + 1,
        fading: false,
        clicked: false,
      }));
      setItemPositions(newPositions);
      setIsPlaying(true);
      setTime(0);
      setCurrentItemIndex(1);
      setPreviousItemIndex(null);
      setMessage('');
      setMessageColor('');
    }
  };

  const handleItemClick = (index: number) => {
    if (index === currentItemIndex) {
      setCurrentItemIndex((prev) => prev + 1);

      if (previousItemIndex !== null) {
        setItemPositions((prevPositions) =>
          prevPositions.map((item) =>
            item.index === previousItemIndex ? { ...item, fading: true } : item
          )
        );

        setTimeout(() => {
          setItemPositions((prevPositions) =>
            prevPositions.filter((item) => item.index !== previousItemIndex)
          );
        }, 700);
      }

      setPreviousItemIndex(index);
      setItemPositions((prevPositions) =>
        prevPositions.map((item) =>
          item.index === index ? { ...item, clicked: true } : item
        )
      );
      if (currentItemIndex === point) {
        setMessage('ALL CLEARED');
        setMessageColor('text-green-500');
        setIsPlaying(false);
      }
    } else {
      setMessage('GAME OVER');
      setMessageColor('text-red-500');
      setIsPlaying(false);
    }
  };

  const handlePointChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setPoint(Number(value));
    }
  };

  return (
    <div className='flex items-center justify-center w-full h-full mt-20'>
      <div className='max-w-5xl p-4 border'>
        <p className={`text-lg font-bold ${messageColor}`}>{message}</p>
        <h1 className='text-xl font-bold'>LET'S PLAY</h1>
        <div className='flex items-center gap-4 my-4'>
          <span>Point: </span>
          <Input type='text' value={point} onChange={handlePointChange} />
        </div>
        <div className='flex items-center gap-4 my-4'>
          <span>Time: </span>
          <p>{(time / 1000).toFixed(1)}s</p>
        </div>
        <Button onClick={isPlaying ? handleRestart : handlePlay}>
          {isPlaying ? 'Restart' : 'Play'}
        </Button>
        <div className='relative mx-auto my-4 overflow-hidden border h-96 w-96'>
          {isPlaying &&
            itemPositions.map((position) => (
              <div
                key={position.index}
                className={`border rounded-full flex justify-center items-center cursor-pointer transition-all duration-700 ${
                  position.clicked ? 'bg-red-500' : 'bg-white'
                } ${position.fading ? 'opacity-0' : ''}`}
                style={{
                  position: 'absolute',
                  left: `${position.left}px`,
                  top: `${position.top}px`,
                  height: '40px',
                  width: '40px',
                  opacity: position.fading ? 0 : 1,
                }}
                onClick={() => handleItemClick(position.index)}
              >
                {position.index}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
