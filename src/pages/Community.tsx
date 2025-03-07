
import Layout from '@/components/layout/Layout';

const Community = () => {
  return (
    <Layout 
      showBackButton={false} 
      showLogo={false}
      pageType="community"
    >
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <h1 className="text-2xl font-bold mb-4">Coming soon!</h1>
        <p className="text-muted-foreground text-center max-w-md">
          Connettiti con altri utenti, condividi ricette e scopri nuove idee. Funzionalità in arrivo!
        </p>
      </div>
    </Layout>
  );
};

export default Community;
