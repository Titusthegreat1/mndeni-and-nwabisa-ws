import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from 'date-fns';

interface Blessing {
  id: string;
  name: string | null;
  message: string;
  likes: number;
  created_at: string;
}

interface BlessingWallProps {
  refreshTrigger: number;
}

const BlessingWall: React.FC<BlessingWallProps> = ({ refreshTrigger }) => {
  const [blessings, setBlessings] = useState<Blessing[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCount, setShowCount] = useState(50);
  const [totalCount, setTotalCount] = useState(0);
  const { toast } = useToast();

  const fetchBlessings = async () => {
    try {
      // Get total count
      const { count } = await supabase
        .from('blessings')
        .select('*', { count: 'exact', head: true });

      setTotalCount(count || 0);

      // Get blessings with limit
      const { data, error } = await supabase
        .from('blessings')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(showCount);

      if (error) throw error;
      setBlessings(data || []);
    } catch (error) {
      console.error('Error fetching blessings:', error);
      toast({
        title: "Error",
        description: "Failed to load blessings. Please refresh the page.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (id: string, currentLikes: number) => {
    try {
      const { error } = await supabase
        .from('blessings')
        .update({ likes: currentLikes + 1 })
        .eq('id', id);

      if (error) throw error;

      setBlessings(prev => 
        prev.map(blessing => 
          blessing.id === id 
            ? { ...blessing, likes: blessing.likes + 1 }
            : blessing
        )
      );
    } catch (error) {
      console.error('Error liking blessing:', error);
      toast({
        title: "Error",
        description: "Failed to like the message. Please try again.",
        variant: "destructive",
      });
    }
  };

  const loadMoreBlessings = () => {
    setShowCount(prev => prev + 50);
  };

  useEffect(() => {
    fetchBlessings();
  }, [refreshTrigger, showCount]);

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-rose-600">Loading blessings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-center text-rose-800 mb-6">
        Wall of Blessings ({totalCount} messages)
      </h3>
      
      {blessings.length === 0 ? (
        <Card className="bg-gradient-to-br from-rose-50/50 to-pink-50/50 border-rose-200">
          <CardContent className="py-8 text-center">
            <p className="text-rose-600">Be the first to leave a blessing! 💕</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 max-h-[600px] overflow-y-auto pr-2">
          {blessings.map((blessing) => (
            <Card 
              key={blessing.id} 
              className="bg-gradient-to-br from-white/90 to-rose-50/60 border-rose-200 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.02] group"
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-rose-800">
                    {blessing.name || 'Anonymous'}
                  </h4>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleLike(blessing.id, blessing.likes)}
                      className="p-1 h-auto text-rose-500 hover:text-rose-600 hover:bg-rose-100 group-hover:animate-pulse"
                    >
                      <Heart className="w-4 h-4" />
                    </Button>
                    <span className="text-sm text-rose-600">{blessing.likes}</span>
                  </div>
                </div>
                <p className="text-gray-700 italic mb-2 leading-relaxed">
                  "{blessing.message}"
                </p>
                <p className="text-xs text-rose-500">
                  {formatDistanceToNow(new Date(blessing.created_at), { addSuffix: true })}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      {totalCount > showCount && (
        <div className="text-center pt-4">
          <Button 
            onClick={loadMoreBlessings}
            variant="outline"
            className="border-rose-200 text-rose-600 hover:bg-rose-50"
          >
            Load More Blessings ({totalCount - showCount} remaining)
          </Button>
        </div>
      )}
    </div>
  );
};

export default BlessingWall;