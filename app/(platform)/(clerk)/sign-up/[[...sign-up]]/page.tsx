import { SignUp } from '@clerk/nextjs'

export default function Page() {
  return <SignUp />
}

import { SignUp } from '@clerk/nextjs'

export default function Page() {
  return <SignUp />
}
// "use client"; 
// import { useState } from 'react';
// import { SignUp } from '@clerk/nextjs';
// import ReCAPTCHA from 'react-google-recaptcha';

// export default function Page() {
//   const [captchaVerified, setCaptchaVerified] = useState(false);

//   const onCaptchaChange = (value: string | null) => {
//     if (value) {
//       setCaptchaVerified(true);  // CAPTCHA passed
//     } else {
//       setCaptchaVerified(false); // CAPTCHA failed or reset
//     }
//   };
  

//   return (
//     <div>
//       {/* CAPTCHA */}
//       <ReCAPTCHA
//         sitekey="6LdU0U8qAAAAAHvzYzZZzUygaRAmkQiFY_zgit-5"  // Replace with your Google reCAPTCHA site key
//         onChange={onCaptchaChange}
//       />

//       {/* Clerk Sign Up - only visible if CAPTCHA is verified */}
//       {captchaVerified ? (
//         <SignUp />
//       ) : (
//         <p>Please complete the CAPTCHA to sign up.</p>
//       )}
//     </div>
//   );
// }
