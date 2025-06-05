require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

const COOKIE = process.env.COOKIE;
const AUTH_TOKEN = process.env.AUTH_TOKEN;

const axiosInstance = axios.create({
    headers: {
        'Cookie': `.ROBLOSECURITY=${COOKIE}`,
        'Content-Type': 'application/json'
    }
});

// Middleware ตรวจสอบ token
app.use((req, res, next) => {
    const auth = req.headers.authorization;
    if (auth !== AUTH_TOKEN) return res.status(403).json({ error: 'Forbidden' });
    next();
});

// เปลี่ยนยศผู้ใช้ในกลุ่ม
app.post('/setRank', async (req, res) => {
    const { groupId, userId, rankId } = req.body;

    try {
        // ขอ CSRF Token
        const xsrfRes = await axiosInstance.post('https://auth.roblox.com/v2/logout');
        const token = xsrfRes.headers['x-csrf-token'];
        console.log("CSRF Token:", token);

        // ส่งคำขอเปลี่ยนยศ
        const result = await axios.patch(
            `https://groups.roblox.com/v1/groups/${groupId}/users/${userId}`,
            { roleId: rankId },
            {
                headers: {
                    'X-CSRF-TOKEN': token,
                    'Cookie': `.ROBLOSECURITY=${COOKIE}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        res.json({ success: true, data: result.data });
    } catch (err) {
        console.error("Error Details:", err.response?.data || err.message);
        res.status(500).json({ success: false, error: err.response?.data || err.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ Auto Rank Bot running on port ${PORT}`);
});
