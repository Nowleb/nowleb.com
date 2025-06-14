if (!window.WM.UserConsent.inUserConsentState(["data-share", "data-store", "content-person-prof", "content-person", "measure-ads", "measure-content"])) {
        window.optimizely = window.optimizely || [];
        window.optimizely.push({
            type: 'disable'
        });
    }