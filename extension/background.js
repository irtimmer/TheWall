const REMOVE_HEADERS = ['x-frame-options', 'frame-options', 'content-security-policy']

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  browser.webRequest.onHeadersReceived.addListener(
    req => {
      console.log("Request", req);
      let responseHeaders = req.responseHeaders.filter(header => !REMOVE_HEADERS.includes(header.name.toLowerCase()))
      return { responseHeaders };
    }, {
      urls: [ '<all_urls>' ],
      types: [ 'sub_frame' ],
      tabId: sender.tab.id
    },
    ['blocking', 'responseHeaders']
  );
  sendResponse({});
})