export function isValidURL(str: string) {
  const pattern = new RegExp(
    '^(https?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$',
    'i',
  ); // fragment locator

  return !!pattern.test(str);
}

export const prefixURlWithProtocol = (url: string) => {
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  return `http://${url}`;
};

export const loadURL = (url: string) =>
  new Promise<boolean>((resolve) => {
    const iframeEl = document.createElement('iframe');

    iframeEl.src = url;

    iframeEl.addEventListener('load', () => {
      resolve(true);
      // document.body.removeChild(iframeEl);
    });
    iframeEl.onerror = () => {
      resolve(false);
      // document.body.removeChild(iframeEl);
    };

    document.body.appendChild(iframeEl);
  });
