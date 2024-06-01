import React, { useState, useEffect } from "react";

function DataCard({ title, icon: Icon, data, color }) {
  const [displayedData, setDisplayedData] = useState(0);
  const lighterColor = `${color}60`;

  useEffect(() => {
    let start = 0;
    const duration = 2000; // duration of the animation in ms
    const increment = data / (duration / 16);

    const animate = () => {
      start += increment;
      if (start < data) {
        setDisplayedData(Math.ceil(start));
        requestAnimationFrame(animate);
      } else {
        setDisplayedData(data);
      }
    };

    animate();
  }, [data]);

  return (
    <div className="bg-white dark:bg-zinc-950 p-4 grid grid-cols-2 rounded-lg">
      <p className="text-zinc-600 dark:text-zinc-300 capitalize font-medium">
        {title}
      </p>
      <div
        style={{ backgroundColor: lighterColor }}
        className="flex items-center justify-center p-2 w-fit rounded-2xl justify-self-end"
      >
        <Icon style={{ color: color }} className="w-8 h-8" />
      </div>
      <p className="text-zinc-950 dark:text-zinc-200 capitalize font-bold text-4xl">
        {title !== "Total Savings Plans" && "$"}{displayedData}
      </p>
    </div>
  );
}

export default DataCard;
