export function arrayBufferToBase64( buffer ) {
  let binary = '';
  const bytes = new Uint8Array( buffer );
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode( bytes[ i ] );
  }
  const base64String = window.btoa( binary );
  return `data:image/png;base64,${base64String}`;
}
