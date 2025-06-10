import nodemailer from 'nodemailer'

export default async function handler(req, res) {
    // Set CORS headers to allow all origins
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

    // Handle OPTIONS request (preflight)
    if (req.method === 'OPTIONS') {
        return res.status(200).end()
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' })
    }

    const { email } = req.body

    if (!email) {
        return res.status(400).json({ message: 'Email is required' })
    }

    // Configure Nodemailer transporter
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user:"smileyishere1008@gmail.com", // Your Gmail address
            pass:"fqdt liqa kfiy nbbf", // Your app password
        },
    })

    try {
        // Email options
        const mailOptions = {
            from: 'MARS-Botics <smileyishere1008@gmail.com>',
            to: 'smileyj1451@gmail.com', // Admin email
            subject: 'New Access Request for MARS-Botics',
            text: `A new user has requested access to MARS-Botics.\n\nUser Email: ${email}\n\nPlease add this email to the testers list if approved.`,


        html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">New Access Request for MARS-Botics</h2>
          <p>A new user has requested access to MARS-Botics.</p>
          <p><strong>User Email:</strong> ${email}</p>
          <p>Please add this email to the testers list if approved.</p>
          <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="font-size: 0.8rem; color: #6b7280;">This is an automated message. Please do not reply directly to this email.</p>
          </div>
        </div>
      `,
        }

        // Send email
        await transporter.sendMail(mailOptions)

        return res.status(200).json({ success: true, message: 'Access request sent successfully' })
    } catch (error) {
        console.error('Error sending access request email:', error)
        return res.status(500).json({
            success: false,
            message: 'Failed to send access request',
            error: error.message
        })
    }
}