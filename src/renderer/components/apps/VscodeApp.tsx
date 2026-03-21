import type { AppId } from '@/lib/apps';

export default function VscodeApp(_props: { appId: AppId }) {
  return (
    <div className="iframe-app">
      <iframe
        src="https://stackblitz.com/github/puruvj/macos-web?embed=1&file=src/components/Desktop/Desktop.svelte&hideNavigation=1&theme=dark&view=editor"
        title="VSCode mock"
      />
    </div>
  );
}
