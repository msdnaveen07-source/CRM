// Background service worker for WhatsApp Bulk Sender Pro
chrome.runtime.onInstalled.addListener(() => {
  console.log("WhatsApp Bulk Sender Pro installed successfully.");
  chrome.storage.local.set({
    settings: {
      minDelay: 6,
      maxDelay: 14,
      batchSize: 15,
      batchPauseMinutes: 3,
      humanTyping: true,
      spintaxEnabled: true
    }
  });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "openWhatsApp") {
    chrome.tabs.create({ url: "https://web.whatsapp.com" });
    sendResponse({ status: "opening" });
  }
  return true;
});
