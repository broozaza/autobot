const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

// 🔒 ใส่ค่าตรงๆ (เปลี่ยนค่าเหล่านี้ให้เป็นของคุณจริง)
const COOKIE = '_|WARNING:-DO-NOT-SHARE-THIS.--Sharing-this-will-allow-someone-to-log-in-as-you-and-to-steal-your-ROBUX-and-items.|_1BE4B75A26B2BA2D4315570216AE8E2F0D43E45341881D71C028EA21D4BFCFA4C0EC05C19971D9F173CA5B71B7A238D14A937FD8D7E26E11F96544FB26280FFADA3ADCAEA846474172ACE74217A684595FD46A458DB0CD193C7FCE27EAEF7B2433ACFE52759FA5AC417DD0711264DF85CDDA2B53990A7813D731CA720158E89E5228346D25920298CAE24C57E35AEBFE5A39A259A954D838545F8EB801EACFF8F4C742F21DF6DFEC524B7999E300CAFA44AEA158241DEDD62264D4F04153EEEF0D4E191FDA60D8E27D0061964878A1BDB5E06063A4D50C567EEF6F0872E6BD1D32E8F75C06667BED07B480B8F9FA28199AC5267B0EB593F816E7AF2043D457112A8524FBAD84FD3665648E7680E4A1D2B23526194587684474DAE9895301CE088CD302FB08032CB8D9BB19A0E9BA92C35FA1697475107EADC229E06DEA7AF899FA2BEBEFF2BE9E508C1CFD2DB6C5ABE228A8C58AF8D5C9A1454F0B2B466AE9F0C1EF04A71990F245058409255D51CAEAF5DB87B32361A783F091182885BBB32206F759341A98895DA6BB37D8AFDDFFACD40A14C59B3FDE7E56AE7AFCF734070E920C864B4B94855ED7C201090474353424ADAC2BF118B6DB960A0A2FA38F0B4097E9ADA273A663628D35B062034192E0E4967CE585FD7B44D00829AAE4280D8AC169A32A1E0646BA14292DC8526A5932CACAE358A34D30689E5EA5743D161A023BBA43D10D42EEE0B8D49D49C71C75A44D6447C42A012D5CCDD5BB428A52E7ACD86A57529FA643B2F593CF78FFF5CC9E0F66DCA1D05CD5B4A63065D68CD0A50763A1D00A63AC79B865893F06E6E8ACF95D60088BC870C84C22C62D69F8558EB80797E631469A4C21D05E8A5F0926A3D761B02C54E6401A9F134F7E60DFB2FC69D19A329D34749500BDE5969E63B7715923FBB4BF2FF86949C8CA12C26F835B29BBD9FDC3545FBF02EC649A8B3D1643AF7A182F49F993A8BF0868BA5BFC157021CF6F0A7F55FD09182884CE5267BD464BB00845D8506E5702AF908CB6D2B21A1EB3509C278A8BE4744D994966505CC3E037ED90B298FADB7312994AADC73E22509033F8A0'; // แทนที่ด้วย .ROBLOSECURITY จริงของคุณ
const AUTH_TOKEN = 'kuyyyyawdawd111'; // Token ที่ไว้ใช้ยืนยัน

// สร้าง axios instance พร้อม headers เบื้องต้น
const axiosInstance = axios.create({
    headers: {
        'Cookie': `.ROBLOSECURITY=${COOKIE}`,
        'Content-Type': 'application/json'
    }
});

// ✅ Middleware ตรวจสอบ Token
app.use((req, res, next) => {
    const auth = req.headers.authorization;
    if (auth !== AUTH_TOKEN) return res.status(403).json({ error: 'Forbidden' });
    next();
});

// 📦 เปลี่ยนยศผู้ใช้ในกลุ่ม
app.post('/setRank', async (req, res) => {
    const { groupId, userId, rankId } = req.body;

    // ตรวจสอบ input
    if (!groupId || !userId || !rankId) {
        return res.status(400).json({ success: false, error: 'Missing groupId, userId, or rankId' });
    }

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
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

// 🟢 Start Server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`✅ Auto Rank Bot running on port ${PORT}`);
});
