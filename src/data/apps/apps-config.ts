import { calculatorAppConfig } from './calculator.app-config';
import { calendarAppConfig } from './calendar.app-config';
import { facetimeAppConfig } from './facetime.app-config';
import { finderAppConfig } from './finder.app-config';
import { launchpadAppConfig } from './launchpad.app-config';
import { mailAppConfig } from './mail.app-config';
import { messagesAppConfig } from './messages.app-config';
import { photosAppConfig } from './photos.app-config';
import { purusTwitterAppConfig } from './purus-twitter.app-config';
import { safariAppConfig } from './safari.app-config';
import { systemPreferencesAppConfig } from './system-preferences.app-config';
import { viewSourceAppConfig } from './view-source.app-config';
import { vscodeAppConfig } from './vscode.app-config';

export const appsConfig = {
  calculator: calculatorAppConfig,
  calendar: calendarAppConfig,
  vscode: vscodeAppConfig,
  finder: finderAppConfig,
  safari: safariAppConfig,
  messages: messagesAppConfig,
  mail: mailAppConfig,
  photos: photosAppConfig,
  facetime: facetimeAppConfig,
  'system-preferences': systemPreferencesAppConfig,

  'purus-twitter': purusTwitterAppConfig,
  'view-source': viewSourceAppConfig,
};
