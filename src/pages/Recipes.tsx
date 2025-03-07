
import Layout from '@/components/layout/Layout';

const Recipes = () => {
  return (
    <Layout 
      showBackButton={false} 
      showLogo={false}
      pageType="recipes"
    >
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <h1 className="text-2xl font-bold mb-4">Coming soon!</h1>
        <p className="text-muted-foreground text-center max-w-md">
          Le migliori ricette personalizzate basate sulla tua dispensa e le tue preferenze. Presto disponibile!
        </p>
      </div>
    </Layout>
  );
};

export default Recipes;
