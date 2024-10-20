import iconMap from "@/icons/iconMap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const Icon = async ({
  iconName,
  className,
}: {
  iconName: keyof typeof iconMap;
  className?: string;
}) => {
  const IconPromise = iconMap[iconName] || iconMap.faUser;
  const IconModule = await IconPromise();

  return <FontAwesomeIcon className={className} icon={IconModule.default} />;
};
