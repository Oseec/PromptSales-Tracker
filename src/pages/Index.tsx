import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/10 via-background to-accent/10">
      <div className="text-center space-y-6 px-4">
        <h1 className="text-6xl font-bold text-primary mb-2">PromptSales</h1>
        <p className="text-xl text-muted-foreground max-w-md mx-auto">
          Gestiona tus ventas de forma simple y efectiva
        </p>
        <div className="flex gap-4 justify-center mt-8">
          <Button size="lg" onClick={() => navigate("/auth")}>
            Comenzar
          </Button>
          <Button size="lg" variant="outline" onClick={() => navigate("/auth")}>
            Iniciar Sesión
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
