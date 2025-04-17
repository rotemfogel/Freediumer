// Default pattern and replacement
let urlPattern = "https://medium.com/";
let replacementPrefix = "https://freedium.cfd/";

const RULE_ID = 1;

// Initialize rules
async function initializeRules() {
  const { urlPattern, replacementPrefix } = await chrome.storage.local.get({
    urlPattern: "https://medium.com/",
    replacementPrefix: "https://freedium.cfd/"
  });
  
  await updateRules(urlPattern, replacementPrefix);
}

// Update declarativeNetRequest rules
async function updateRules(pattern, replacement) {
  // Remove any existing rules
  await chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: [RULE_ID]
  });
  
  // Add new rule
  await chrome.declarativeNetRequest.updateDynamicRules({
    addRules: [{
      id: RULE_ID,
      priority: 1,
      action: {
        type: "redirect",
        redirect: {
          regexSubstitution: replacement + "\\0"
        }
      },
      condition: {
        regexFilter: "^" + pattern + "(.*)",
        resourceTypes: ["main_frame"]
      }
    }]
  });
}

// Listen for changes to settings
chrome.storage.onChanged.addListener(async function(changes) {
  let newPattern = urlPattern;
  let newReplacement = replacementPrefix;
  
  if (changes.urlPattern) {
    newPattern = changes.urlPattern.newValue;
  }
  if (changes.replacementPrefix) {
    newReplacement = changes.replacementPrefix.newValue;
  }
  
  await updateRules(newPattern, newReplacement);
});

// Function to rewrite URL
function rewriteUrl(url) {
  if (url && url.startsWith(urlPattern)) {
    return url.replace(urlPattern, replacementPrefix);
  }
  return null;
}

// Message handler for popup
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.action === "rewriteCurrentUrl") {
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        const currentTab = tabs[0];
        const newUrl = rewriteUrl(currentTab.url);
        
        if (newUrl) {
          chrome.tabs.update(currentTab.id, {url: newUrl});
          sendResponse({success: true, newUrl: newUrl});
        } else {
          sendResponse({success: false, message: "URL doesn't match pattern"});
        }
      });
      return true; // Keep the message channel open for async response
    } else if (request.action === "getCurrentPattern") {
      chrome.storage.local.get(['urlPattern', 'replacementPrefix'], function(result) {
        sendResponse({
          urlPattern: result.urlPattern || urlPattern,
          replacementPrefix: result.replacementPrefix || replacementPrefix
        });
      });
      return true;
    }
  }
);

// Initialize
initializeRules();