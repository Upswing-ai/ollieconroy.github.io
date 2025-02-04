class VoiceflowWidget extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    // Create a container for the widget
    const container = document.createElement('div');
    container.id = 'voiceflow-widget-container';
    this.shadowRoot.appendChild(container);

    // Load the Voiceflow widget script
    const script = document.createElement('script');
    script.type = 'module';
    script.src = 'https://cdn.voiceflow.com/widget/bundle.mjs';
    script.onload = () => {
      // Initialize the Voiceflow chat widget inside the container
      window.voiceflow.chat.load({
        verify: { projectID: '673b83057e21aad722832eaa' },
        url: 'https://general-runtime.voiceflow.com',
        versionID: 'production',
        render: {
          mode: 'embedded',
          target: container,
        },
        autostart: true,
        // Remove the 'assistant.stylesheet' property if it's not working
      });

      // Inject custom CSS into the widget's Shadow DOM
      this.injectCustomStyles();
    };
    this.shadowRoot.appendChild(script);
  }

  injectCustomStyles() {
    // Wait for the widget to load
    setTimeout(() => {
      const iframe = this.shadowRoot.querySelector('iframe');
      if (iframe) {
        const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
        const widgetShadowRoot = iframeDocument.querySelector('voiceflow-chat')?.shadowRoot;
        if (widgetShadowRoot) {
          const style = document.createElement('style');
          style.textContent = `
            /* Your custom CSS here */
            .vfrc-header {
              display: none !important;
            }
            .vfrc-header--title {
              color: #000 !important;
            }
            .vfrc-assistant-info {
              display: none !important;
            }
            .vfrc-assistant-info--title {
              display: none !important;
            }
            .vfrc-assistant-info--description {
              display: none !important;
            }
            .vfrc-avatar {
              display: none !important;
            }
            .vfrc-icon {
              display: none !important;
            }
            .vfrc-message {
              background: rgba(255, 255, 255, 0.2) !important;
            }
            .vfrc-button {
              background: rgba(255, 255, 255, 0.1) !important;
            }
            .vfrc-chat {
              background-color: inherit; /* Inherits parent color */
              background: rgba(255, 255, 255, 0.1); /* Apply slight opacity */
              backdrop-filter: blur(50px) brightness(2) !important;
              border-radius: 20px !important;
              overflow: hidden !important;
            }
            .vfrc-system-response--list {
              width: 100% !important;
              margin: 0 !important;
            }
            .vfrc-button {
              color: #000000 !important;
              font-size: 1rem !important;
              background: rgba(234, 190, 122, 0.4) !important;
            }
          `;
          widgetShadowRoot.appendChild(style);
        }
      }
    }, 1000); // Adjust the timeout as necessary
  }
}

// Define the custom element
customElements.define('voiceflow-widget', VoiceflowWidget);
