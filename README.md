# 🍎 Apple Server Notification Decoder

A simple, static website for decoding and verifying Apple App Store server notifications. This tool helps developers understand and debug Apple's server-to-server notifications for in-app purchases and subscriptions.

## 🌟 Features

- **JWT Token Decoding**: Parse Apple's signed JWT payloads
- **Certificate Validation**: Basic certificate chain validation (simplified for demo)
- **Multi-level Parsing**: Decode notification payload, transaction info, and renewal info
- **Beautiful UI**: Modern, responsive design with syntax highlighting
- **Test Detection**: Automatically identifies test vs. production notifications
- **Real-time Validation**: Instant feedback on payload validity

## 🚀 Quick Start

### GitHub Pages Deployment

1. **Fork this repository** or create a new repository with these files
2. **Enable GitHub Pages**:
   - Go to repository Settings
   - Scroll to "Pages" section
   - Select "Deploy from a branch"
   - Choose "main" branch and "/ (root)" folder
   - Save the settings
3. **Access your site** at `https://yourusername.github.io/repository-name`

### Local Development

1. **Clone the repository**:

   ```bash
   git clone <repository-url>
   cd apple-webhook
   ```

2. **Serve locally**:

   ```bash
   # Using Python 3
   python -m http.server 8000

   # Using Python 2
   python -m SimpleHTTPServer 8000

   # Using Node.js
   npx serve .
   ```

3. **Open in browser**: Navigate to `http://localhost:8000`

## 📖 Usage

### Required Inputs

1. **Signed Payload**: The JWT token received from Apple's server notification
2. **Apple Root Certificate**: The root certificate from Apple (in PEM format)

### How to Use

1. **Get the Apple Root Certificate**:

   - Download from [Apple's PKI page](https://www.apple.com/certificateauthority/)
   - Use the "Apple Inc. Root Certificate" in PEM format

2. **Paste the Signed Payload**:

   - Copy the `signedPayload` value from Apple's server notification
   - This is the JWT token that contains all the notification data

3. **Click "Decode Notification"**:
   - The tool will parse the JWT and extract all information
   - View results in different tabs: Payload, Transaction Info, Renewal Info, Raw Data

### Example Apple Root Certificate

```
-----BEGIN CERTIFICATE-----
MIIEuzCCA6OgAwIBAgIBAjANBgkqhkiG9w0BAQUFADCBiDELMAkGA1UEBhMCVVMx
EzARBgNVBAgMCkNhbGlmb3JuaWExEjAQBgNVBAcMCUN1cGVydGlubzEaMBgGA1UE
CgwRQXBwbGUgSW5jLiwgSW5jLjEtMCsGA1UECwwkQXBwbGUgQ2VydGlmaWNhdGlv
biBBdXRob3JpdHkgKEFDQSkxDzANBgNVBAMMBkFwcGxlIENBMB4XDTA2MDQyNTIx
NDAzNloXDTM1MDIwOTIxNDAzNlowgYgxCzAJBgNVBAYTAlVTMRMwEQYDVQQIDApD
YWxpZm9ybmlhMRIwEAYDVQQHDAlDdXBlcnRpbm8xGjAYBgNVBAoMEUFwcGxlIElu
Yy4sIEluYy4xLTArBgNVBAsMJEFwcGxlIENlcnRpZmljYXRpb24gQXV0aG9yaXR5
IChBQ0EpMQ8wDQYDVQQDDAZBcHBsZSBDQTCCASIwDQYJKoZIhvcNAQEBBQADggEP
ADCCAQoCggEBAOjwjlOiKmZiF573Lei9eWDQNfGqhf2YOp0RdtbHuoqNn3ybXHmZ
...
-----END CERTIFICATE-----
```

## 🔧 Technical Details

### Architecture

- **Frontend Only**: Pure HTML, CSS, and JavaScript
- **No Backend Required**: All processing happens in the browser
- **Static Hosting**: Can be deployed to any static hosting service

### JWT Structure

The tool decodes Apple's three-level JWT structure:

1. **Main Payload**: Contains notification metadata and data
2. **Transaction Info**: Detailed transaction information (if present)
3. **Renewal Info**: Subscription renewal information (if present)

### Certificate Validation

⚠️ **Note**: The certificate validation in this demo is simplified. For production use, implement proper X.509 certificate chain validation using:

- Web Crypto API
- Dedicated crypto libraries (forge.js, node-forge, etc.)
- Server-side validation

## 📱 Supported Notification Types

- `CONSUMPTION_REQUEST`
- `DID_CHANGE_RENEWAL_PREF`
- `DID_CHANGE_RENEWAL_STATUS`
- `DID_FAIL_TO_RENEW`
- `DID_RENEW`
- `EXPIRED`
- `GRACE_PERIOD_EXPIRED`
- `OFFER_REDEEMED`
- `PRICE_INCREASE`
- `REFUND`
- `REFUND_DECLINED`
- `RENEWAL_EXTENDED`
- `REVOKE`
- `SUBSCRIBED`
- `TEST` (Test notifications)

## 🛠️ Development

### File Structure

```
apple-webhook/
├── index.html          # Main HTML file
├── styles.css          # CSS styles
├── decoder.js          # JavaScript decoder logic
└── README.md          # This file
```

### Customization

- **Styling**: Modify `styles.css` for custom themes
- **Functionality**: Extend `decoder.js` for additional features
- **UI**: Update `index.html` for layout changes

## 🔒 Security Considerations

- **Client-side Processing**: All data stays in the browser
- **No Data Storage**: No information is stored or transmitted
- **Certificate Validation**: Implement proper validation for production use
- **HTTPS Required**: Use HTTPS for production deployments

## 📚 Resources

- [Apple Server Notifications Documentation](https://developer.apple.com/documentation/appstoreservernotifications)
- [Apple PKI and Certificates](https://www.apple.com/certificateauthority/)
- [JWT.io](https://jwt.io/) - JWT token debugger
- [Apple Developer Portal](https://developer.apple.com/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## ⚠️ Disclaimer

This tool is for development and debugging purposes. Always validate server notifications properly in your production environment using server-side validation with appropriate security measures.

**This project is not affiliated with, endorsed by, or sponsored by Apple Inc. in any way.** Apple, App Store, and related trademarks are property of Apple Inc.
