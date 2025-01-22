import React, { useState } from 'react';
import {
  Typography,
  IconButton,
  TextField,
  Tabs,
  Tab,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import HeadsetMicIcon from '@mui/icons-material/HeadsetMic';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import LanguageIcon from '@mui/icons-material/Language';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
//import '../../styles/patientDashboard/helpCenter.scss';

const faqs = [
  {
    question: 'How do I schedule an appointment?',
    answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  },
  {
    question: 'Can I reschedule or cancel appointments?',
    answer: 'Yes, you can reschedule or cancel your appointments from the app or by contacting support.',
  },
  // Add more FAQs as needed
];

const contactOptions = [
  { label: 'Customer Service', icon: <HeadsetMicIcon />, detail: 'Available 24/7' },
  { label: 'WhatsApp', icon: <WhatsAppIcon />, detail: '(480) 555-0103' },
  { label: 'Website', icon: <LanguageIcon />, detail: 'www.example.com' },
  { label: 'Facebook', icon: <FacebookIcon />, detail: '@example' },
  { label: 'Twitter', icon: <TwitterIcon />, detail: '@example' },
  { label: 'Instagram', icon: <InstagramIcon />, detail: '@example' },
];

const HelpCenter: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [expanded, setExpanded] = useState<string | false>(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleTabChange = (_: React.ChangeEvent<{}>, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleAccordionChange =
    (panel: string) => (_: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  const filteredFaqs = faqs.filter((faq) =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="help-center">
      {/* Header with back button and title */}
      <Box display="flex" alignItems="center" padding="10px 0">
        <IconButton onClick={() => console.log('Back')} className="back-button">
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h6" className="title">
          Help Center
        </Typography>
      </Box>

      {/* Search bar */}
      <TextField
        fullWidth
        placeholder="Search"
        variant="outlined"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginBottom: '16px' }}
      />

      {/* Tabs for FAQ and Contact Us */}
      <Tabs value={activeTab} onChange={handleTabChange} centered>
        <Tab label="FAQ" />
        <Tab label="Contact Us" />
      </Tabs>

      {activeTab === 0 && (
        <>
          {/* FAQ Accordion */}
          {filteredFaqs.map((faq, index) => (
            <Accordion
              key={index}
              expanded={expanded === faq.question}
              onChange={handleAccordionChange(faq.question)}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>{faq.question}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>{faq.answer}</Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </>
      )}

      {activeTab === 1 && (
        <>
          {/* Contact Us Accordion */}
          {contactOptions.map((option, index) => (
            <Accordion
              key={index}
              expanded={expanded === option.label}
              onChange={handleAccordionChange(option.label)}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                {option.icon}
                <Typography style={{ marginLeft: 10 }}>{option.label}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>{option.detail}</Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </>
      )}
    </div>
  );
};

export default HelpCenter;
