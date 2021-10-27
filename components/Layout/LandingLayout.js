import Footer from './landing/Footer';
import LandingNav from './landing/LandingNav/index';

export default function LandingLayout({ children }) {
  return (
    <div>
      <LandingNav />
      {children}
      <Footer />
    </div>
  );
}
