const express = require('express');
const os = require('os');
const app = express();

// Get port from environment variable (Beanstalk sets this automatically)
const port = process.env.PORT || 8080;

// Simple in-memory counter
let visitCount = 0;
const instanceId = process.env.INSTANCE_ID || 'unknown';

// Helper functions for clean formatting
const formatBytes = (bytes) => (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
const formatUptime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
};

// Root route - MUST return 200 for health checks
app.get('/', (req, res) => {
    visitCount++;
    
    // Fetch hardware specs
    const cpus = os.cpus();
    const cpuInfo = (cpus && cpus && cpus.model) 
        ? cpus.model 
        : `AWS Virtual Processor (${os.arch()})`;    const platform = os.platform();
    const architecture = os.arch();
    const totalMem = formatBytes(os.totalmem());
    const freeMem = formatBytes(os.freemem());
    const serverUptime = formatUptime(os.uptime());

    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>AWS Hardware Inspector</title>
            <script src="https://unpkg.com/@lottiefiles/dotlottie-wc@0.9.10/dist/dotlottie-wc.js" type="module"></script>
            <style>
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    max-width: 650px;
                    margin: 40px auto;
                    padding: 20px;
                    background: linear-gradient(135deg, #232526 0%, #414345 100%);
                    color: #ecf0f1;
                }
                .card {
                    background: rgba(255, 255, 255, 0.05);
                    padding: 30px;
                    border-radius: 12px;
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
                }
                .animation-container {
                    display: flex;
                    justify-content: center;
                    margin-bottom: 10px;
                }
                h1 { margin-top: 0; color: #f39c12; border-bottom: 2px solid #f39c12; padding-bottom: 10px; text-align: center; }
                p { text-align: center; }
                .grid {
                    display: grid;
                    grid-template-columns: 1fr 2fr;
                    gap: 15px;
                    margin: 20px 0;
                    background: rgba(0, 0, 0, 0.2);
                    padding: 20px;
                    border-radius: 8px;
                }
                .label { font-weight: bold; color: #bdc3c7; }
                .value { font-family: monospace; font-size: 1.1em; color: #2ecc71; }
                .stat-box {
                    text-align: center;
                    margin-top: 30px;
                    padding-top: 20px;
                    border-top: 1px solid rgba(255,255,255,0.1);
                }
                .stat { font-size: 36px; font-weight: bold; color: #3498db; }
            </style>
        </head>
        <body>
            <div class="card">
                <div class="animation-container">
                    <dotlottie-wc src="https://lottie.host/662e5b74-efb0-49e7-8ddd-0c1cb263ef0b/XEWJlmt9b2.lottie" style="width: 300px; height: 300px" autoplay loop></dotlottie-wc>
                </div>

                <h1>☁️ Cloud Hardware Inspector</h1>
                <p>Live diagnostics from the hosting EC2 Instance:</p>
                
                <div class="grid">
                    <div class="label">Instance ID:</div>
                    <div class="value">${instanceId}</div>

                    <div class="label">OS Platform:</div>
                    <div class="value">${platform} (${os.release()})</div>

                    <div class="label">Architecture:</div>
                    <div class="value">${architecture}</div>

                    <div class="label">CPU Model:</div>
                    <div class="value">${cpuInfo}</div>

                    <div class="label">Memory Usage:</div>
                    <div class="value">${freeMem} free / ${totalMem} total</div>

                    <div class="label">Server Uptime:</div>
                    <div class="value">${serverUptime}</div>
                </div>

                <div class="stat-box">
                    <p>Total Page Requests Processed:</p>
                    <div class="stat">${visitCount}</div>
                </div>
            </div>
        </body>
        </html>
    `);
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});