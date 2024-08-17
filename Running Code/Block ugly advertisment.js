(function () {
  const originalOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function (method, url) {
    if (url.includes("juice-api.irrvlo.xyz/api/news")) {
      console.log(`Blocked request to: ${url}`);
      return;
    }

    return originalOpen.apply(this, arguments);
  };

  const originalFetch = window.fetch;
  window.fetch = function (url, options) {
    if (
      typeof url === "string" &&
      url.includes("juice-api.irrvlo.xyz/api/news")
    ) {
      console.log(`Blocked fetch request to: ${url}`);
      returnPromise.reject(newError(`Blocked fetch request to: ${url}`));
    }

    return originalFetch.apply(this, arguments);
  };
})();
