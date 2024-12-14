import React from 'react';
import { Typography, Container, Paper, Box } from '@mui/material';
import './TermsAndConditions.css';

const TermsAndConditions = () => {
  return (
    <Container maxWidth="md" className="terms-container">
      <Paper elevation={3} className="terms-paper">
        <Box p={4}>
          <Typography variant="h4" gutterBottom className="terms-header">
            Terms and Conditions
          </Typography>

          <Typography variant="subtitle1" gutterBottom className="terms-intro">
            Welcome to NagaConnect! These terms and conditions outline the rules and
            regulations for using our platform.
          </Typography>

          <Box mb={2}>
            <Typography variant="h6" gutterBottom>
              1. Acceptance of Terms
            </Typography>
            <Typography variant="body1" gutterBottom>
              By accessing and using NagaConnect, you accept and agree to be bound by these
              terms and conditions. If you disagree with any part, you must not use this
              platform.
            </Typography>
          </Box>

          <Box mb={2}>
            <Typography variant="h6" gutterBottom>
              2. Account Registration
            </Typography>
            <Typography variant="body1" gutterBottom>
              To use certain features of the platform, you may need to register an account.
              You are responsible for maintaining the confidentiality of your login
              credentials and for all activities that occur under your account.
            </Typography>
          </Box>

          <Box mb={2}>
            <Typography variant="h6" gutterBottom>
              3. Job Listings and Applications
            </Typography>
            <Typography variant="body1" gutterBottom>
              Job providers are solely responsible for the accuracy and legality of job
              listings. Job seekers are responsible for ensuring the information they provide
              is truthful and accurate. NagaConnect is not liable for any issues arising from
              interactions between job seekers and providers.
            </Typography>
          </Box>

          <Box mb={2}>
            <Typography variant="h6" gutterBottom>
              4. Prohibited Activities
            </Typography>
            <Typography variant="body1" gutterBottom>
              Users must not:
            </Typography>
            <ul className="terms-list">
              <li>Post or share false, misleading, or illegal content.</li>
              <li>Attempt to hack, disrupt, or compromise the platform's security.</li>
              <li>Engage in any form of harassment, discrimination, or abusive behavior.</li>
            </ul>
          </Box>

          <Box mb={2}>
            <Typography variant="h6" gutterBottom>
              5. Limitation of Liability
            </Typography>
            <Typography variant="body1" gutterBottom>
              NagaConnect is not responsible for any direct or indirect damages arising from
              the use of the platform, including but not limited to loss of data, employment
              opportunities, or financial losses.
            </Typography>
          </Box>

          <Box mb={2}>
            <Typography variant="h6" gutterBottom>
              6. Privacy Policy
            </Typography>
            <Typography variant="body1" gutterBottom>
              Your privacy is important to us. Please review our Privacy Policy to
              understand how we collect, use, and protect your information.
            </Typography>
          </Box>

          <Box mb={2}>
            <Typography variant="h6" gutterBottom>
              7. Changes to Terms
            </Typography>
            <Typography variant="body1" gutterBottom>
              NagaConnect reserves the right to modify these terms at any time. Changes will
              be effective immediately upon posting. Continued use of the platform signifies
              your acceptance of the updated terms.
            </Typography>
          </Box>

          <Box>
            <Typography variant="body2" align="center" className="terms-footer">
              If you have any questions or concerns, feel free to contact us at
            </Typography>
              <p><a href={'mailto:vennamlaxman0413@gmail.com'}>support@nagaconnect.com.</a></p>
            
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default TermsAndConditions;

