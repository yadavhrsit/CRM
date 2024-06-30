import { useState, useEffect } from "react";
import {View,Text} from "react-native";
function DataCard({ title, value }) {
  const [displayedData, setDisplayedData] = useState(0);
 

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
    <View className="basis-1/4 grow mx-2 h-full bg-white dark:bg-zinc-950 p-4 rounded-lg shadow-xl">
      <View className="flex w-100 grow">
        <Text className="text-zinc-600 dark:text-zinc-300 capitalize font-semibold text-sm md:text-base">
          {title}
        </Text>
      </View>
      <Text className="text-zinc-950 dark:text-zinc-200 capitalize font-bold text-2xl md:text-4xl">
        {displayedData}
      </Text>
    </View>
  );
}

export default DataCard;
