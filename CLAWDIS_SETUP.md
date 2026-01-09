# Clawdis Setup Guide

## ✓ Completed Setup Steps

1. ✅ Clawdis repository cloned as submodule at `clawdis/`
2. ✅ Dependencies installed (Node.js 22 + pnpm)
3. ✅ Project and UI built successfully
4. ✅ Configuration file created at `~/.clawdis/clawdis.json`
5. ✅ WhatsApp configured with phone number: **+447834032023**
6. ✅ Agent workspace created at `~/clawd`

## 📱 Next Steps: Link WhatsApp

**Note:** These steps require internet connectivity. Run them on your local machine or a server with internet access.

### 1. Link Your WhatsApp Device

```bash
cd clawdis
pnpm clawdis login
```

This will display a QR code in your terminal.

### 2. Scan the QR Code

1. Open WhatsApp on your phone
2. Tap the menu (⋮) or Settings
3. Tap **Linked Devices**
4. Tap **Link a Device**
5. Scan the QR code displayed in your terminal

### 3. Start the Gateway

Once WhatsApp is linked, start the gateway server:

```bash
cd clawdis
pnpm clawdis gateway --port 18789 --verbose
```

The gateway will:
- Listen on `ws://127.0.0.1:18789`
- Connect to your linked WhatsApp account
- Process messages from **+447834032023** only

### 4. Test Your Assistant

Send a message to yourself on WhatsApp and the AI assistant will respond!

## 🔧 Configuration Location

Your clawdis configuration is stored at:
- **Config:** `~/.clawdis/clawdis.json`
- **Credentials:** `~/.clawdis/credentials/` (created after WhatsApp login)
- **Workspace:** `~/clawd/`

## 📚 Additional Resources

- Full documentation: `clawdis/docs/index.md`
- Configuration guide: `clawdis/docs/configuration.md`
- WhatsApp setup: `clawdis/README.md` (lines 168-170)
- Add other platforms: Telegram, Discord, iMessage

## 🎯 Quick Commands

```bash
cd clawdis

# Send a message via CLI
pnpm clawdis send --to +447834032023 --message "Hello from Clawdis"

# Talk to the assistant directly
pnpm clawdis agent --message "What can you do?" --thinking high

# Check status (send to yourself on WhatsApp)
pnpm clawdis send --to +447834032023 --message "/status"

# Reset conversation
pnpm clawdis send --to +447834032023 --message "/new"
```

## 🔒 Security Note

The `allowFrom` configuration restricts who can interact with your assistant. Currently set to:
- `+447834032023` (your phone number)

To add more phone numbers, edit `~/.clawdis/clawdis.json` and add them to the `whatsapp.allowFrom` array.

## 🌐 Current Configuration

The current configuration at `~/.clawdis/clawdis.json`:

```json
{
  "agent": {
    "workspace": "~/clawd"
  },
  "whatsapp": {
    "allowFrom": ["+447834032023"]
  },
  "gateway": {
    "mode": "local",
    "port": 18789,
    "bind": "loopback"
  }
}
```

## ⚠️ Network Issue

The WhatsApp login failed in the current environment due to network connectivity issues. You'll need to complete the WhatsApp linking step on a machine with proper internet access that can reach `web.whatsapp.com`.
