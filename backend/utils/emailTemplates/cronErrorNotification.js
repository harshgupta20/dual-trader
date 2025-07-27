const cronErrorNotification = (errorMessage) => {
  return {
    subject: "❌ Cron Job Error Notification",
    text: `Hello,

An error occurred while executing your scheduled cron job.

🕒 Time: ${new Date().toLocaleTimeString()}
📅 Date: ${new Date().toLocaleDateString()}
💥 Error Details:
${errorMessage}

Please check your server logs for more information.

- Express Server Monitoring Bot`,
    
    html: `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <h2>❌ Cron Job Error Notification</h2>
        <p>Hello,</p>
        <p>An error occurred while executing your scheduled cron job.</p>
        <ul>
          <li><strong>🕒 Time:</strong> ${new Date().toLocaleTimeString()}</li>
          <li><strong>📅 Date:</strong> ${new Date().toLocaleDateString()}</li>
        </ul>
        <p><strong>💥 Error Details:</strong></p>
        <pre style="background-color: #f8f8f8; padding: 10px; border-left: 4px solid red;">
${errorMessage}
        </pre>
        <p>Please check your server logs for more information.</p>
        <p style="margin-top: 20px;">- Express Server Monitoring Bot</p>
      </div>
    `
  };
};
