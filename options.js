// Save options to chrome.storage
function saveOptions() {
  const urlPattern = document.getElementById('urlPattern').value;
  const replacementPrefix = document.getElementById('replacementPrefix').value;
  
  chrome.storage.local.set({
    urlPattern: urlPattern,
    replacementPrefix: replacementPrefix
  }, function() {
    // Update status to let user know options were saved
    const status = document.getElementById('status');
    status.textContent = 'Options saved!';
    status.className = 'status success';
    status.style.display = 'block';
    
    setTimeout(function() {
      status.style.display = 'none';
    }, 3000);
  });
}

// Restore options from chrome.storage
function restoreOptions() {
  chrome.storage.local.get({
    urlPattern: 'https://localhost:3500',
    replacementPrefix: 'https://fiddle/'
  }, function(items) {
    document.getElementById('urlPattern').value = items.urlPattern;
    document.getElementById('replacementPrefix').value = items.replacementPrefix;
  });
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click', saveOptions);