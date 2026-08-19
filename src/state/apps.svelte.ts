import { apps_config } from '🍎/configs/apps/apps-config';

export type AppID = keyof typeof apps_config;

const appIds = Object.keys(apps_config) as AppID[];
const booleanRecord = (value = false) => Object.fromEntries(appIds.map((id) => [id, value])) as Record<AppID, boolean>;
const numberRecord = (value = 0) => Object.fromEntries(appIds.map((id) => [id, value])) as Record<AppID, number>;

export const apps = $state({
	open: { ...booleanRecord(), finder: true, 'view-source': true } as Record<AppID, boolean>,
	active: 'finder' satisfies AppID,
	active_z_index: -2,
	z_indices: numberRecord(),
	is_being_dragged: false as boolean,
	fullscreen: booleanRecord(),
});
