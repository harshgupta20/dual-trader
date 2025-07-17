module.exports = () => {
    return {
        subject: "🚀 Server Status: UP and Running",
        text: `Hello,

This is a notification that your server is up and running successfully.

📅 Date: ${new Date().toLocaleDateString()}
🕒 Time: ${new Date().toLocaleTimeString()}

- Scheduled by Dual Trader`,

        html: `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <h2>🚀 Server Status: <span style="color: green;">UP</span> and Running</h2>
        <p>Hello,</p>
        <p>This is a notification that your server is up and running successfully.</p>
        <ul>
          <li><strong>📅 Date:</strong> ${new Date().toLocaleDateString()}</li>
          <li><strong>🕒 Time:</strong> ${new Date().toLocaleTimeString()}</li>
        </ul>
        <p style="margin-top: 20px;">- Dual Trader</p>
      </div>
    `
    };
};