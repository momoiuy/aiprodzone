async function main() {
  const home = await fetch('http://localhost:3000');
  const html = await home.text();
  console.log('Home status:', home.status, 'HTML length:', html.length);
  const match = html.match(/href="(\/_next\/static\/css\/[^"]+)"/);
  if (match) {
    const css = await fetch('http://localhost:3000' + match[1]);
    const cssText = await css.text();
    console.log('CSS URL:', match[1], 'Status:', css.status, 'Length:', cssText.length, 'bytes');
  } else {
    console.log('No CSS match found');
  }
  const admin = await fetch('http://localhost:3000/admin');
  console.log('Admin status:', admin.status);
}

main().catch(console.error);
