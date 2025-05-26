
function updateDateTime() {
  const dt = new Date();
  const date = dt.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const time = dt.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  const element = document.getElementById('datetime');
  if (element) {
    element.textContent = `${date} | ${time}`;
  }
}
setInterval(updateDateTime, 1000);
updateDateTime();
