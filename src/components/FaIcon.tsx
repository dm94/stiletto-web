import type React from "react";
import {
  FaTools,
  FaShareAlt,
  FaCopy,
  FaPlus,
  FaPlay,
  FaStop,
  FaUserCog,
  FaCrown,
  FaUsersCog,
  FaVolumeUp,
  FaVolumeMute,
  FaMinus,
  FaChevronUp,
  FaChevronDown,
  FaTrash,
  FaUsers,
  FaCheck,
  FaTimes,
  FaSave,
  FaTrashAlt,
  FaEye,
  FaEyeSlash,
  FaClock,
  FaCircleNotch,
  FaBars,
  FaSearch,
  FaList,
} from "react-icons/fa";
import { FaDiscord } from "react-icons/fa6";
import {
  FaFlag,
  FaUser,
  FaArrowAltCircleUp,
  FaArrowAltCircleDown,
} from "react-icons/fa";

interface FaIconProps {
  icon: string;
  className?: string;
  size?: number;
  title?: string;
}

/**
 * Componente que reemplaza los iconos de FontAwesome con React Icons
 */
const FaIcon: React.FC<FaIconProps> = ({
  icon,
  className = "",
  size = 16,
  title,
}) => {
  // Mapeo de iconos de FontAwesome a componentes de React Icons
  const iconMap: Record<string, React.ComponentType<any>> = {
    "fas fa-tools": FaTools,
    "fas fa-share-alt": FaShareAlt,
    "fas fa-copy": FaCopy,
    "fas fa-plus": FaPlus,
    "fab fa-discord": FaDiscord,
    "fas fa-play": FaPlay,
    "fas fa-stop": FaStop,
    "fas fa-user-cog": FaUserCog,
    "fas fa-crown": FaCrown,
    "fas fa-users-cog": FaUsersCog,
    "fas fa-volume-up": FaVolumeUp,
    "fas fa-volume-mute": FaVolumeMute,
    "fas fa-minus": FaMinus,
    "fas fa-chevron-up": FaChevronUp,
    "fas fa-chevron-down": FaChevronDown,
    "fas fa-trash": FaTrash,
    "fas fa-users": FaUsers,
    "far fa-flag": FaFlag,
    "far fa-user": FaUser,
    "fas fa-check": FaCheck,
    "fas fa-times": FaTimes,
    "fas fa-save": FaSave,
    "fas fa-trash-alt": FaTrashAlt,
    "fas fa-eye": FaEye,
    "fas fa-eye-slash": FaEyeSlash,
    "fa fa-clock": FaClock,
    "fas fa-circle-notch": FaCircleNotch,
    "fas fa-bars": FaBars,
    "fa fa-search": FaSearch,
    "far fa-arrow-alt-circle-up": FaArrowAltCircleUp,
    "far fa-arrow-alt-circle-down": FaArrowAltCircleDown,
    "fas fa-list": FaList,
  };

  const IconComponent = iconMap[icon];

  if (!IconComponent) {
    console.warn(`No se encontró el icono: ${icon}`);
    return null;
  }

  return (
    <IconComponent
      className={className}
      size={size}
      title={title}
      aria-hidden={!title}
    />
  );
};

export default FaIcon;
