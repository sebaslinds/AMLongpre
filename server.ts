import express from 'express';
import { createServer as createViteServer } from 'vite';
import nodemailer from 'nodemailer';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API routes FIRST
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  app.post('/api/reserve', async (req, res) => {
    const { name, email, message, paintingTitle, paintingDimensions } = req.body;

    if (!name || !email || !message || !paintingTitle) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
      // Configure Nodemailer
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.example.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_PORT === '465',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      const mailOptions = {
        from: process.env.SMTP_USER || 'noreply@example.com',
        to: 'am.longpre@me.com',
        subject: `Nouvelle réservation: ${paintingTitle}`,
        text: `
          Nouvelle réservation pour une toile !
          
          Détails du client :
          Nom : ${name}
          Email : ${email}
          
          Détails de la toile :
          Titre : ${paintingTitle}
          Dimensions : ${paintingDimensions || 'N/A'}
          
          Message :
          ${message}
        `,
        html: `
          <h2>Nouvelle réservation pour une toile !</h2>
          
          <h3>Détails du client :</h3>
          <ul>
            <li><strong>Nom :</strong> ${name}</li>
            <li><strong>Email :</strong> ${email}</li>
          </ul>
          
          <h3>Détails de la toile :</h3>
          <ul>
            <li><strong>Titre :</strong> ${paintingTitle}</li>
            <li><strong>Dimensions :</strong> ${paintingDimensions || 'N/A'}</li>
          </ul>
          
          <h3>Message :</h3>
          <p>${message.replace(/\n/g, '<br>')}</p>
        `,
      };

      // In a real scenario with valid SMTP credentials, this would send the email.
      // For this demo, we'll log it and simulate success if credentials are missing.
      if (process.env.SMTP_USER && process.env.SMTP_PASS) {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
      } else {
        console.log('SMTP credentials not configured. Simulating email send:');
        console.log(mailOptions.text);
      }

      res.status(200).json({ success: true, message: 'Reservation sent successfully' });
    } catch (error) {
      console.error('Error sending email:', error);
      res.status(500).json({ error: 'Failed to send reservation email' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // In production, serve static files from dist
    app.use(express.static('dist'));
    app.get('*', (req, res) => {
      res.sendFile('dist/index.html', { root: '.' });
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
