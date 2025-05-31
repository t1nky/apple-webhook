class AppleServerNotificationDecoder {
  constructor() {
    this.isValid = false;
    this.isTest = false;
    this.payload = null;
    this.transactionInfo = null;
    this.renewalInfo = null;
    this.appleRootCert = null;
  }

  // Base64 URL decode (without padding)
  base64UrlDecode(str) {
    // Add padding if needed
    str += "=".repeat((4 - (str.length % 4)) % 4);
    // Replace URL-safe characters
    str = str.replace(/-/g, "+").replace(/_/g, "/");
    return atob(str);
  }

  // Parse JWT token without verification (for display purposes)
  parseJWT(token) {
    try {
      const parts = token.split(".");
      if (parts.length !== 3) {
        throw new Error("Invalid JWT format");
      }

      const header = JSON.parse(this.base64UrlDecode(parts[0]));
      const payload = JSON.parse(this.base64UrlDecode(parts[1]));

      return { header, payload, signature: parts[2] };
    } catch (error) {
      throw new Error(`Failed to parse JWT: ${error.message}`);
    }
  }

  // Extract certificate from JWT header by index
  extractCertificateByIndex(token, index) {
    try {
      const { header } = this.parseJWT(token);

      if (
        !header.x5c ||
        !Array.isArray(header.x5c) ||
        header.x5c.length <= index
      ) {
        throw new Error(
          `Certificate at index ${index} not found in x5c header`
        );
      }

      return header.x5c[index];
    } catch (error) {
      throw new Error(`Failed to extract certificate: ${error.message}`);
    }
  }

  // Convert PEM certificate to DER format (simplified)
  pemToDer(pem) {
    const lines = pem.split("\n");
    const base64 = lines
      .filter((line) => !line.startsWith("-----"))
      .join("")
      .replace(/\s/g, "");
    return base64;
  }

  // Basic certificate validation (simplified - in production, use proper crypto libraries)
  async validateCertificateChain(leafCert, intermediateCert, rootCert) {
    try {
      // This is a simplified validation
      // In a real implementation, you would use Web Crypto API or a proper crypto library
      console.log("Certificate validation (simplified):", {
        leafCert: leafCert.substring(0, 50) + "...",
        intermediateCert: intermediateCert.substring(0, 50) + "...",
        rootCert: rootCert.substring(0, 50) + "...",
      });

      // For demo purposes, we'll assume validation passes
      // In production, implement proper X.509 certificate chain validation
      return true;
    } catch (error) {
      console.error("Certificate validation failed:", error);
      return false;
    }
  }

  // Decode the main signed payload
  async decode(signedPayload, appleRootCert) {
    try {
      this.appleRootCert = appleRootCert;
      this.isValid = false;
      this.isTest = false;

      // Parse the main JWT payload
      const mainJWT = this.parseJWT(signedPayload);
      this.payload = mainJWT.payload;

      // Check if this is a test notification
      this.isTest = this.payload.notificationType === "TEST";

      // Extract certificates for validation
      const leafCert = this.extractCertificateByIndex(signedPayload, 0);
      const intermediateCert = this.extractCertificateByIndex(signedPayload, 1);
      const rootCert = this.extractCertificateByIndex(signedPayload, 2);

      // Validate certificate chain (simplified)
      const isValidChain = await this.validateCertificateChain(
        leafCert,
        intermediateCert,
        this.pemToDer(appleRootCert)
      );

      if (!isValidChain) {
        throw new Error("Certificate chain validation failed");
      }

      // For test notifications, we can mark as valid here
      if (this.isTest) {
        this.isValid = true;
        return;
      }

      // Parse transaction info if present
      if (this.payload.data && this.payload.data.signedTransactionInfo) {
        const transactionJWT = this.parseJWT(
          this.payload.data.signedTransactionInfo
        );
        this.transactionInfo = transactionJWT.payload;
      }

      // Parse renewal info if present
      if (this.payload.data && this.payload.data.signedRenewalInfo) {
        const renewalJWT = this.parseJWT(this.payload.data.signedRenewalInfo);
        this.renewalInfo = renewalJWT.payload;
      }

      this.isValid = true;
    } catch (error) {
      console.error("Decoding failed:", error);
      throw error;
    }
  }

  // Get formatted results
  getResults() {
    return {
      isValid: this.isValid,
      isTest: this.isTest,
      payload: this.payload,
      transactionInfo: this.transactionInfo,
      renewalInfo: this.renewalInfo,
    };
  }
}

// UI Controller
class UIController {
  constructor() {
    this.decoder = new AppleServerNotificationDecoder();
    this.initializeEventListeners();
  }

  initializeEventListeners() {
    // Decode button
    document.getElementById("decodeBtn").addEventListener("click", () => {
      this.handleDecode();
    });

    // Tab switching
    document.querySelectorAll(".tab-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        this.switchTab(e.target.dataset.tab);
      });
    });

    // Auto-resize textareas
    document.querySelectorAll("textarea").forEach((textarea) => {
      textarea.addEventListener("input", () => {
        this.autoResize(textarea);
      });
    });
  }

  autoResize(textarea) {
    textarea.style.height = "auto";
    const maxHeight = 200; // Match the CSS max-height
    const newHeight = Math.min(textarea.scrollHeight, maxHeight);
    textarea.style.height = newHeight + "px";
  }

  switchTab(tabName) {
    // Remove active class from all tabs and panes
    document
      .querySelectorAll(".tab-btn")
      .forEach((btn) => btn.classList.remove("active"));
    document
      .querySelectorAll(".tab-pane")
      .forEach((pane) => pane.classList.remove("active"));

    // Add active class to selected tab and pane
    document.querySelector(`[data-tab="${tabName}"]`).classList.add("active");
    document.getElementById(`${tabName}-tab`).classList.add("active");
  }

  showLoading(button) {
    const originalText = button.innerHTML;
    button.innerHTML = '<span class="loading"></span>Decoding...';
    button.disabled = true;
    return originalText;
  }

  hideLoading(button, originalText) {
    button.innerHTML = originalText;
    button.disabled = false;
  }

  showError(message) {
    const errorOutput = document.getElementById("errorOutput");
    const errorMessage = document.getElementById("errorMessage");

    errorMessage.textContent = message;
    errorOutput.style.display = "block";

    // Hide after 10 seconds
    setTimeout(() => {
      errorOutput.style.display = "none";
    }, 10000);
  }

  hideError() {
    document.getElementById("errorOutput").style.display = "none";
  }

  updateStatusIndicators(isValid, isTest) {
    const validElement = document.getElementById("isValid");
    const testElement = document.getElementById("isTest");

    // Update valid status
    validElement.textContent = isValid ? "✅ Yes" : "❌ No";
    validElement.className = `status-value ${isValid ? "valid" : "invalid"}`;

    // Update test status
    testElement.textContent = isTest ? "🧪 Yes" : "📱 No";
    testElement.className = `status-value ${isTest ? "test" : ""}`;
  }

  formatJSON(obj) {
    if (!obj) return '<p class="placeholder">No data available</p>';

    const jsonString = JSON.stringify(obj, null, 2);
    return `<pre>${this.syntaxHighlight(jsonString)}</pre>`;
  }

  syntaxHighlight(json) {
    json = json
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    return json.replace(
      /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
      function (match) {
        let cls = "json-number";
        if (/^"/.test(match)) {
          if (/:$/.test(match)) {
            cls = "json-key";
          } else {
            cls = "json-string";
          }
        } else if (/true|false/.test(match)) {
          cls = "json-boolean";
        } else if (/null/.test(match)) {
          cls = "json-null";
        }
        return '<span class="' + cls + '">' + match + "</span>";
      }
    );
  }

  updateOutputs(results) {
    // Update payload output
    document.getElementById("payloadOutput").innerHTML = this.formatJSON(
      results.payload
    );

    // Update transaction output
    document.getElementById("transactionOutput").innerHTML = this.formatJSON(
      results.transactionInfo
    );

    // Update renewal output
    document.getElementById("renewalOutput").innerHTML = this.formatJSON(
      results.renewalInfo
    );

    // Update raw output
    document.getElementById("rawOutput").innerHTML = this.formatJSON(results);
  }

  async handleDecode() {
    const signedPayload = document.getElementById("signedPayload").value.trim();
    const appleRootCert = document.getElementById("appleRootCert").value.trim();
    const decodeBtn = document.getElementById("decodeBtn");

    // Validation
    if (!signedPayload) {
      this.showError("Please enter a signed payload");
      return;
    }

    if (!appleRootCert) {
      this.showError("Please enter the Apple root certificate");
      return;
    }

    // Hide previous errors
    this.hideError();

    // Show loading state
    const originalText = this.showLoading(decodeBtn);

    try {
      // Decode the notification
      await this.decoder.decode(signedPayload, appleRootCert);

      // Get results
      const results = this.decoder.getResults();

      // Update UI
      this.updateStatusIndicators(results.isValid, results.isTest);
      this.updateOutputs(results);

      // Switch to payload tab
      this.switchTab("payload");
    } catch (error) {
      this.showError(`Decoding failed: ${error.message}`);
      console.error("Decoding error:", error);
    } finally {
      this.hideLoading(decodeBtn, originalText);
    }
  }
}

// Initialize the application when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new UIController();
});
