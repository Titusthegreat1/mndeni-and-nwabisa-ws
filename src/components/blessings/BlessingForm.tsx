import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface BlessingFormProps {
  onBlessingSubmitted: () => void;
}

const BlessingForm: React.FC<BlessingFormProps> = ({ onBlessingSubmitted }) => {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) {
      toast({
        title: "Message required",
        description: "Please write a message before submitting.",
        variant: "destructive",
      });
      return;
    }

    if (message.length > 250) {
      toast({
        title: "Message too long",
        description: "Please keep your message under 250 characters.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const submittedName = name.trim() || 'Anonymous';
      
      // Check for duplicates
      const { data: existingBlessings } = await supabase
        .from('blessings')
        .select('*')
        .eq('name', submittedName)
        .eq('message', message.trim());

      if (existingBlessings && existingBlessings.length > 0) {
        toast({
          title: "Duplicate message",
          description: "This exact message has already been shared.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      const { error } = await supabase
        .from('blessings')
        .insert([
          {
            name: submittedName,
            message: message.trim(),
          }
        ]);

      if (error) throw error;

      toast({
        title: "Your message has been shared with love ❤️",
        description: "Thank you for your beautiful blessing!",
      });

      setName('');
      setMessage('');
      onBlessingSubmitted();
    } catch (error) {
      console.error('Error submitting blessing:', error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="bg-gradient-to-br from-rose-50/80 to-pink-50/80 border-rose-200">
      <CardHeader>
        <CardTitle className="text-2xl text-center text-rose-800">
          💌 Leave a Message for Mndeni & Nwabisa
        </CardTitle>
        <p className="text-center text-rose-600 text-sm">
          These messages will be shared with the couple before their big day 💍
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              placeholder="Your name (optional)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-white/70 border-rose-200 focus:border-rose-400"
            />
          </div>
          <div>
            <Textarea
              placeholder="Share your heartfelt message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={250}
              className="bg-white/70 border-rose-200 focus:border-rose-400 min-h-[100px]"
              required
            />
            <p className="text-xs text-rose-500 mt-1">
              {message.length}/250 characters
            </p>
          </div>
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-rose-500 hover:bg-rose-600 text-white"
          >
            {isSubmitting ? 'Sending...' : 'Send your blessing'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default BlessingForm;