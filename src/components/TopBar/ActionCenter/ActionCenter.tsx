/**
 * 
                                                                                                                                                                                                   
                                                                                                                                                                                                   
               AAA         TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTEEEEEEEEEEEEEEEEEEEEEENNNNNNNN        NNNNNNNNTTTTTTTTTTTTTTTTTTTTTTTIIIIIIIIII     OOOOOOOOO     NNNNNNNN        NNNNNNNN
              A:::A        T:::::::::::::::::::::TT:::::::::::::::::::::TE::::::::::::::::::::EN:::::::N       N::::::NT:::::::::::::::::::::TI::::::::I   OO:::::::::OO   N:::::::N       N::::::N
             A:::::A       T:::::::::::::::::::::TT:::::::::::::::::::::TE::::::::::::::::::::EN::::::::N      N::::::NT:::::::::::::::::::::TI::::::::I OO:::::::::::::OO N::::::::N      N::::::N
            A:::::::A      T:::::TT:::::::TT:::::TT:::::TT:::::::TT:::::TEE::::::EEEEEEEEE::::EN:::::::::N     N::::::NT:::::TT:::::::TT:::::TII::::::IIO:::::::OOO:::::::ON:::::::::N     N::::::N
           A:::::::::A     TTTTTT  T:::::T  TTTTTTTTTTTT  T:::::T  TTTTTT  E:::::E       EEEEEEN::::::::::N    N::::::NTTTTTT  T:::::T  TTTTTT  I::::I  O::::::O   O::::::ON::::::::::N    N::::::N
          A:::::A:::::A            T:::::T                T:::::T          E:::::E             N:::::::::::N   N::::::N        T:::::T          I::::I  O:::::O     O:::::ON:::::::::::N   N::::::N
         A:::::A A:::::A           T:::::T                T:::::T          E::::::EEEEEEEEEE   N:::::::N::::N  N::::::N        T:::::T          I::::I  O:::::O     O:::::ON:::::::N::::N  N::::::N
        A:::::A   A:::::A          T:::::T                T:::::T          E:::::::::::::::E   N::::::N N::::N N::::::N        T:::::T          I::::I  O:::::O     O:::::ON::::::N N::::N N::::::N
       A:::::A     A:::::A         T:::::T                T:::::T          E:::::::::::::::E   N::::::N  N::::N:::::::N        T:::::T          I::::I  O:::::O     O:::::ON::::::N  N::::N:::::::N
      A:::::AAAAAAAAA:::::A        T:::::T                T:::::T          E::::::EEEEEEEEEE   N::::::N   N:::::::::::N        T:::::T          I::::I  O:::::O     O:::::ON::::::N   N:::::::::::N
     A:::::::::::::::::::::A       T:::::T                T:::::T          E:::::E             N::::::N    N::::::::::N        T:::::T          I::::I  O:::::O     O:::::ON::::::N    N::::::::::N
    A:::::AAAAAAAAAAAAA:::::A      T:::::T                T:::::T          E:::::E       EEEEEEN::::::N     N:::::::::N        T:::::T          I::::I  O::::::O   O::::::ON::::::N     N:::::::::N
   A:::::A             A:::::A   TT:::::::TT            TT:::::::TT      EE::::::EEEEEEEE:::::EN::::::N      N::::::::N      TT:::::::TT      II::::::IIO:::::::OOO:::::::ON::::::N      N::::::::N
  A:::::A               A:::::A  T:::::::::T            T:::::::::T      E::::::::::::::::::::EN::::::N       N:::::::N      T:::::::::T      I::::::::I OO:::::::::::::OO N::::::N       N:::::::N
 A:::::A                 A:::::A T:::::::::T            T:::::::::T      E::::::::::::::::::::EN::::::N        N::::::N      T:::::::::T      I::::::::I   OO:::::::::OO   N::::::N        N::::::N
AAAAAAA                   AAAAAAATTTTTTTTTTT            TTTTTTTTTTT      EEEEEEEEEEEEEEEEEEEEEENNNNNNNN         NNNNNNN      TTTTTTTTTTT      IIIIIIIIII     OOOOOOOOO     NNNNNNNN         NNNNNNN
                                                                                                                                                                                                   
You might have come to this file to make the brightness slider functional. Pls do not attempt that, as webkit related bugs
ruin the whole thing, and I'd hate to reject your Pull Request. 
Thank you for your attention
*/

import { mdiBluetooth, mdiKeyboard, mdiWifiStrength4 } from '@mdi/js';
import { FC } from 'preact/compat';
import { AirDropSVG } from '__/assets/sf-icons/AirDrop.svg';
import { MoonSVG } from '__/assets/sf-icons/Moon.svg';
import { AppIcon } from '__/components/utils/AppIcon';
import { useTheme } from '__/hooks';
import css from './ActionCenter.module.scss';
import { ActionCenterShell } from './ActionCenterShell';
import { ActionCenterSurface } from './ActionCenterSurface';
import { ActionCenterTile } from './ActionCenterTile';

export const ActionCenter = () => {
  const [theme, setTheme] = useTheme();

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

  const ThemeSVGComp = MoonSVG;

  return (
    <ActionCenterShell>
      <section class={css.container}>
        {/* Main Controls: Wifi, Bluetooth, Airdrop */}
        <ActionCenterSurface
          grid={[
            [1, 6],
            [1, 4],
          ]}
        >
          {/* Wifi goes here */}
          <ActionCenterTile grid={[1, 1]}>
            <Toggle filled={!0}>
              <AppIcon path={mdiWifiStrength4} size={16} />
            </Toggle>
            Wi-Fi
          </ActionCenterTile>

          {/* Bluetooth */}
          <ActionCenterTile grid={[2, 1]}>
            <Toggle filled={!0}>
              <AppIcon path={mdiBluetooth} size={18} />
            </Toggle>
            Bluetooth
          </ActionCenterTile>

          {/* Airdrop */}
          <ActionCenterTile grid={[3, 1]}>
            <Toggle filled={!!0}>
              <AirDropSVG size={16} />
            </Toggle>
            Airdrop
          </ActionCenterTile>
        </ActionCenterSurface>

        {/* Theme Switcher */}
        <ActionCenterSurface
          grid={[
            [7, 6],
            [1, 2],
          ]}
        >
          <ActionCenterTile grid={[1, 1]}>
            <Toggle onClick={toggleTheme} filled={theme === 'dark'}>
              <ThemeSVGComp size={16} />
            </Toggle>
            Dark mode
          </ActionCenterTile>
        </ActionCenterSurface>

        {/* Keyboard Brightness */}
        <ActionCenterSurface
          grid={[
            [7, 6],
            [3, 2],
          ]}
        >
          <ActionCenterTile grid={[1, 1]}>
            <Toggle filled={!0}>
              <AppIcon path={mdiKeyboard} size={16} />
            </Toggle>
            Keyboard
          </ActionCenterTile>
        </ActionCenterSurface>
      </section>
    </ActionCenterShell>
  );
};

const Toggle: FC<{ filled: boolean } & JSX.IntrinsicElements['button']> = ({
  filled,
  children,
  ...props
}) => (
  <button
    class={css.toggle}
    style={
      {
        '--bgcolor': `var(--app-color-${filled ? 'primary' : 'dark'}-hsl)`,
        '--bgalpha': filled ? 1 : 0.1,

        '--svgcolor': `var(--app-color-${filled ? 'primary' : 'light'}-contrast-hsl)`,
        '--svgalpha': filled ? 1 : 0.9,
      } as React.CSSProperties
    }
    {...props}
  >
    {children}
  </button>
);
