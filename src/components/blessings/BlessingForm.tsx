import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle } from "lucide-react";

interface BlessingFormProps {
  onBlessingSubmitted: () => void;
}

const BlessingForm: React.FC<BlessingFormProps> = ({ onBlessingSubmitted }) => {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const { toast } = useToast();

  // Validation helpers
  const isMessageEmpty = !message.trim();
  const isMessageValid = message.trim().length > 0 && message.length <= 250;

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isMessageEmpty) {
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 3000);
      return;
    }

    if (!isMessageValid) {
      toast({
        title: "Message too long",
        description: "Please keep your message under 250 characters.",
        variant: "destructive",
      });
      return;
    }

    // Show confirmation modal instead of submitting directly
    setShowConfirmation(true);
  };

  const handleConfirmSubmission = async () => {
    setIsSubmitting(true);
    setShowConfirmation(false);

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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && showConfirmation) {
      e.preventDefault();
      handleConfirmSubmission();
    }
    if (e.key === 'Escape' && showConfirmation) {
      setShowConfirmation(false);
    }
  };

  return (
    <TooltipProvider>
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
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div>
              <Input
                placeholder="Your name (optional)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-white/70 border-rose-200 focus:border-rose-400 transition-all duration-200 focus:shadow-md focus:scale-[1.01]"
              />
            </div>
            <div>
              <Textarea
                placeholder="Share your heartfelt message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                maxLength={250}
                className="bg-white/70 border-rose-200 focus:border-rose-400 min-h-[100px] transition-all duration-200 focus:shadow-md focus:scale-[1.01]"
                required
              />
              <div className="flex justify-between items-center mt-1">
                <p className={`text-xs transition-colors ${
                  message.length > 225 ? 'text-red-500' : 'text-rose-500'
                }`}>
                  {message.length}/250 characters
                </p>
                {!isMessageValid && message.length > 250 && (
                  <span className="text-xs text-red-500 flex items-center gap-1">
                    <AlertTriangle size={12} />
                    Too long
                  </span>
                )}
              </div>
            </div>
            
            <Tooltip open={showTooltip}>
              <TooltipTrigger asChild>
                <div className="w-full">
                  <Button 
                    type="submit" 
                    disabled={isSubmitting || isMessageEmpty}
                    className="w-full bg-rose-500 hover:bg-rose-600 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-[1.02]"
                  >
                    {isSubmitting ? 'Sending...' : 'Send your blessing'}
                  </Button>
                </div>
              </TooltipTrigger>
              <TooltipContent side="top" className="bg-red-500 text-white">
                <div className="flex items-center gap-1">
                  <AlertTriangle size={14} />
                  Please write a message first
                </div>
              </TooltipContent>
            </Tooltip>
          </form>
        </CardContent>
      </Card>

      {/* Confirmation Modal */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent 
          className="sm:max-w-md animate-scale-in"
          onKeyDown={handleKeyDown}
        >
          <DialogHeader>
            <DialogTitle className="text-center text-xl text-rose-800">
              📩 Ready to send your blessing?
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="bg-rose-50 p-4 rounded-lg border border-rose-200">
              <p className="text-sm text-rose-600 mb-2">
                <strong>From:</strong> {name.trim() || 'Anonymous'}
              </p>
              <p className="text-sm text-rose-800 italic">
                "{message.trim()}"
              </p>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setShowConfirmation(false)}
              className="border-rose-200 text-rose-700 hover:bg-rose-50"
            >
              Edit Message
            </Button>
            <Button
              onClick={handleConfirmSubmission}
              disabled={isSubmitting}
              className="bg-rose-500 hover:bg-rose-600 text-white"
            >
              {isSubmitting ? 'Sending...' : 'Confirm & Send'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
};

export default BlessingForm;