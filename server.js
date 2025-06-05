const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

const API_KEY = process.env.API_KEY || 'HTZEdsvbPU2x/OhRxWlgXD//HtEih0T2BmWRXL0TthbsbEr2ZXlKaGJHY2lPaUpTVXpJMU5pSXNJbXRwWkNJNkluTnBaeTB5TURJeExUQTNMVEV6VkRFNE9qVXhPalE1V2lJc0luUjVjQ0k2SWtwWFZDSjkuZXlKaVlYTmxRWEJwUzJWNUlqb2lTRlJhUldSemRtSlFWVEo0TDA5b1VuaFhiR2RZUkM4dlNIUkZhV2d3VkRKQ2JWZFNXRXd3VkhSb1luTmlSWEl5SWl3aWIzZHVaWEpKWkNJNklqVXlORGM0TmpVMU9UUWlMQ0poZFdRaU9pSlNiMkpzYjNoSmJuUmxjbTVoYkNJc0ltbHpjeUk2SWtOc2IzVmtRWFYwYUdWdWRHbGpZWFJwYjI1VFpYSjJhV05sSWl3aVpYaHdJam94TnpRNU1Ea3lPREU1TENKcFlYUWlPakUzTkRrd09Ea3lNVGtzSW01aVppSTZNVGMwT1RBNE9USXhPWDAubDFsX25jZTRyOU13NUhGWDZGQ04zUVVSeXk0QmlzVGR2WW5xRVRKTUxFRHNUU1daYnBka2FybnlZdnY5dms4cXZ2SGZIQm15QlU1ZzFVYTlYbm9mV1dGZE9kdTNtMzNoR2hZdmtYcEhaVHM5UVJfLS1GRVJwOFpTSU8xQWpjNHk2WlJmZDd3dk5qei1Yb2VwQXJPaTlySm9oM3ZIbjhGSUU2aHE2cHBVMXBGSUlvZ2pFZkNuejRxVEdzQkVscjhVMEI5eXhtOHBiX1pldHRtWDhVNWRGQVhtelZVVU4tYmRCOEVua3dwRzA4Z3hBZWk0dkRsV0w5SjdNVEsxSmk0Skc2NHpvaHJ2MHdEb3otNWdCNGlkMmJKZjRRRzFWUjdQaTJvUTRvRmN0REVVU3FvS21nWDlCNHoyS2Y2QmMtRjZMWTUzR1ZwM2pfc3JXTnd1SGJlc0t3  ';
const AUTH_TOKEN = 'kuyyyyawdawd111'; // token สำหรับ auth ฝั่งเรา

// ตรวจสอบ AUTH_TOKEN
app.use((req, res, next) => {
    const auth = req.headers.authorization;
    if (auth !== AUTH_TOKEN) return res.status(403).json({ error: 'Forbidden' });
    next();
});

// 📦 เปลี่ยนยศผู้ใช้ในกลุ่ม
app.post('/setRank', async (req, res) => {
    const { groupId, membershipId, roleId } = req.body;

    if (!groupId || !membershipId || !roleId) {
        return res.status(400).json({ error: 'Missing groupId, membershipId, or roleId' });
    }

    try {
        const result = await axios.patch(
            `https://apis.roblox.com/cloud/v2/groups/${groupId}/memberships/${membershipId}`,
            {
                role: `groups/${groupId}/roles/${roleId}`
            },
            {
                headers: {
                    'x-api-key': API_KEY,
                    'Content-Type': 'application/json'
                }
            }
        );

        res.json({ success: true, data: result.data });
    } catch (err) {
        console.error("Error:", err.response?.data || err.message);
        res.status(500).json({ success: false, error: 'Internal Error', details: err.response?.data });
    }
});

// 🟢 Start server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`✅ Auto Rank Bot running on port ${PORT}`);
});
