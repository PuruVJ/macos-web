import clsx from 'clsx';
import { motion } from 'framer-motion';
import type { AppID } from '__/stores/apps.store';
import css from './Placeholder.module.scss';

type PlaceholderAppTypes = {
  appID: AppID;
};

const PlaceholderApp = ({ appID }: PlaceholderAppTypes) => {
  return (
    <section class={clsx(css.container)}>
      <header class={clsx('app-window-drag-handle', css.titleBar)}></header>
      <section class={css.mainArea}>
        <motion.img
          class={css.img}
          initial={{ scale: 0, rotate: 180 }}
          animate={{ rotate: 360, scale: 1 }}
          transition={{
            type: 'spring',
            stiffness: 250,
            damping: 20,
          }}
          draggable={false}
          src={`/assets/app-icons/${appID}/256.webp`}
        />
        <h1>Apps coming soon!</h1>
      </section>
    </section>
  );
};

export default PlaceholderApp;
