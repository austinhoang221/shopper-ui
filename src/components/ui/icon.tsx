import iconMap from "@/icons/iconMap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const Icon = async ({
  iconName,
}: {
  iconName: keyof typeof iconMap;
}) => {
  const IconPromise = iconMap[iconName] || iconMap.faUser;
  const IconModule = await IconPromise();

  return <FontAwesomeIcon icon={IconModule.default} />;
};
