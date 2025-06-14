(function() {
        function preloadScript(srcipt) {
            try {
                const preload = document.createElement('link');
                preload.href = srcipt.src;
                preload.rel = "preload";
                preload.as = "script"
                preload.type = "application/x-javascript"
                document.head.appendChild(preload);
            } catch (e) {
                console.error('ExternalScripts: error preloading script', e);
            }
        }
        ;preloadScript({
            src: (function() {
                try {
                    return window.env.ADOBE_LAUNCH_SRC;

                } catch (e) {
                    console.error('external-scripts: error generating tag-manager preload', e);
                }
            }
            )()
        });
        preloadScript({
            src: (function() {
                try {
                    return window.CNN.helpers.getAdfuelSrc('head');

                } catch (e) {
                    console.error('external-scripts: error generating adfuel preload', e);
                }
            }
            )()
        });
        preloadScript({
            src: (function() {
                try {
                    return window.CNN.helpers.getAdfuelSrc('body');

                } catch (e) {
                    console.error('external-scripts: error generating adfuel preload', e);
                }
            }
            )()
        });
    }())