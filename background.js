// Function to update the totalDuration value
chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.local.get('lastRecordedDate', function(result) {
    if (!result.lastRecordedDate) {
      const currentDate = new Date().toDateString();
      chrome.storage.local.set({ lastRecordedDate: currentDate }, function() {
        console.log('Installation date stored:', currentDate);
      });
    }
  });
});

function updateTotalDuration() {
  chrome.storage.local.get(['totalDuration', 'lastRecordedDate'], function(result) {
    const currentDate = new Date().toDateString(); // Get today's date as a string
    const lastRecordedDate = result.lastRecordedDate || currentDate; // Get last recorded date, default to today
    let currentDuration = result.totalDuration || 0; // Get stored duration, default 0

    if (currentDate !== lastRecordedDate) {
      // If it's a new day, reset duration
      currentDuration = 0;
      console.log("New day detected! Resetting totalDuration.");
    }

    let newDuration = currentDuration + 30000;
    
    chrome.storage.local.set({ 
      totalDuration: newDuration,
      lastRecordedDate: currentDate // Always update last recorded date
    }, function() {
    });
  });
}

// Call the update function every 30 seconds
setInterval(updateTotalDuration, 30000);

// Listen for messages from the content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'captureScreenshot') {
    // Capture the visible tab
    chrome.tabs.captureVisibleTab(null, { format: 'png' }, (dataUrl) => {
      if (chrome.runtime.lastError) {
        console.error('Error capturing screenshot:', chrome.runtime.lastError);
        sendResponse({ error: chrome.runtime.lastError });
        return;
      }

      // Send the data URL back to the content script
      sendResponse({ dataUrl });
    });

    // Return true to indicate that the response will be sent asynchronously
    return true;
  }
});

chrome.runtime.onStartup.addListener(() => {
  checkForUpdate();
});

chrome.notifications.onButtonClicked.addListener((notifId, buttonIndex) => {
  if (notifId === "update-notif" && buttonIndex === 0) {
    chrome.tabs.create({ url: "https://revibeweb.vercel.app/" });
  }
});

chrome.notifications.onClicked.addListener((notifId) => {
  if (notifId === "update-notif") {
    chrome.tabs.create({ url: "https://revibeweb.vercel.app/" });
  }
});

async function checkForUpdate() {
  try {
    const response = await fetch("https://rahmanhusain.github.io/My-Portfolio/revibeversion.json");
    const data = await response.json();
    const latestVersion = data.version;
    console.log(latestVersion)
    const currentVersion = chrome.runtime.getManifest().version;

    if (latestVersion !== currentVersion) {
      chrome.notifications.create("update-notif", {
        type: "basic",
        iconUrl: chrome.runtime.getURL("icons/logo.png"), // ✅ Use runtime.getURL() for correct path
        title: "Update Available",
        message: `New version ${latestVersion} available! Please reinstall.`,
        buttons: [{ title: "Download Update" }]
      });
      
    }
  } catch (error) {
    console.error("Error checking for updates:", error);
  }
}