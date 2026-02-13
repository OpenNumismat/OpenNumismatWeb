export function arrayBufferToBase64( buffer ) {
  let base64String;

  if (typeof buffer === "string") {
    base64String = buffer;
  }
  else {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    base64String = window.btoa(binary);
  }

  return `data:image/webp;base64,${base64String}`;
}
