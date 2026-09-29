document.addEventListener('DOMContentLoaded', () => {
  const statusDot = document.getElementById('statusDot');
  const statusText = document.getElementById('statusText');
  const openWaBtn = document.getElementById('openWaBtn');

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0];
    if (activeTab && activeTab.url && activeTab.url.includes('web.whatsapp.com')) {
      statusDot.classList.add('active');
      statusText.textContent = 'Active on WhatsApp Web';
      openWaBtn.textContent = 'Focus WhatsApp Web Control';
    } else {
      statusDot.classList.remove('active');
      statusText.textContent = 'WhatsApp Web not detected';
      openWaBtn.textContent = 'Open WhatsApp Web';
    }
  });

  openWaBtn.addEventListener('click', () => {
    chrome.tabs.query({ url: "https://web.whatsapp.com/*" }, (tabs) => {
      if (tabs.length > 0) {
        const targetTab = tabs[0];
        chrome.tabs.update(targetTab.id, { active: true }, () => {
          chrome.tabs.sendMessage(targetTab.id, { action: "openDrawer" }, (res) => {
            if (chrome.runtime.lastError) {
              console.log("Not injected yet...");
            }
          });
        });
      } else {
        chrome.tabs.create({ url: "https://web.whatsapp.com" });
      }
    });
  });
});
