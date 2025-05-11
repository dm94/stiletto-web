import type React from "react";
import { useState } from "react";
import { config } from "@config/config";

interface IconProps {
  name: string;
  width?: number;
  height?: number;
  className?: string;
  alt?: string;
  "aria-hidden"?: boolean;
}

const Icon: React.FC<IconProps> = ({
  name: initialName,
  width = 16,
  height,
  className = "mr-2",
  alt,
  "aria-hidden": ariaHidden,
}) => {
  const [loaded, setLoaded] = useState<boolean>(true);

  const getProcessedName = (name: string): string => {
    const nameMap: Record<string, string> = {
      "Tier 1": "Walker Upgrade Wood",
      "Tier 2": "Walker Upgrade Bone",
      "Tier 3": "Walker Upgrade Ceramic",
      "Tier 4": "Walker Upgrade Iron",
      "Wings Small": "Walker Wings Small",
      "Wings Medium": "Walker Wings Medium",
      "Wings Large": "Walker Wings Large",
      "Wings Skirmish": "Walker Wings Skirmish",
      "Wings Raider": "Walker Wings Raider",
      "Wings Heavy": "Walker Wings Heavy",
      "Wings Rugged": "Walker Wings Rugged",
      " Wings": "Walker Wings",
      "Legs Armored": "Walker Legs Armored",
      "Legs Heavy": "Walker Legs Heavy",
      Legs: "Walker Legs",
      "Grappling Hook": "Grappling Hook",
    };

    let processedName = name;

    for (const [key, value] of Object.entries(nameMap)) {
      if (name.includes(key)) {
        processedName = value;
        break;
      }
    }

    return processedName.replace("Body", "").toLocaleLowerCase().trim();
  };

  if (!loaded) {
    return false;
  }

  const altText = alt || initialName;

  return (
    <img
      src={`${config.RESOURCES_URL}/items/${getProcessedName(
        initialName,
      )} icon.png`}
      loading="lazy"
      width={width}
      height={height ?? width}
      className={className}
      alt={ariaHidden ? "" : altText}
      aria-hidden={ariaHidden}
      onError={() => setLoaded(false)}
    />
  );
};

export default Icon;
