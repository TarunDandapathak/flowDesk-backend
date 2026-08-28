//generate opt
export function otpGenerator() {

    return Math.floor(100000 + Math.random() * 900000).toString();

}
export function getOtpHtml(otp) {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Email Verification</title>
</head>

<body style="margin:0;padding:40px 0;background:#1d1f27;font-family:Arial,Helvetica,sans-serif;">

<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
<tr>
<td align="center">

<table width="600" cellpadding="0" cellspacing="0" style="background:#111827;border-radius:18px;padding:50px 40px;">

<tr>
<td align="center">
<h1 style="margin:0;color:#ffffff;font-size:40px;font-weight:700;">
Email Verification
</h1>

<p style="margin:20px 0 0;color:#d1d5db;font-size:22px;">
Thank you for registering with <strong>FlowDesk</strong>.
</p>
</td>
</tr>

<tr>
<td align="center">
<div style="width:80px;height:2px;background:#2d3748;margin:35px auto;"></div>
</td>
</tr>

<tr>
<td align="center">
<p style="margin:0 0 20px;color:#ffffff;font-size:28px;">
Your OTP is
</p>
</td>
</tr>

<tr>
<td align="center">

<table cellpadding="0" cellspacing="0" width="420">
<tr>
<td
align="center"
style="
background:#2563eb;
padding:28px;
border-radius:12px;
font-size:54px;
font-weight:bold;
letter-spacing:12px;
color:#ffffff;
">

${otp}

</td>
</tr>
</table>

</td>
</tr>

<tr>
<td style="padding-top:40px;">
<table width="100%" cellpadding="0" cellspacing="0"
style="background:#1f2937;border-radius:12px;padding:25px;">
<tr>
<td style="font-size:22px;color:#e5e7eb;padding-bottom:20px;">
🕒 This OTP is valid for <strong>3 minutes.</strong>
</td>
</tr>

<tr>
<td style="border-top:1px solid #374151;padding-top:20px;font-size:22px;color:#e5e7eb;">
🔒 Do not share this OTP with anyone.
</td>
</tr>
</table>
</td>
</tr>

<tr>
<td align="center" style="padding-top:50px;">
<p style="margin:0;color:#d1d5db;font-size:24px;">Regards,</p>

<p style="margin-top:12px;font-size:34px;font-weight:bold;color:#ffffff;">
FlowDesk Team
</p>
</td>
</tr>

</table>

</td>
</tr>
</table>

</body>
</html>
`;
}