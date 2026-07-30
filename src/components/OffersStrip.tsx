import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { BadgePercent, Copy, Crown } from "lucide-react";
import { toast } from "sonner";

interface Coupon {
  id: string;
  code: string;
  title: string;
  description: string | null;
  min_order: number;
  premium_only: boolean;
}

const OffersStrip = () => {
  const { user } = useAuth();
  const [coupons, setCoupons] = useState<Coupon[]>([]);

  useEffect(() => {
    if (!user) { setCoupons([]); return; }
    (async () => {
      const { data } = await supabase
        .from("coupons")
        .select("id, code, title, description, min_order, premium_only")
        .eq("active", true)
        .order("min_order", { ascending: true });
      setCoupons((data as Coupon[]) || []);
    })();
  }, [user]);

  if (coupons.length === 0) return null;

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-2">
        <BadgePercent className="w-4 h-4 text-primary" />
        <h2 className="text-sm font-semibold text-foreground">Offers for you</h2>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {coupons.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => {
              navigator.clipboard?.writeText(c.code);
              toast.success(`Code ${c.code} copied — apply it at checkout`);
            }}
            className="shrink-0 min-w-[230px] text-left rounded-2xl border border-dashed border-primary/40 bg-primary/5 p-3 hover:bg-primary/10 transition"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="font-display font-bold text-foreground text-sm">{c.title}</span>
              {c.premium_only && <Crown className="w-3.5 h-3.5 text-loyalty" />}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{c.description}</p>
            <div className="flex items-center gap-1.5 mt-2 text-xs font-mono font-semibold text-primary">
              {c.code} <Copy className="w-3 h-3" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default OffersStrip;