document.addEventListener('DOMContentLoaded', function() {
  // Handle rewrite button click
  document.getElementById('rewriteUrl').addEventListener('click', function() {
    chrome.runtime.sendMessage({action: "rewriteCurrentUrl"}, function(response) {
      const messageEl = document.getElementById('message');
      
      if (response.success) {
        messageEl.textContent = "URL rewritten successfully!";
        messageEl.className = "success";
      } else {
        messageEl.textContent = response.message;
        messageEl.className = "error";
      }
      
      messageEl.style.display = "block";
      
      // Close popup after a short delay if successful
      if (response.success) {
        setTimeout(function() {
          window.close();
        }, 1500);
      }
    });
  });
  
  // Handle options link click
  document.getElementById('openOptions').addEventListener('click', function() {
    chrome.runtime.openOptionsPage();
  });
});