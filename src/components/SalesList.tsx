import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";

interface Sale {
  id: string;
  cliente: string;
  monto: number;
  metodo_pago: string;
  created_at: string;
}

interface SalesListProps {
  userId: string;
}

const SalesList = ({ userId }: SalesListProps) => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSales = async () => {
      const { data, error } = await supabase
        .from("sales")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(10);

      if (!error && data) {
        setSales(data);
      }
      setLoading(false);
    };

    fetchSales();

    // Subscribe to real-time updates
    const channel = supabase
      .channel("sales-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "sales",
          filter: `user_id=eq.${userId}`,
        },
        () => {
          fetchSales();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  if (loading) {
    return <p className="text-muted-foreground text-sm">Cargando ventas...</p>;
  }

  if (sales.length === 0) {
    return <p className="text-muted-foreground text-sm">No hay ventas registradas</p>;
  }

  return (
    <div className="space-y-3">
      {sales.map((sale) => (
        <div
          key={sale.id}
          className="flex justify-between items-start p-3 border rounded-lg hover:bg-muted/50 transition-colors"
        >
          <div className="flex-1">
            <p className="font-medium">{sale.cliente}</p>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="secondary">{sale.metodo_pago}</Badge>
              <span className="text-xs text-muted-foreground">
                {new Date(sale.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
          <p className="font-bold text-accent">${sale.monto.toFixed(2)}</p>
        </div>
      ))}
    </div>
  );
};

export default SalesList;