mergeInto(LibraryManager.library, {
  NotifyAvatarComplete: function(jsonStr) {
    if (window.dispatchReactEvent) {
      window.dispatchReactEvent("AvatarComplete", UTF8ToString(jsonStr));
    }
  },
  NotifyRelayCode: function(code) {
    if (window.dispatchReactEvent) {
      window.dispatchReactEvent("RelayCodeReady", UTF8ToString(code));
    }
  }
});
