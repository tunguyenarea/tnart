import Header from '@/app/ui/header';
import Footer from '@/app/ui/footer';
import SignoutForm from '@/components/custom/signout-form';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
  <>

    <div>
      <Header />
      <SignoutForm />
      {children}
      <Footer />
    </div>

  </>
  );
}
