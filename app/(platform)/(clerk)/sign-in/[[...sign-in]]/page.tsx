
"use client"; 
import { useState } from 'react';
import { SignIn } from '@clerk/nextjs';
import ReCAPTCHA from 'react-google-recaptcha';

export default function Page() {
  const [captchaVerified, setCaptchaVerified] = useState(false);

  const onCaptchaChange = (value: string | null) => {
    if (value) {
      setCaptchaVerified(true);  // CAPTCHA passed
    } else {
      setCaptchaVerified(false); // CAPTCHA failed or reset
    }
  };
  

  return (
    <div>
      {/* CAPTCHA */}
      <ReCAPTCHA
        sitekey="6LcNlVIqAAAAAMERqPDMqxdDXr2dzxXywGnNWLW4"  // Replace with your Google reCAPTCHA site key
        onChange={onCaptchaChange}
      />

      {/* Clerk Sign Up - only visible if CAPTCHA is verified */}
      {captchaVerified ? (
        <SignIn />
      ) : (
        <p>Please complete the CAPTCHA to sign in.</p>
      )}
    </div>
  );
}
