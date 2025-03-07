
import Layout from '@/components/layout/Layout';

const Habits = () => {
  return (
    <Layout 
      showBackButton={false} 
      showLogo={false}
      pageType="habits"
    >
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <h1 className="text-2xl font-bold mb-4">Coming soon!</h1>
        <p className="text-muted-foreground text-center max-w-md">
          Traccia e migliora le tue abitudini alimentari. Funzionalità in arrivo!
        </p>
      </div>
    </Layout>
  );
};

export default Habits;
