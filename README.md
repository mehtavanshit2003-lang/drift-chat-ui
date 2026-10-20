# Drift responsive website recreation

This is a dependency-free interactive recreation of the supplied Drift design PDF. It includes the landing page, random chat, direct messages, groups, group chat, settings, light/dark appearance, and responsive desktop/tablet/mobile layouts.

## Run it

In Terminal, run:

```bash
cd "/Users/vanshitmehta/Documents/Codex/2026-10-20/pls-give-me-code-for-this/outputs/drift-chat"
python3 -m http.server 4173
```

Then open this address in a browser:

```text
http://localhost:4173
```

To stop the local site, return to the Terminal window and press `Control + C`.

## Check the main interactions

1. On the landing page, enter a username, tick the 18+ checkbox, then select **Start chat now**.
2. Use the sidebar (or the bottom navigation on a phone-size window) to switch between Random chat, Messages, Groups, and Settings.
3. Choose a conversation on Messages; on mobile it opens the conversation view and the back arrow returns to the list.
4. Choose **Join group** from any group card to open that group’s chat.
5. Send a message by typing in any message box and pressing Enter or the blue send button.
6. Try the switches and Light/Dark/System cards in Settings.
7. In Random chat, use **Next**, **Stop**, or **Report** to check the feedback overlays.

## Files

- `index.html` — the page structure and accessible UI text
- `styles.css` — desktop, tablet, mobile, and dark theme styling
- `app.js` — navigation, form validation, dialogs, theming, and demo interactions
