import "../styles/index.css";

export const metadata = {
  title: "portfolio",
  description: "macOS portfolio",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <head>
        <link rel="icon" type="image/png" href="/favicon.png" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const removeAttr = (el) => {
                  if (el.removeAttribute) {
                    el.removeAttribute('bis_skin_checked');
                  }
                };
                const observer = new MutationObserver((mutations) => {
                  mutations.forEach((m) => {
                    if (m.type === 'attributes' && m.attributeName === 'bis_skin_checked') {
                      removeAttr(m.target);
                    }
                    if (m.addedNodes) {
                      m.addedNodes.forEach((n) => {
                        if (n.nodeType === 1) {
                          removeAttr(n);
                          n.querySelectorAll('[bis_skin_checked]').forEach(removeAttr);
                        }
                      });
                    }
                  });
                });
                observer.observe(document.documentElement, {
                  childList: true,
                  subtree: true,
                  attributes: true,
                  attributeFilter: ['bis_skin_checked']
                });
              })();
            `,
          }}
        />
      </head>
      <body suppressHydrationWarning={true}>{children}</body>
    </html>
  );
}
