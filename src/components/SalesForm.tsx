import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const isTestMode = import.meta.env.VITE_TEST_MODE === 'true';


interface SalesFormProps {
  userId: string;
}

const SalesForm = ({ userId }: SalesFormProps) => {
  const [cliente, setCliente] = useState("");
  const [monto, setMonto] = useState("");
  const [metodoPago, setMetodoPago] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  try {
    if (!isTestMode) {
      // En modo normal, sí usamos Supabase
      if (!userId) {
        toast({
          title: "Error",
          description: "Usuario no autenticado",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from("sales")
        .insert({
          user_id: userId,
          cliente,
          monto: parseFloat(monto),
          metodo_pago: metodoPago,
        });

      if (error) {
        throw error;
      }
    }

    // En modo test o si Supabase salió bien, mostramos el toast de éxito
    toast({
      title: "¡Venta creada!",
      description: `Venta de $${monto} registrada exitosamente`,
    });

    // Limpiar formulario
    setCliente("");
    setMonto("");
    setMetodoPago("");
  } catch (error: any) {
    toast({
      title: "Error al crear venta",
      description: error.message ?? "Ocurrió un error desconocido",
      variant: "destructive",
    });
  } finally {
    setLoading(false);
  }
};


  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="cliente">Cliente</Label>
        <Input
          id="cliente"
          placeholder="Nombre del cliente"
          value={cliente}
          onChange={(e) => setCliente(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="monto">Monto</Label>
        <Input
          id="monto"
          type="number"
          step="0.01"
          placeholder="0.00"
          value={monto}
          onChange={(e) => setMonto(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="metodoPago">Método de Pago</Label>
        <Select value={metodoPago} onValueChange={setMetodoPago} required>
          <SelectTrigger>
            <SelectValue placeholder="Selecciona método" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="efectivo">Efectivo</SelectItem>
            <SelectItem value="tarjeta">Tarjeta</SelectItem>
            <SelectItem value="transferencia">Transferencia</SelectItem>
            <SelectItem value="otro">Otro</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Guardando..." : "Crear Venta"}
      </Button>
    </form>
  );
};

export default SalesForm;