import { mdiWhiteBalanceSunny } from '@mdi/js';
import { AppIcon } from '__/components/utils/AppIcon';

export const SunSVG: React.FC<React.SVGAttributes<SVGSVGElement> & { size: number }> = ({
  size = 24,
  ...props
}) => <AppIcon size={size} path={mdiWhiteBalanceSunny} {...props} />;
