// content script: listen to focus events
document.addEventListener('focusin', e => {
  if (e.target.tagName === 'INPUT') {
    chrome.runtime.sendMessage({ action: 'open_popup' });
  }
});
