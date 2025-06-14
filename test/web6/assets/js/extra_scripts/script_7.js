(function() {
        function getPath() {
            const domain = window.location.hostname;
            const metaURL = document.querySelector('[rel=canonical]').getAttribute?.('href');
            try {
                const canURL = new URL(metaURL);
                return domain + canURL.pathname;
            } catch (e) {
                // we should never run into this situation where the canonical
                // url is missing in the meta tag but just in case
                return domain + document.location.pathname;
            }
        }
        function getDomain() {
            var domain = !window.CNN.contentModel.edition ? 'cnn.com' : 'edition.cnn.com'
            if (window.CNN.contentModel && window.CNN.contentModel.brandSite === 'es') {
                domain = 'cnnespanol.cnn.com';
            }
            if (window.CNN.omniture.rs_flag != "prod") {
                domain = "dev." + domain;
            }
            return domain;
        }
        function getTitle(headline='') {
            const isHomepage = window.CNN?.contentModel?.section === 'homepage';
            return isHomepage ? headline.replace(' Desktop', '').replace(' Mobile', '') : headline;
        }
        const isWebview = window.location.pathname.startsWith('/webview');
        var _sf_async_config = window._sf_async_config = (window._sf_async_config || {});
        _sf_async_config.uid = 37612;
        _sf_async_config.domain = getDomain();
        _sf_async_config.sections = window.CNN.contentModel.vertical;
        _sf_async_config.authors = window.CNN.omniture.cap_author;
        _sf_async_config.title = getTitle(window.CNN.omniture.headline);
        _sf_async_config.flickerControl = false;
        _sf_async_config.path = getPath();
        if (isWebview) {
            _sf_async_config.mobileApp = true;
        }
    }
    )();