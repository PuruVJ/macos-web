import { AppConfig } from '__/helpers/create-app-config';
import { ExpandIcon } from './Expand.svg';
import { StretchIcon } from './Stretch.svg';

export type GreenLightProps = Pick<AppConfig, 'expandable'>;

export const GreenLightIcon = ({ expandable }: GreenLightProps) => {
  if (expandable) {
    return <ExpandIcon />;
  }

  return <StretchIcon />;
};
