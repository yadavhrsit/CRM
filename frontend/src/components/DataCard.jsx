import { useState, useEffect } from "react";

function DataCard({ title, icon: Icon, value, color }) {
  const [displayedData, setDisplayedData] = useState(0);
  const lighterColor = `${color}60`;

  useEffect(() => {
    let start = 0;
    const duration = 2000;
    const increment = value / (duration / 16);

    const animate = () => {
      start += increment;
      if (start < value) {
        setDisplayedData(Math.ceil(start));
        requestAnimationFrame(animate);
      } else {
        setDisplayedData(value);
      }
    };

    animate();
  }, [value]);

  return (
    <div className="bg-white dark:bg-zinc-950 p-4 rounded-lg shadow-xl">
      <div className="flex w-100 justify-between items-start">
        <p className="text-zinc-600 dark:text-zinc-300 capitalize font-bold text-sm md:text-base">
          {title}
        </p>
        <div
          style={{ backgroundColor: lighterColor }}
          className="flex items-center justify-center p-2 w-fit rounded-full justify-self-end"
        >
          <Icon style={{ color: color }} className="w-4 h-4 md:w-10 md:h-10" />
        </div>
      </div>
      <p className="text-zinc-950 dark:text-zinc-200 capitalize font-bold text-2xl md:text-4xl">
        {displayedData}
      </p>
    </div>
  );
}

export default DataCard;
