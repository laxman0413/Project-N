import React from 'react';
import { Typography, Container, Paper, Box } from '@mui/material';
import './PrivacyPolicy.css';

const PrivacyPolicy = () => {
  return (
    <Container maxWidth="md" className="privacy-container">
      <Paper elevation={3} className="privacy-paper">
        <Box p={4}>
          <Typography variant="h4" gutterBottom className="privacy-header">
            Privacy Policy
          </Typography>

          <Typography variant="subtitle1" gutterBottom className="privacy-intro">
            Your privacy is critically important to us. This Privacy Policy explains how we
            collect, use, and safeguard your information.
          </Typography>

          <Box mb={2}>
            <Typography variant="h6" gutterBottom>
              1. Information We Collect
            </Typography>
            <Typography variant="body1" gutterBottom>
              We may collect personal information, including your name, email address, phone
              number, and job-related data when you use our platform.
            </Typography>
          </Box>

          <Box mb={2}>
            <Typography variant="h6" gutterBottom>
              2. How We Use Your Information
            </Typography>
            <Typography variant="body1" gutterBottom>
              Your information is used to:
            </Typography>
            <ul className="privacy-list">
              <li>Facilitate job applications and job postings.</li>
              <li>Improve user experience and platform functionality.</li>
              <li>Send notifications and updates regarding your account and activities.</li>
            </ul>
          </Box>

          <Box mb={2}>
            <Typography variant="h6" gutterBottom>
              3. Information Sharing
            </Typography>
            <Typography variant="body1" gutterBottom>
              We do not sell or rent your personal information to third parties. Your data may
              be shared with:
            </Typography>
            <ul className="privacy-list">
              <li>Job providers or seekers for relevant applications or postings.</li>
              <li>Service providers assisting in platform operations.</li>
              <li>Legal authorities when required by law.</li>
            </ul>
          </Box>

          <Box mb={2}>
            <Typography variant="h6" gutterBottom>
              4. Data Security
            </Typography>
            <Typography variant="body1" gutterBottom>
              We implement appropriate technical and organizational measures to secure your
              data and prevent unauthorized access, disclosure, or destruction.
            </Typography>
          </Box>

          <Box mb={2}>
            <Typography variant="h6" gutterBottom>
              5. Cookies
            </Typography>
            <Typography variant="body1" gutterBottom>
              We use cookies to enhance your experience on our platform. You can manage cookie
              preferences through your browser settings.
            </Typography>
          </Box>

          <Box mb={2}>
            <Typography variant="h6" gutterBottom>
              6. Your Rights
            </Typography>
            <Typography variant="body1" gutterBottom>
              You have the right to access, update, or delete your personal information. To
              exercise these rights, contact us at support@nagaconnect.com.
            </Typography>
          </Box>

          <Box mb={2}>
            <Typography variant="h6" gutterBottom>
              7. Changes to This Policy
            </Typography>
            <Typography variant="body1" gutterBottom>
              We may update this Privacy Policy periodically. Changes will be communicated via
              email or platform notifications.
            </Typography>
          </Box>

          <Box>
            <Typography variant="body2" align="center" className="privacy-footer">
              If you have any questions about our Privacy Policy, please contact us at
              support@nagaconnect.com.
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default PrivacyPolicy;

